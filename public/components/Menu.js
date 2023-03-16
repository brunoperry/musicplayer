import Button from "./Button.js";
import Component from "./Component.js";
import List from "./List.js";
import ToggleButton from "./ToggleButton.js";

export default class Menu extends Component {
  #menuData;
  #menuContainer;
  #menuButton;
  #backButton;
  #lists = [];
  #currentList = null;
  #isOpen = false;
  #trail = null;

  constructor(elementId, callback) {
    super(elementId, callback);

    this.#menuButton = new ToggleButton("#menu-button", (value) => {
      this.#isOpen ? this.close() : this.open();
    });

    this.#backButton = new Button("#menu-back-button", (value) => {
      const index = this.#menuContainer.children.length - 1;
      this.#deleteList(index);
    });

    this.#menuContainer = this.element.querySelector("#menu-container");
  }

  #createList(data) {
    const list = new List(data, (event) => {
      if (event.type === "folder") {
        this.#createList(event.children);
      } else {
        this.callback(event);
      }
    });
    if (this.#trail) list.highlight(this.#trail);

    if (this.#currentList) {
      this.#currentList.transform("translateX(-100%)");
    }
    this.#lists.push(list);
    this.#menuContainer.appendChild(list.element);
    this.#currentList = list;

    setTimeout(() => {
      this.#currentList.transform("translateX(0)");
    }, 100);
    this.#backButton.displayed = this.#menuContainer.children.length > 1;
  }

  #deleteList(index = null) {
    if (index !== null) {
      const list = this.#lists[index];
      list.transform("translateX(100%)");
      this.#currentList = this.#lists[index - 1];
      this.#currentList.transform("translateX(0)");

      this.#menuContainer.children.length - 1 > 1
        ? (this.#backButton.displayed = true)
        : (this.#backButton.displayed = false);
      setTimeout(() => {
        this.#menuContainer.removeChild(list.element);
        // Remove the item at the specified index
        for (let i = index; i < this.#lists.length - 1; i++) {
          this.#lists[i] = this.#lists[i + 1];
        }
        this.#lists.length = this.#lists.length - 1; // Adjust the length of the array
      }, this.SPEED);
    } else {
      this.#menuContainer.innerHTML = "";
      this.#currentList = null;
      this.#lists = [];
      this.#backButton.displayed = false;
    }
  }

  open() {
    this.#menuButton.toggle(1);
    this.#menuContainer.style.transform = "scaleY(1)";
    this.callback({ type: "opening" });

    this.#createList(this.#menuData);
    this.#isOpen = true;
  }

  close() {
    this.#menuButton.toggle(0);
    this.#deleteList();
    this.#menuContainer.style.transform = "scaleY(0)";
    this.#isOpen = false;
    this.callback({ type: "closing" });
  }

  setTrail(trail) {
    this.#trail = trail;
    if (!this.#isOpen || !this.#trail) return;

    this.#lists.forEach((list) => list.highlight(trail));
  }

  get data() {
    return this.#menuData;
  }

  set data(val) {
    if (this.#isOpen) {
      this.close();
      setTimeout(() => (this.#menuData = val), this.SPEED);
    } else {
      this.#menuData = val;
    }
  }
}
