import AudioPlayer from './components/AudioPlayer.js';
import Controller from './components/Controller.js';
import Info from './components/Info.js';
import Menu from './components/Menu.js';
import Modal from './components/Modal.js';
import PeekABoo from './components/PeekABoo.js';
import RangeBar from './components/RangeBar.js';
import Splash from './components/Splash.js';

let appData;
let audioPlayer;

let splash;
let peekaboo;
let modal;
let info;
let controller;
let scrub;
let volumeBar;
let menu;

// const API_URL = "https://musicplayer.brunoperry.net";
// const API_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3000/music';

let isOnline = navigator.onLine;
let peekabooMessage = null;

window.onload = async () => {
  if (setupPWA()) {
    await initialize(`${API_URL}/data`, true);
  }

  if (!isOnline) {
    Splash.OFFLINE();
    appData = [
      {
        type: 'open',
        name: 'open...',
      },
      {
        type: 'exit',
        name: 'exit',
      },
    ];
  }
  setupLayout();
  setupAudio();
  if (peekabooMessage) {
    addUpdateButton(peekabooMessage);
  }

  const URLData = getPlaylistFromPath();

  if (URLData) {
    audioPlayer.pl = URLData.playlist;
    audioPlayer.currentTrack = URLData.track;
    info.update(audioPlayer.currentTrack);
  }
};

const setupPWA = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
    navigator.serviceWorker.addEventListener('message', (event) => {
      switch (event.data.type) {
        case 'update':
          if (peekaboo) {
            addUpdateButton(event.data.message);
          } else {
            peekabooMessage = event.data.message;
          }
          break;

        default:
          break;
      }
    });
    if (isMobileDevice()) {
      // screen.orientation.lock("portrait");
    }
  } else {
    alert('Your browser does not support this app...');
    return false;
  }
  window.ononline = async () => {
    isOnline = true;
    peekaboo.show('You are online');
    console.log('api_url');
    await initialize(`${API_URL}/data`);
    menu.data = appData;
  };
  window.onoffline = async () => {
    isOnline = false;
    peekaboo.show('You are offline', 'warning');
    await initialize(`${API_URL}/data`);
    menu.data = appData;
  };
  return true;
};

const initialize = async (api_url = API_URL, withSplash = false) => {
  if (withSplash) splash = new Splash();

  if (!isOnline) {
    appData = [
      {
        type: 'open',
        name: 'open...',
      },
      {
        type: 'exit',
        name: 'exit',
      },
    ];
    return;
  }
  try {
    let headerConfig;
    const token = localStorage.getItem('musicplayertoken');
    if (token) {
      headerConfig = {
        Authorization: `Bearer ${token}`,
        'Accept-Encoding': 'gzip',
      };
    } else {
      headerConfig = {
        'Accept-Encoding': 'gzip',
      };
    }
    const req = await fetch(api_url, {
      headers: headerConfig,
    });
    appData = await req.json();

    if (withSplash) splash.delete();
  } catch (error) {
    withSplash
      ? splash.error()
      : peekaboo.show('Something went wrong...', 'error');

    addRetryButton();
  }
};

