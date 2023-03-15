import AudioPlayer from "./components/AudioPlayer.js";
import Controller from "./components/Controller.js";
import Info from "./components/Info.js";
import Menu from "./components/Menu.js";
import PeekABoo from "./components/PeekABoo.js";
import RangeBar from "./components/RangeBar.js";
import Splash from "./components/Splash.js";

let appData;
let audioPlayer;

let splash;
let peekaboo;
let info;
let controller;
let scrub;
let volumeBar;
let menu;

// const API_URL = "https://shrouded-fire-liver.glitch.me/";
const API_URL = "https://musicplayer.brunoperry.net/";

let isOnline = navigator.onLine;
let peekabooMessage = null;

window.onload = async () => {
  // if (!setupPWA()) return;

  if (setupPWA()) {
    await initialize(API_URL, true);
  }

  if (!isOnline) {
    Splash.OFFLINE();
    appData = [
      {
        type: "open",
        name: "open...",
      },
      {
        type: "exit",
        name: "exit",
      },
    ];
  }
  // await initialize(API_URL, true);
  setupLayout();
  setupAudio();
  if (peekabooMessage) {
    addUpdateButton(peekabooMessage);
  }
};

const setupPWA = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
    navigator.serviceWorker.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "update":
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
    if (isMobileDevice()) screen.orientation.lock("portrait");
  } else {
    alert("Your browser does not support this app...");
    return false;
  }
  window.ononline = async () => {
    isOnline = true;
    peekaboo.show("You are online");
    await initialize();
    menu.data = appData;
  };
  window.onoffline = async () => {
    isOnline = false;
    peekaboo.show("You are offline", "warning");
    await initialize();
    menu.data = appData;
  };
  return true;
};

const initialize = async (api_url = API_URL, withSplash = false) => {
  if (withSplash) splash = new Splash();

  if (!isOnline) {
    appData = [
      {
        type: "open",
        name: "open...",
      },
      {
        type: "exit",
        name: "exit",
      },
    ];
    return;
  }
  try {
    const req = await fetch(api_url, {
      headers: {
        "Accept-Encoding": "gzip",
      },
    });
    const apiData = await req.json();
    appData = [
      ...apiData,
      {
        type: "open",
        name: "open...",
      },
      {
        type: "reset",
        name: "reset",
      },
      {
        type: "exit",
        name: "exit",
      },
    ];
    if (withSplash) splash.delete();
  } catch (error) {
    console.log("ERROR", error);
    withSplash ? splash.error() : peekaboo.show("Something went wrong...", "error");

    addRetryButton();
  }
};

const setupLayout = () => {
  peekaboo = new PeekABoo("#peek-a-boo");

  info = new Info("#info", (value) => {
    switch (value.type) {
      case "opening":
        controller.translateY(20);
        scrub.translateY(20);
        volumeBar.translateY(10);
        break;
      case "closing":
        controller.translateY(0);
        scrub.translateY(0);
        volumeBar.translateY(0);
        break;
    }
  });

  controller = new Controller("#controller", (action) => {
    switch (action) {
      case "play":
        audioPlayer.currentTrack ? audioPlayer.play() : menu.open();
        break;
      case "pause":
        audioPlayer.pause();
        break;
      case "next":
        audioPlayer.next();
        break;
      case "previous":
        audioPlayer.previous();
        break;
    }
  });

  scrub = new RangeBar("#scrub", (value) => {
    audioPlayer.scrub(value);
  });

  volumeBar = new RangeBar("#volume", (value) => {
    audioPlayer.volume = value;
  });

  menu = new Menu("#menu", async (value) => {
    switch (value.type) {
      case "opening":
        info.close();
        info.scale(0.9);
        controller.scale(0.9);
        volumeBar.scale(0.9);
        scrub.scale(0.9);
        break;
      case "closing":
        info.scale(1);
        controller.scale(1);
        volumeBar.scale(1);
        scrub.scale(1);
        break;
      case "music":
      case "radio":
      case "file":
        menu.close();
        await audioPlayer.play(value, fetchPlaylist(appData, value.id));
        break;
      case "open":
        document.querySelector("#file-input").click();
        break;
      case "reset":
        menu.close();
        await initialize(`${API_URL}reset`);
        menu.data = appData;
        peekaboo.show("Data updated!");
        break;
      case "exit":
        window.close();
        break;
      case "retry":
      case "update":
        location.reload();
        break;
    }
  });
  menu.data = appData;

  const fileInput = document.querySelector("#file-input");
  fileInput.onchange = async () => {
    const localPlaylist = [];
    Array.from(fileInput.files).forEach((file) => {
      localPlaylist.push({
        id: file.name,
        name: file.name,
        type: "file",
        url: URL.createObjectURL(file),
      });
    });
    menu.close();
    await audioPlayer.play(localPlaylist[0], localPlaylist);
  };
};

const setupAudio = () => {
  audioPlayer = new AudioPlayer((action, error = null) => {
    if (action !== "progress") controller.setState(action);

    switch (action) {
      case "loading":
        info.update({
          name: audioPlayer.currentTrack.name,
          type: "loading",
        });
        break;
      case "error":
        info.update({
          name: audioPlayer.currentTrack.name,
          type: "error",
          error: error,
        });
        break;
      case "play":
        scrub.element.style.display = audioPlayer.duration === Infinity ? "none" : "flex";
        info.update(audioPlayer.currentTrack);
        menu.setTrail(audioPlayer.currentTrack.id);
        break;
      case "pause":
        menu.setTrail(null);
        break;
      case "progress":
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

const addUpdateButton = (message) => {
  peekaboo.show(message);
  appData.push({
    type: "update",
    name: "update",
  });
  menu.data = appData;
};

const addRetryButton = (message) => {
  appData = [
    {
      type: "open",
      name: "open...",
    },
    {
      type: "exit",
      name: "exit",
    },
    {
      type: "retry",
      name: "retry",
    },
  ];
  if (menu) menu.data = appData;
};

const isMobileDevice = () => {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
};
