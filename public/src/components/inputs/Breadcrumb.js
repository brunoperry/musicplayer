import Utils from "../../Utils.js";
import IconButton from "../buttons/IconButton.js";
import Component from "../Component.js";

export default class Breadcrumb extends Component {

    #crumbs = [];
    #iconsContainer;
    #label;
    #isOpen = false;
    #MAX_CRUMBS = 5;
    constructor(id) {
        super(document.querySelector(`#${id}`));
        this.#iconsContainer = this.element.querySelector('.crumbs-container');
        this.#label = this.element.querySelector('label');

        this.height = 0;
    }

    addCrumb(title='crumb') {
        const button = new IconButton(['crumb']);
        const index = this.#crumbs.length;

        this.#iconsContainer.appendChild(button.element);
        this.#crumbs.push({
            elem: button,
            title: title
        });

        button.addEventListener('click', () => {
            this.dispatchEvent(Breadcrumb.GO_TO, {detail:index});
            this.removeCrumb(index)
        });

        Utils.Pop(button.element);
        this.title = title;
    }
    removeCrumb(crumbID=-1) {
        if(crumbID === 0) return;
        for (let i = this.#crumbs.length-1; i > 0; i--) {
            this.#iconsContainer.removeChild(this.#crumbs[i].elem.element);
            this.#crumbs.pop();
            if(crumbID === i) break;
        }
        this.title = this.#crumbs[this.#crumbs.length-1].title;
    }

    show() {
        if(this.#isOpen) return;
        this.height = 'var(--button-height)';
        this.#isOpen = true;
    }
    hide() {
        if(!this.#isOpen) return;
        this.#crumbs.forEach(c => this.#iconsContainer.removeChild(c.elem.element));
        this.#crumbs = [];
        this.height = 0;
        this.title = '';
        this.#isOpen = false;
    }

    update(data) {
        if(!data.path || !data.children) return;
        const ids = data.id.split('.').map((n) => +n + 0);
        if(ids.length > this.#crumbs.length) {
             this.show();
             this.addCrumb(data.title);
        }
    }

    get length() {return this.#crumbs.length}

    set title(val='') {this.#label.innerText = val}
    get title() {return this.#label.innerText}

    static get GO_TO() {return 'breadcrumbactionsgoto'}
}