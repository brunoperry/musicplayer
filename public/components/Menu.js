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
    if (this.#trail) {
      list.highlight(this.#trail);
    }

    if (this.#currentList) {
      this.#currentList.transform("translateX(-100%)");
    }
    this.#lists.push(list);
    this.#menuContainer.appendChild(list.element);
    this.#currentList = list;

    setTimeout(() => {
      if (this.#currentList) this.#currentList.transform("translateX(0)");
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

    if (this.#trail) this.buildMenu(this.#trail);
    else this.#createList(this.#menuData);
    this.#isOpen = true;
  }

  close() {
    this.#menuButton.toggle(0);
    this.#deleteList();
    this.#menuContainer.style.transform = "scaleY(0)";
    this.#isOpen = false;
    this.callback({ type: "closing" });
  }

  setTrail(trail, andPlay = false) {
    this.#trail = trail;
    if (!this.#isOpen || !this.#trail) return;

    this.#lists.forEach((list) => list.highlight(trail, andPlay));

    if (andPlay) {
      const lastList = this.#lists[this.#lists.length - 1].buttons;
      lastList.forEach((button) => {
        if (button.data.id === trail) {
          button.click();
          return;
        }
      });
    }
  }
  buildMenu(dataPath, andPlay = false) {
    const path = dataPath.split("/");
    let currentID = "";
    // let found = false;

    const lists = [];
    lists.push(this.#menuData);
    const fetchList = (data) => {
      for (let i = 0; i < path.length; i++) {
        // if (found) break;
        if (i === 0) {
          currentID = path[i];
        } else currentID = currentID + "/" + path[i];
        for (let j = 0; j < data.length; j++) {
          // if (found) break;
          if (currentID === data[j].id) {
            if (data[j].type === "folder") {
              lists.push(data[j].children);
              fetchList(data[j].children);
            }
          }
        }
      }
    };

    fetchList(this.#menuData);
    lists.forEach((l) => {
      this.#createList(l);
    });
    this.setTrail(dataPath, andPlay);

    // path.forEach((item) => {
    //   for (let i = 0; i < this.#menuData.length; i++) {
    //     const element = this.#menuData[i];
    //   }
    // });
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
