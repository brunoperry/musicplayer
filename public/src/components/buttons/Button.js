import Component from "../Component.js";

export default class Button extends Component {

    #btnData;
    #isEnabled = true;
    constructor(element, data=null) {
        super(element);
        this.#btnData = data;
    }

    addEventListener(name, event) {
        super.addEventListener(name, event)
    }

    highlight(value=false) {
        this.element.style.backgroundColor = `${value ? 'var(--yellow-b)' : 'transparent'}`;
    }

    setEnabled(value) {
        this.enabled = value;
    }

    get enabled() {return this.#isEnabled}
    set enabled(value) {
        this.#isEnabled=value;
        
        let res;
        this.#isEnabled ? res = 'initial' : res = 'none';
        this.element.style.pointerEvents = res;
    }

    set data(data) {this.#btnData = data}
    get data() {return this.#btnData}
}