const setupLayout = () => {
  peekaboo = new PeekABoo('#peek-a-boo');

  modal = new Modal('#modal', (value) => {
    console.log('modal', value);
  });

  info = new Info('#info', async (value) => {
    switch (value.type) {
      case 'opening':
        controller.translateY(20);
        scrub.translateY(20);
        volumeBar.translateY(10);
        break;
      case 'closing':
        controller.translateY(0);
        scrub.translateY(0);
        volumeBar.translateY(0);
        break;
      case 'share':
        if (audioPlayer.currentTrack?.type !== 'file') {
          try {
            await navigator.clipboard.writeText(window.location.href);
            peekaboo.show('Copied to clipboard!');
          } catch (error) {
            peekaboo.show(error, 'error');
          }
        }
        break;
    }
  });

  controller = new Controller('#controller', (action) => {
    switch (action) {
      case 'play':
        audioPlayer.currentTrack ? audioPlayer.play() : menu.open();
        break;
      case 'pause':
        audioPlayer.pause();
        break;
      case 'next':
        audioPlayer.next();
        break;
      case 'previous':
        audioPlayer.previous();
        break;
    }
  });

  scrub = new RangeBar('#scrub', (value) => {
    audioPlayer.currentTime = value;
  });

  volumeBar = new RangeBar('#volume', (value) => {
    audioPlayer.volume = value;
  });

  menu = new Menu('#menu', async (value) => {
    switch (value.type) {
      case 'opening':
        info.close();
        info.scale(0.9);
        controller.scale(0.9);
        volumeBar.scale(0.9);
        scrub.scale(0.9);
        break;
      case 'closing':
        info.scale(1);
        controller.scale(1);
        volumeBar.scale(1);
        scrub.scale(1);
        break;
      case 'music':
      case 'stream':
      case 'file':
        menu.close();
        await audioPlayer.play(value, fetchPlaylist(appData, value.id));
        break;
      case 'open':
        document.querySelector('#file-input').click();
        break;
      case 'reset':
        menu.close();
        await initialize(`${API_URL}/reset`);
        menu.data = appData;
        peekaboo.show('Data updated!');
        break;
      case 'login':
        modal.show('login');
        break;
      case 'logout':
        localStorage.removeItem('musicplayertoken');
        window.location = '/logout';
        break;
      case 'exit':
        window.close();
        break;
      case 'retry':
      case 'update':
        location.reload();
        break;
    }
  });
  menu.data = appData;

  const fileInput = document.querySelector('#file-input');
  fileInput.onchange = async () => {
    const localPlaylist = [];
    Array.from(fileInput.files).forEach((file) => {
      localPlaylist.push({
        id: file.name,
        name: file.name,
        type: 'file',
        url: URL.createObjectURL(file),
      });
    });
    menu.close();
    await audioPlayer.play(localPlaylist[0], localPlaylist);
  };
};

const setupAudio = () => {
  audioPlayer = new AudioPlayer((action, error = null) => {
    if (action !== 'progress') controller.setState(action);

    switch (action) {
      case 'loading':
        info.update({
          name: audioPlayer.currentTrack.name,
          type: 'loading',
        });
        break;
      case 'error':
        info.update({
          name: audioPlayer.currentTrack.name,
          type: 'error',
          error: error,
        });
        break;
      case 'play':
        scrub.element.style.display =
          audioPlayer.duration === Infinity ? 'none' : 'flex';
        info.update(audioPlayer.currentTrack);
        menu.setTrail(audioPlayer.currentTrack.id);
        setURL(audioPlayer.currentTrack.id);
        break;
      case 'pause':
        menu.setTrail(null);
        break;
      case 'progress':
        scrub.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        break;

      default:
        break;
    }
  });
  audioPlayer.volume = volumeBar.value;
};

const fetchPlaylist = (node, itemID) => {
  let item = null;
  for (let i = 0; i < node.length; i++) {
    const n = node[i];
    if (n.children) item = fetchPlaylist(n.children, itemID);
    else if (n.id === itemID) item = node;

    if (item) break;
  }
  return item;
};

const getPlaylistFromPath = () => {
  const out_path = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (out_path.path === null || out_path.path === 'none') return null;

  const pl = fetchPlaylist(appData, out_path.path);
  let trk = null;
  if (pl) {
    for (let i = 0; i < pl.length; i++) {
      const t = pl[i];
      if (t.id === out_path.path) {
        trk = t;
        break;
      }
    }
  }
  return trk
    ? {
        playlist: pl,
        track: trk,
      }
    : null;
};

const addUpdateButton = (message) => {
  peekaboo.show(message);
  appData.push({
    type: 'update',
    name: 'update',
  });
  menu.data = appData;
};

const addRetryButton = (message) => {
  appData = [
    {
      type: 'open',
      name: 'open...',
    },
    {
      type: 'exit',
      name: 'exit',
    },
    {
      type: 'retry',
      name: 'retry',
    },
  ];
  if (menu) menu.data = appData;
};

const isMobileDevice = () => {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
};

const setURL = (path = 'none') => {
  history.replaceState({}, '', `?path=${path}`);
};
