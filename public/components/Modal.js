import Component from "./Component.js";
import Login from "./Login.js";
import Search from "./Search.js";

export default class Modal extends Component {
  #currentView = null;
  #title;

  #loginView;
  #searchView;

  constructor(elemID, data, callback) {
    super(elemID, callback);

    this.element.querySelector(".cancel").onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.hide();
    };

    this.#title = this.element.querySelector(".modal-title");

    this.#loginView = new Login((action) => {
      console.log("login action", action);
    });
    this.#searchView = new Search(data, (action) => {
      this.callback("search", action);
      this.hide(action);
    });
  }

  show(elemID) {
    switch (elemID) {
      case "login":
        this.#currentView = this.#loginView;
        break;
      case "search":
        this.#currentView = this.#searchView;
        break;

      default:
        break;
    }
    this.#title.innerText = elemID;
    if (!this.#currentView) {
      return;
    }
    this.element.style.display = "flex";
    requestAnimationFrame(() => {
      this.element.style.transform = "scaleY(1)";
      setTimeout(() => {
        this.#currentView.show();
      }, this.SPEED);
    });
  }

  hide(action = null) {
    if (this.#currentView) {
      this.#currentView.hide();
    }
    this.element.style.transform = "scaleY(0)";
    this.callback("closed", action);
  }
}
