import Utils from "../Utils.js";
import IconButton from "./buttons/IconButton.js";
import Component from "./Component.js";

export default class Locker extends Component {

    #icon;
    #target;
    #lockOffset = window.innerWidth / 2.5;
    constructor() {
        super(document.querySelector('#locker'))

        const container = this.element.querySelector('.container');
        this.#icon = new IconButton(['lock', 'unlock'], 'locker-button');
        this.#icon.setFill(0, 'var(--yellow-b)')
        this.#icon.setFill(1, 'var(--yellow-b)')
        container.appendChild(this.#icon.element);

        this.#target = new IconButton(['lock', 'unlock'], 'locker-target');
        container.appendChild(this.#target.element);

        Utils.setStartTouchOrMouseEvent(this.#icon.element, (e) => {
            this.startDrag()});
    }

    startDrag() {
        Utils.setEndTouchOrMouseEvent(document, e => this.endDrag(e))
        Utils.setMoveEvent(document, e => {

            if(Utils.Distance(this.#icon.element, this.#target.element) >= this.#lockOffset) {
                this.#icon.toggle(1);
                this.#target.toggle(1);
            } else {
                this.#icon.toggle(0);
                this.#target.toggle(0);
            }
            Utils.Translate(this.#icon.element, {
                x: `${e.x}px`,
                y: `${e.y}px`
            });
        });
    }
    endDrag() {
        Utils.unsetTouchOrMouseEvents(document);
        
        if(Utils.Distance(this.#icon.element, this.#target.element) >= this.#lockOffset) {

            this.element.dispatchEvent(new CustomEvent(Locker.ACTION, {detail: {type:Locker.Actions.UNLOCKED}}));
            this.hide();
        }
        else Utils.Translate(this.#icon.element, {x:0,y:0});
        this.#icon.toggle(0);
    }

    show() {
        this.element.dispatchEvent(new CustomEvent(Locker.ACTION, {detail: {type:Locker.Actions.OPENING}}));
        this.element.style.display = 'flex';
        requestAnimationFrame(() => this.element.style.transform = 'scale(1)');
    }
    async hide() {
        this.element.dispatchEvent(new CustomEvent(Locker.ACTION, {detail: {type:Locker.Actions.CLOSING }}));
        this.element.style.transform = 'scale(0)';
        await Utils.Wait();
        Utils.Translate(this.#icon.element, {x:0,y:0})
        this.element.style.display = 'none';
    }

    static get ACTION() {return 'lockeraction'}
    static get Actions() {return {
        UNLOCKED: 'lockeractionsunlocked',
        OPENING: 'lockeractionsopening',
        CLOSING: 'lockeractionsclosing'
    }}
}