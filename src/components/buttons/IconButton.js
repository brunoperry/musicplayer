import Utils from "../../Utils.js";
import Button from "./Button.js";

export default class IconButton extends Button {

    #iconsContainer;
    #icons = [];
    #isToggable = false;
    #currentIconIndex = 0;
    constructor(icons, id=null) {
        super(Utils.getButton('icon'));

        this.#iconsContainer = this.element.querySelector('.icons-container');

        for (let i = 0; i < icons.length; i++) {
            const ico = Utils.getIcon(icons[i]);
            this.#iconsContainer.appendChild(ico);
            this.#icons.push(ico);
        }

        this.#isToggable = this.#iconsContainer.children.length > 1;
        if(this.#isToggable) this.toggle(this.#currentIconIndex);
        if(id) this.id = id;
    }

    toggle(index=0) {
        for (let i = 0; i < this.#icons.length; i++) {
            const ico = this.#icons[i];
            ico.style.display = 'none';
            if(i === index) ico.style.display = 'initial'
        }
    }
    
    setFill(index=0, attr) {
        const ico = this.#icons[index];
        ico.style.fill = attr;
    }

    set state(val) {
        this.#currentIconIndex = val;
        this.toggle(this.#currentIconIndex)
    }
    get state() {return this.#currentIconIndex}
}