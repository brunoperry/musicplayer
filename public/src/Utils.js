class Utils {

    static SPEED = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--speed').replace('s', '')) * 1000;
    static IS_MOBILE = window.matchMedia("(any-pointer:coarse)").matches;
    static #INITIALIZED = false;

    constructor() {}

    static init() {
        if(this.#INITIALIZED) return;
        this.#INITIALIZED = true;
        history.URL = ev => {
            history.replaceState({}, '', ev);
            window.dispatchEvent(new Event('locationchange'));
        };
    }

    static getIcon(iconName, animName=null) {
        let icons = [...document.querySelector('#icons-template').content.cloneNode(true).children];
        const ico = icons.find(btn =>  `icon-${iconName}` === `${btn.className.baseVal}`);
        animName ? ico.setAttribute('class', `icon-${iconName} ${animName} icon`) : ico.setAttribute('class', `icon-${iconName} icon`);
        return ico;
    }
    static getButton(buttonType) {
        const btns = [...document.querySelector('#buttons-template').content.cloneNode(true).children];
        const btn = btns.find(btn =>`${buttonType}-button` === `${btn.className}`);
        return btn;
    }
    static getBrowserPath() {
        const out = new Proxy(new URLSearchParams(window.location.search), {get: (searchParams, prop) => searchParams.get(prop)})
        if(out.path === null || out.path === 'none') return [];
        return out.path.split('/');
    }
    static getDataFromPath(data, path) {
        let out = null;
        let parent = null;
        const seek = (d) => {
            parent = d;
            for (let i = 0; i < d.length; i++) {
                const itm = d[i];
                const fullpath = `${itm.path}`;
                if(itm.children && fullpath !== path) {
                    parent = itm;
                    seek(itm.children);
                } else if(fullpath === path) {
                    out = {parent: parent,item: itm}
                    break;
                };
            }
            return out;
        }
        return seek(data);
    }

    //SET EVENTS
    static setStartTouchOrMouseEvent(elem, callback) {
        if(this.IS_MOBILE) elem.addEventListener('touchstart', e => callback({x: e.touches[0].clientX,y: e.touches[0].clientY})
        ,{passive: true} )
        else elem.addEventListener( 'mousedown', e => callback({x: e.clientX,y: e.clientY}) )
    }
    static setEndTouchOrMouseEvent(elem, callback) {

        this.IS_MOBILE ? 
        elem.ontouchend = ev => {
            let cX,cY;
            if(ev.touches.length) {
                cX = ev.touches[0].clientX;
                cY = ev.touches[0].clientY;
            } else {
                cX = ev.changedTouches[0].clientX;
                cY = ev.changedTouches[0].clientY;
            }
            callback({x:cX, y:cY})
        } :
        elem.onmouseup = ev => {callback({x: ev.clientX,y: ev.clientY})}
    }
    static setMoveEvent(elem, callback) {
        const w = window.innerWidth / 2;
        const h = window.innerHeight / 2;
        this.IS_MOBILE ? 
        elem.ontouchmove = ev => {callback({x: ev.touches[0].clientX-w,y: ev.touches[0].clientY-h})} : 
        elem.onmousemove = ev => {callback({x: ev.clientX-w,y: ev.clientY-h})}
    }
    static unsetTouchOrMouseEvents(elem) {
        if(this.IS_MOBILE) elem.ontouchstart,elem.ontouchend,elem.ontouchmove = null;
        else elem.onmousedown,elem.onmouseup,elem.onmousemove = null;
    }

    //UTILITIES
    static Wait(mili=this.SPEED) {
        return new Promise((resolve, reject) => setTimeout(() => { resolve(true); }, mili));
    }
    static OpenFiles(callback=null) {
        if(!callback) throw new Error('Need callback to open files...');
        let playList = [];
        let input = document.querySelector('#files-input');
        input.onchange = () => {
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];
                playList.push({
                    id: i.toString(),
                    title: file.name.replace('.mp3', ''),
                    url: URL.createObjectURL(file),
                    type: 'file',
                    action: 'play',
                })
            }
            callback(playList);
        }
        input.click();  
    } 
    

    //TRANSFORMS
    static Opacity(elem, val) {  elem.style.opacity = val;}
    static TranslateY(elem, val) {
        let vec = {
            x: 0,
            y: val
        }
        if(!val.includes('%')) {
            vec.y = val + 'px';
        }
        return this.Translate(elem, vec)
    }
    static TranslateX(elem, val) {
        let vec = {
            x: val,
            y: 0
        }
        if(!val.includes('%')) {
            vec.x = val + 'px';
        }
        return this.Translate(elem, vec)
    }
    static Translate(elem, vec) { return this.#doTransform(elem, `translate3D(${vec.x},${vec.y},0)`)}
    static Rotate(elem, val) {  return this.#doTransform(elem, `rotate3D(0,0,${val}deg)`)}
    static Scale(elem, val) {  return this.#doTransform(elem, `scale3D(${val},${val},1)`)}
    static #doTransform(elem, val) {
        elem.style.transform = val;
        return new Promise((resolve, reject) => setTimeout(() => {resolve('done')}, this.SPEED));
    }

    //VEC MATH
    static Distance(a, b) {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        const vecA = {x: rectA.left + (rectA.width / 2),y: rectA.top  + (rectA.height / 2)}
        const vecB = {x: rectB.left + (rectB.width / 2),y: rectB.top  + (rectB.height / 2)}
        return Math.sqrt((vecB.y - vecA.y) * (vecB.y - vecA.y) + (vecB.x - vecA.x) * (vecB.x - vecA.x));
    }

    //ANIMS
    static PeekY(elem, val='0') {
         const doAnim = (elm) => {
            if(elem.length) elem.forEach( elm => doAnim(elm) )
            else if(val === '0')this.Opacity(elm, 1);
            else this.Opacity(elm, 0);
            this.TranslateY(elem, val);
        }
        doAnim(elem);
    }
    static PeekX(elem, val='0') { 
        val.includes('-') || val < 0 ? this.Opacity(elem, 0) : this.Opacity(elem, 1);
        return this.TranslateX(elem, val);
    }
    static Spin(elem, deg='0') { return this.#doTransform(elem, `scale3D(1,1,1) rotate(${deg}deg)`) }
    static Pop(elem) {  return this.#doTransform(elem, 'scale3D(1,1,1)') }
}
Utils.init();
export default Utils;