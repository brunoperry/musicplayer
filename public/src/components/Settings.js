import Utils from "../Utils.js";
import ExpandableButton from "./buttons/ExpandableButton.js";
import IconButton from "./buttons/IconButton.js";
import ToggleButton from "./buttons/ToggleButton.js";
import LabelButton from "./buttons/LabelButton.js";
import Component from "./Component.js";

export default class Settings extends Component {
  #settingsData = null;
  #container = null;

  #playmodeButton;
  #loginButton;
  #reloadButton;
  constructor(data = null) {
    super(document.querySelector("#settings"));
    this.#container = this.element.querySelector("#settings-container");

    this.#settingsData = data;

    this.buildView();
  }

  buildView() {
    const ulElem = document.createElement("ul");

    let liElem = document.createElement("li");

    const pmData = this.#settingsData.find((sett) => sett.type === "playmode");
    this.#playmodeButton = new ToggleButton(pmData.name, pmData.value, [
      "repeat_all",
      "repeat_current",
      "shuffle",
    ]);
    this.#playmodeButton.addEventListener(ToggleButton.CLICK, (ev) => {
      this.#settingsData[0].value = ev.detail.value;
      this.#doChangeEvent(0);
    });
    liElem.appendChild(this.#playmodeButton.element);
    ulElem.appendChild(liElem);

    //LOGIN
    liElem = document.createElement("li");
    const loginForm = Utils.getForm("login");
    loginForm.onsubmit = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      console.log("submited");
    };
    this.#loginButton = new ExpandableButton({
      title: "login",
      expandContent: loginForm,
    });
    this.#loginButton.addEventListener(
      ExpandableButton.Actions.ON_ACTION,
      (ev) => {
        switch (ev.detail) {
          case ExpandableButton.Actions.EXPANDED:
            break;
          case ExpandableButton.Actions.COLLAPSED:
            break;
          default:
            break;
        }
      }
    );
    liElem.appendChild(this.#loginButton.element);

    ulElem.appendChild(liElem);
    //LOGIN END

    liElem = document.createElement("li");
    this.#reloadButton = new LabelButton(
      "reload",
      Utils.getIcon("reload"),
      true
    );
    this.#reloadButton.addEventListener("click", () => {
      this.dispatchEvent(Settings.ACTION, {
        detail: {
          type: Settings.Actions.HAS_CHANGED,
          data: {
            type: "reload",
          },
        },
      });
    });
    liElem.appendChild(this.#reloadButton.element);
    ulElem.appendChild(liElem);

    const closeButton = new IconButton(["check"], "settings-close-button");
    closeButton.addEventListener("click", () => {
      this.hide();
    });

    const listContainer = this.element.querySelector(".list-container");
    listContainer.prepend(ulElem);

    // this.#container.appendChild(ulElem);
    this.#container.appendChild(closeButton.element);
  }

  #doChangeEvent(index = 0) {
    this.lock(this.#settingsData[index].type);
    this.dispatchEvent(Settings.ACTION, {
      detail: {
        type: Settings.Actions.HAS_CHANGED,
        data: this.#settingsData[index],
      },
    });
  }

  lock(type) {
    this.#updateButtonsStatus(type, false);
  }

  #updateButtonsStatus(type, value) {
    switch (type) {
      case "playmode":
        this.#playmodeButton.setEnabled(value, this.#settingsData[0].value);
        break;
      case "theme":
        break;
    }
  }

  unlock(type) {
    this.#updateButtonsStatus(type, true);
  }

  async show() {
    this.element.dispatchEvent(
      new CustomEvent(Settings.ACTION, {
        detail: { type: Settings.Actions.OPENING },
      })
    );
    this.element.style.display = "flex";
    requestAnimationFrame(() => (this.element.style.transform = "scale(1)"));
    this.#container.style.display = "grid";
    await Utils.Wait();
    requestAnimationFrame(() => Utils.Opacity(this.#container, 1));
  }
  async hide() {
    this.#loginButton.collapse();
    this.element.dispatchEvent(
      new CustomEvent(Settings.ACTION, {
        detail: { type: Settings.Actions.CLOSING },
      })
    );
    this.#container.style.display = "none";
    Utils.Opacity(this.#container, 0);
    this.element.style.transform = "scale(0)";
    await Utils.Wait();
    this.element.style.display = "none";
  }

  static get ACTION() {
    return "settingsaction";
  }
  static get Actions() {
    return {
      OPENING: "settingsctionsopening",
      CLOSING: "settingsactionsclosing",
      HAS_CHANGED: "settingsactionshaschanged",
    };
  }
}
