import Component from "./Component.js";
import ListButton from "./buttons/ListButton.js";
import Utils from "../Utils.js";

export default class List extends Component{

    #listData;
    #buttons = [];
    currentItem = null;
    constructor(data=null, highlight=null) {
        super()
        if(!data) throw new Error('List missing data! Please add data to list');

        this.#listData = data;
        this.build(data);
        this.highlightItem(highlight);
    }

    build(data) {
        this.element = document.createElement('ul')

        for (let i = 0; i < data.children.length; i++) {
            const li = document.createElement('li');
            const btn = new ListButton(data.children[i]);
            btn.addEventListener('click', () => {
                this.currentItem = btn;
                this.dispatchEvent(List.CLICK, {detail:btn.data})
            })
            li.appendChild(btn.element);
            this.element.appendChild(li);
            this.#buttons.push(btn);
        }
    }

    set activated(val) {
        if(val) {
            this.currentItem.setIcon('active', 'pulse');
        }
        else this.currentItem.icon = [];
    }
    get activated() {
        return this.currentItem.icon;
    }

    highlightItem(itemTitle=null) {
        if(itemTitle === null) return;
        this.#buttons.forEach(btn => {
            btn.highlight(false);
            if(itemTitle === btn.data.title) {
                this.currentItem = btn;
                btn.highlight(true);
            }
        });
    }

    set data(lData) {
        this.#listData = lData;
    }
    get data() {
        return this.#listData;
    }
    get children() {
        return this.#buttons;
    }

    /* FX */
    async show(to='0', opacity=1) {
        Utils.Opacity(this.element, opacity);
        return Utils.TranslateX(this.element, to);
    }
    async hide(to='100%', opacity=0) {
        Utils.Opacity(this.element, opacity);
        return Utils.TranslateX(this.element, to);
    }
    async peekX(val='0') {
        return Utils.PeekX(this.element, val);
    }

    static get CLICK() { return 'listclick'; }
}