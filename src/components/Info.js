import Component from "./Component.js";
import LabelButton from "./buttons/LabelButton.js";
import Utils from "../Utils.js";
export default class Info extends Component {

    #infoButton;
    #isInfoOpened = false;
    #infoData = null;
    #contentElem = null;
    #infoContainer = null;

    constructor() {
        super(document.querySelector('#info'));

        const t = Utils.getIcon('cross');

        this.#infoButton = new LabelButton('music player', Utils.getIcon('cross'));
        this.#contentElem = this.element.querySelector('#info-content');
        this.#infoContainer = this.element.querySelector('.info-container');

        this.element.appendChild(this.#infoButton.element);
        this.#infoButton.addEventListener('click', () => this.#isInfoOpened ? this.close() : this.open());
    }

    async open() {
        if(this.#isInfoOpened) return;
        this.#isInfoOpened = this.#infoButton.iconed = true;
        this.element.dispatchEvent(new CustomEvent(Info.States.ON_ACTION, {detail:Info.States.OPENING}));
        await Utils.TranslateY(this.#contentElem, '0');
        // await Utils.Wait();
        Utils.TranslateX(this.#infoContainer, '0');
        Utils.Opacity(this.#infoContainer, 1);
    }
    async close() {
        if(!this.#isInfoOpened) return;
        this.#isInfoOpened = this.#infoButton.iconed = false;
        this.#infoContainer.style.display = 'none';
        await Utils.TranslateY(this.#contentElem, '-100%');
        // await Utils.Wait();
        this.#infoContainer.style.display = 'block';
        Utils.TranslateX(this.#infoContainer, '100%');
        Utils.Opacity(this.#infoContainer, 0);
        this.element.dispatchEvent(new CustomEvent(Info.States.ON_ACTION, {detail:Info.States.CLOSING}));
    }
    
    setupLayout(data) {

        this.#infoButton.text = data.title;
        this.#infoContainer.querySelector('.title').innerText = data.title;

        const durElem = this.#infoContainer.querySelector('.duration')
        if(data.type !== 'file') durElem.innerText = '∞';
        else durElem.innerText = `${parseInt((data.duration / 60) % 60)}:${parseInt(data.duration % 60)}`;

        this.#infoContainer.querySelector('.type').innerText = data.type;
    }
    update(state, data=null) {

        this.#infoData = data;
        this.dimmed = false;
        switch (state) {
            case Info.States.DISABLED:
                this.dimmed = true;
                break;
            case Info.States.ERROR:
                this.#infoButton.error = true;
                break;
            default:
                break;
        }
        if(data) this.setupLayout(data);
    }

    set dimmed(val=false) { this.#infoButton.dimmed = val; }
    get dimmed() { return this.#infoButton.dimmed;}

    set data(value) {this.#infoData = value}
    get data() {return this.#infoData}

    get isOpened() {return this.#isInfoOpened}
}

Info.States = {
    ENABLED: 'infostatesenabled',
    DISABLED: 'infostatesdisabled',
    ERROR: 'infostateserror',
    ON_ACTION: 'infostatesonaction',
    OPENING: 'infostatesopening',
    CLOSING: 'infostatesclosing'
}