import Utils from "../../Utils.js";
import Button from "./Button.js";

export default class LabelButton extends Button {

    #btnLabel;
    #icon;
    constructor(text='...', ico=null) {
        super(Utils.getButton('labeled'));
        this.#btnLabel = this.element.querySelector('label');
        this.#icon = this.element.querySelector('.icons-container');
        if(ico) {
            this.#icon.appendChild(ico);
            this.#icon.style.display = 'none';
        }
        this.text = text;
    }

    addEventListener(name, event) {super.addEventListener( name,  ev => event(ev) )}

    set error(value) { this.#btnLabel.style.color = value ? 'var(--red-a)' : 'var(--red-b)'; }

    set dimmed(value) {
        value ? this.#btnLabel.style.color = 'var(--blue-b)' : this.#btnLabel.style.color = 'var(--yellow-b)';
    }
    get dimmed() {return this.enabled}

    set iconed(val) {
        if(val) {
            this.#btnLabel.style.display = 'none';
            this.#icon.style.display = 'flex';
        } else {
            this.#btnLabel.style.display = 'initial';
            this.#icon.style.display = 'none';
        }
    }
    get iconed() { return this.#icon.style.display === 'initial' ? true : false }

    get text() { return tthis.#btnLabel.innerText}
    set text(value) {  this.#btnLabel.innerText = value }
}