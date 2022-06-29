import Utils from "../../Utils.js";
import Button from "./Button.js";

export default class ToggleButton extends Button {

    #iconsContainerElem;
    #labelElem;
    #index = 0;
    #currentText;
    constructor(text='',subtitle='', icons=[]) {
        super(Utils.getButton('toggle'));

        this.#currentText = text;
        this.#iconsContainerElem = this.element.querySelector('.icons-container');
        this.#labelElem = this.element.querySelector('label');
        this.#labelElem.innerHTML = `${this.#currentText}<span>${subtitle}</span>`;
        for (let i = 0; i < icons.length; i++) {

            const ico = Utils.getIcon( icons[i]);
            if(i !== this.#index) ico.style.display = 'none';
            this.#iconsContainerElem.appendChild(ico);
        }
        const icos = this.#iconsContainerElem.children;
        this.addEventListener('click', () => {
            this.#index++;
            if(this.#index >= icos.length) this.#index = 0;
            for (let i = 0; i < icos.length; i++) {
                i !== this.#index ?
                icos[i].style.display = 'none' :
                icos[i].style.display = 'initial';
            }
            this.dispatchEvent(ToggleButton.CLICK, {detail:{index:this.#index, value:icons[this.#index]}})
        })
    }
    setEnabled(value, subtitle='') {
        super.setEnabled(value);
        
        let res;
        if(this.enabled) {
            res = 1;
            this.#labelElem.innerHTML = `${this.#currentText}<span>${subtitle}</span>`;
        } else {
            res = 0.7;
            this.#labelElem.innerHTML = `${this.#currentText}<span>...</span>`;
        }
        this.element.style.opacity = res;
    }
}
ToggleButton.CLICK = 'togglebuttonclick';