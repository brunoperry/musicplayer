import Utils from "../Utils.js";

export default class Splash {

    constructor() {}

    async doSplash(mainContainer) {
        const splash = document.querySelector('#splash');
        const child = splash.querySelectorAll('.a, .b');
        const splashContainer = splash.querySelector('.splash-container');
        const logo = splashContainer.querySelector('svg');
        splashContainer.removeChild(logo);

        Utils.Spin(mainContainer);
        child[0].style.transform = 'translateY(-100%)';
        child[1].style.transform = 'translateY(100%)';
        await Utils.Wait();
        document.body.removeChild(splash); 
    }
}