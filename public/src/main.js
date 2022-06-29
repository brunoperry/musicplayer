import Controls from "./components/Controls.js";
import Info from "./components/Info.js";
import Menu from "./components/Menu.js";
import RangeSlider from "./components/inputs/RangeSlider.js";
import Player from "./components/Player.js";
import Utils from "./Utils.js";
import Locker from "./components/Locker.js";
import Settings from "./components/Settings.js";
import Splash from "./components/Splash.js";
import { getDB, updateDB } from "./backend.js";


const mainContainer = document.querySelector('#main-container');
const uiContainer = document.querySelector('#ui');
const subUI = uiContainer.querySelector('#ui-sub');

let isReady = false;
window.onload = async () => {
    document.body.style.opacity = 1;
}

const doSplash = async () => {

    if(isReady) return;
    isReady = true;

    await new Splash().doSplash(mainContainer);
}

// const data = await getAllData('music');
// doSplash();
// const f = JSON.stringify(data)
// console.log(f);

const req = await fetch('data.json');
const data = await req.json();

// const ddata = await getDB('settings');
// // doSplash();
// const f = JSON.stringify(ddata)
// console.log(f);

const sets = await fetch('settings.json');
const settingsData = await sets.json();
doSplash();
// console.log(data);

const info = new Info();
info.addEventListener(Info.States.ON_ACTION, ev => {

    switch (ev.detail) {
        case Info.States.OPENING:
            Utils.PeekY(subUI, '5%')
            break;
        case Info.States.CLOSING:
            Utils.PeekY(subUI, '0')
            break;
        default:
            break;
    }
})

const controls = new Controls();
controls.addEventListener(Controls.States.ON_ACTION, async ev => {

    switch(ev.detail.state) {
        case Controls.States.PREVIOUS:
            player.previous();
            break;
        case Controls.States.PLAYING:
            player.pause();
            break;
        case Controls.States.PAUSED:
            if(!menu.isOpened && !player.currentTrack) {
                menu.open();
                break;
            }
            await player.play();
            break;
        case Controls.States.NEXT:
            player.next();
            break;
    }
})

const progressBar = new RangeSlider('#progress-bar');
progressBar.addEventListener(RangeSlider.Actions.ON_INPUT, ev => {
    if(player.duration !== Number.POSITIVE_INFINITY) player.currentTime = ev.detail;
})

const volume = new RangeSlider('#volume');
volume.addEventListener(RangeSlider.Actions.ON_INPUT, () => {
    player.volume = volume.value;
})

const menu = new Menu(data)
menu.addEventListener(Menu.ACTION, async ev => {
    switch (ev.detail.action) {
        case 'opening':
            Utils.PeekY(uiContainer, '-10%');
            if(info.isOpened) info.close();
            break;
        case 'play':
            menu.close();
            const detail =  ev.detail;
            const listData = detail.listData.children;
            player.play(listData, listData.findIndex(itm => itm.id === detail.currentItem.id));
            break;
        case 'closing':
            Utils.PeekY(uiContainer);
            break;
        case 'lock':
            menu.close();
            locker.show();
            break;
        case 'settings':
            // menu.close();
            settings.show();
            break;
        case 'open':
            Utils.OpenFiles(files => {
                if(!files.length) return;
                player.play(files, 0);
                menu.close();
            });
            break;
        default:
            break;
    }
});

const locker = new Locker();
locker.addEventListener(Locker.ACTION, ev => {

    switch (ev.detail.type) {
        case Locker.Actions.OPENING:
            Utils.Scale(mainContainer, '0.5');
            break;
        case Locker.Actions.CLOSING:
            Utils.Scale(mainContainer, '1.0');
            break;
        default:
            break;
    }
})
const settings = new Settings(settingsData[0].data);
settings.addEventListener(Settings.ACTION, async ev => {


    const doSettingUpdate = (data) => {

        switch(data.type) {
            case 'playmode':
                player.playmode = data.value;
            break;
            case 'theme':
                player.playmode = data.value;
            break;
        }
    }

    switch (ev.detail.type) {
        case Settings.Actions.HAS_CHANGED:

            const res = await updateDB('settings',ev.detail.data);
            settings.unlock(res)

            doSettingUpdate(ev.detail.data);
        break;
        case Settings.Actions.OPENING:
            Utils.Scale(mainContainer, '0.5');
            break;
        case Settings.Actions.CLOSING:
            Utils.Scale(mainContainer, '1');
            break;
        default:
            break;
    }
})

const playerData = Utils.getBrowserPath();
let playlist = [];
let currentTrack = null;
if(playerData) {
    let pData = Utils.getDataFromPath(data, playerData.join('/'));
    if(pData) {
        playlist = pData.parent;
        currentTrack = pData.item;
    }
}
const player = new Player(playlist, currentTrack);
player.addEventListener(Player.ACTION, ev => {
    switch(ev.detail.type) {
        case Player.Actions.LOADING:
            controls.state = Controls.States.SEEKING;
            info.update(Info.States.DISABLED, player.currentTrack);
            break;
        case Player.Actions.PLAYING:
            controls.state = Controls.States.PLAYING;
            info.update(Info.States.ENABLED, player.currentTrack);

            let url = '?path=none';
            if(player.currentTrack.type !== 'file') url = `?path=${player.currentTrack.path}`;
            history.URL(url);

            if(Number.isFinite(player.duration)) {
                progressBar.animated = true;
                progressBar.show();
            } else {
                progressBar.animated = false;
                progressBar.hide();
            }
            menu.activated = true;
            break;
        case Player.Actions.ENDED:
            // info.update(Info.States.DISABLED, player.currentTrack);
            controls.state = Controls.States.PAUSED;
            break;
        case Player.Actions.PAUSED:
            info.update(Info.States.DISABLED, {
                ...player.currentTrack,
                duration: player.duration,
                currentTime: player.currentTime
            });
            controls.state = Controls.States.PAUSED;
            menu.activated = false;
            break;
        case Player.Actions.VOLUME:
            volume.value = player.volume;
            break;
        case Player.Actions.TIME_UPDATE:
            progressBar.value = ev.detail.time;
            progressBar.animateBackground();
        break;
        case Player.Actions.ERROR:
            console.log(ev.detail);
            info.update(Info.States.ERROR, player.currentTrack);
            controls.state = Controls.States.ERROR;
            info.state = Info.States.ERROR;
        break;
    }
})
player.volume = volume.value;

player.currentTrack ? info.title = player.currentTrack.title : info.title = 'Music Player';