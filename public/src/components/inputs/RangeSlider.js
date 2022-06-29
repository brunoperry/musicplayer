import Utils from "../../Utils.js";
import Component from "../Component.js";

export default class RangeSlider extends Component {

    #inputBckgrd;
    #inputValue;
    #isAnimated = false;
    #progressX = 0;
    #iID = null;
    constructor(id) {
        super(document.querySelector(id))

        const input = this.element.querySelector('input');
        this.#inputBckgrd = this.element.querySelector('.input-background');
        input.oninput = () => {
            this.#inputValue = input.value;
            this.element.dispatchEvent(new CustomEvent(RangeSlider.Actions.ON_INPUT, {detail:this.value}));
        }
        this.#inputValue = input.value;
        
    }

    async hide() {
        this.#progressX = 0;
        if(this.#iID) {
            clearInterval(this.#iID);
            this.#iID = null;
        }

        Utils.Opacity(this.element, 0);
        this.#iID = setInterval(() =>  {
            this.element.style.visibility = 'hidden';
            this.#inputBckgrd.style.transform = `scaleX(0)`;
        }, Utils.SPEED);
    }

    show() {
        if(this.#iID) {
            clearInterval(this.#iID);
            this.#iID = null;
        }
        this.element.style.visibility = 'initial';
        Utils.Opacity(this.element, 1);
    }

    animateBackground() {
        if(!this.#isAnimated) return;

        this.#progressX += 2;
        this.element.style.backgroundPosition = `${this.#progressX}px 0px`;
        if(this.#progressX >= this.element.width) this.#progressX = 0;
    }

    set animated(value=false) {
        this.#isAnimated = value;
        this.#isAnimated ? this.element.style.backgroundImage = 'url("loading_bar.svg")' : this.element.style.backgroundImage = null;
    }
    get animated() {return this.#isAnimated}

    set value(val) { 
        this.#inputValue = val;
        this.#inputBckgrd.style.transform = `scaleX(${this.#inputValue*100}%)`
    }

    get value() { return this.#inputValue / 100 }
}

RangeSlider.Actions = {
    ON_INPUT: 'rangeslideractionsoninput'
}