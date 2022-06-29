import Component from "./Component.js";
import IconButton from "./buttons/IconButton.js";
import List from "./List.js";
import Utils from "../Utils.js";
import Breadcrumb from "./inputs/Breadcrumb.js";

export default class Menu extends Component {
  #menuData;
  #menuButton;

  #listsContainer;
  #lists = [];
  #currentList = null;
  #listTrail = [];
  #isActivated = false;
  isOpened = false;
  #breadcrumb;
  constructor(data) {
    super(document.querySelector("#menu"));

    this.#menuData = data;

    this.#breadcrumb = new Breadcrumb("menu-breadcrumb");
    this.#breadcrumb.addEventListener(Breadcrumb.GO_TO, (ev) =>
      this.gotoList(ev.detail)
    );
    this.#menuButton = new IconButton(
      ["menu", "cross"],
      "menu-button",
      "open close menu"
    );
    this.#menuButton.addEventListener("click", () => {
      !this.isOpened ? this.open() : this.close();
    });
    this.element.appendChild(this.#menuButton.element);
    this.#listsContainer = this.element.querySelector("#menu-list-container");
  }

  async open() {
    this.buildMenu();
    this.dispatchEvent(Menu.ACTION, { detail: { action: "opening" } });
    this.#menuButton.toggle(1);
    await Utils.TranslateY(this.#listsContainer, "0");
    if (this.#isActivated) this.#currentList.show();
    else this.#lists.forEach((li) => li.show());
    this.isOpened = true;
  }
  async close() {
    this.clearMenu();
    this.#breadcrumb.hide();
    this.dispatchEvent(Menu.ACTION, { detail: { action: "closing" } });
    this.#menuButton.toggle(0);
    await Utils.TranslateY(this.#listsContainer, "100%");
    this.isOpened = false;
  }

  buildMenu() {
    this.#listTrail = [];
    const params = Utils.getBrowserPath();
    if (params) this.#listTrail = params;
    this.addList(this.#menuData[0], false);

    if (this.#isActivated) {
      let listsOut = [];
      const fetchTrail = (from) => {
        for (let i = 0; i < this.#listTrail.length; i++) {
          for (let j = 0; j < from.length; j++) {
            if (from[j].title === this.#listTrail[i]) {
              const dItem = from[j];
              listsOut.push(dItem);
              if (dItem.children) fetchTrail(dItem.children);
              break;
            }
          }
        }
      };
      fetchTrail(this.#menuData[0].children);
      listsOut.forEach((lData) => {
        if (lData.children) this.addList(lData, false);
      });
    }
  }
  clearMenu() {
    this.#lists.forEach((l) => this.#listsContainer.removeChild(l.element));
    this.#lists = [];
    this.#currentList = null;
  }

  addList(listData, andShow = true) {
    if (this.#currentList) {
      this.#currentList.peekX("-30%", 0);
    }
    const list = new List(listData, this.#listTrail[this.#lists.length]);
    list.addEventListener(List.CLICK, (ev) => {
      const data = ev.detail;
      if (data.children) this.addList(data);
      else if (data.action)
        this.dispatchEvent(Menu.ACTION, {
          detail: {
            action: data.action,
            listData: list.data,
            currentItem: data,
          },
        });
    });

    this.#listsContainer.appendChild(list.element);
    this.#lists.push(list);

    this.#currentList = list;
    this.#breadcrumb.update(this.#currentList.data);

    if (this.#currentList.currentItem && this.#isActivated) {
      if (!this.#currentList.currentItem.data.children) list.activated = true;
    }
    if (andShow) requestAnimationFrame(() => list.show());
    this.dispatchEvent(Menu.ACTION, { detail: { action: "list_added" } });
  }

  async gotoList(index = 0) {
    let rLists = [];
    for (let i = this.#lists.length - 1; i > index; i--) {
      rLists.push(this.#lists[i]);
    }
    this.#currentList = this.#lists[index];
    this.#currentList.peekX("0");
    rLists.forEach((lst) => lst.hide());

    this.#lists.length - rLists.length > 1
      ? this.#breadcrumb.show()
      : this.#breadcrumb.hide();

    await Utils.Wait();
    rLists.forEach((lst) => this.removeList(lst));
  }

  removeList(lst) {
    this.#listsContainer.removeChild(lst.element);
    this.#lists = this.#lists.filter((l) => l !== lst);
    if (this.#lists.length > 1) this.#breadcrumb.show();
    else this.#breadcrumb.hide();

    this.dispatchEvent(Menu.ACTION, { detail: { action: "list_removed" } });
  }
  static get ACTION() {
    return "menuaction";
  }

  set activated(val) {
    this.#isActivated = val;
  }
  get activated() {
    return this.#isActivated;
  }

  get currentData() {
    return this.#currentList.currentItem.data;
  }
}
