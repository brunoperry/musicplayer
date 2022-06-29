import Button from "./Button.js";
import Utils from "../../Utils.js";

export default class ListButton extends Button {

    #labelContainer;
    #buttonLabel;
    #iconsContainer;
    constructor(data) {
        super(Utils.getButton('list-item'), data);

        this.#labelContainer = this.element.querySelector('.label-container');
        this.#buttonLabel = this.element.querySelector('label');
        this.#iconsContainer = this.element.querySelector('.icons-container');

        if(data.icon) this.icon = [data.icon];
        else if(data.children) this.icon = ['leaf'];
        else this.#labelContainer.style.maxWidth = '100%';

        this.label = data.title;
    }

    setIcon(ico, animName=null) {
        this.#iconsContainer.append(Utils.getIcon(ico, animName));
        this.#labelContainer.style.maxWidth = 'calc(100% - var(--button-height))';
    }

    set icon(icos) {
        if(!icos.length) {
            this.#iconsContainer.innerHtml = '';
            return;
        }
        for (let i = 0; i < icos.length; i++) this.#iconsContainer.append(Utils.getIcon(icos[i]))
    }
    get icon() {return this.#iconsContainer.children}

    set label(text) {this.#buttonLabel.innerText = text;}
    get label() {return this.#buttonLabel.innerText}
}