import Component from "./Component.js";
import ToggleButton from "./ToggleButton.js";

export default class Info extends Component {
  #infoContainer;
  #infoButton;
  #isOpened = false;

  #nameLabel;
  #typeLabel;
  constructor(elemID, callback) {
    super(elemID, callback);

    this.#infoContainer = this.element.querySelector("#info-container");

    this.#nameLabel = this.#infoContainer.querySelector(".name");
    this.#typeLabel = this.#infoContainer.querySelector(".type");

    this.#infoButton = new ToggleButton("#info-button", (value) => {
      this.#isOpened ? this.close() : this.open();
    });
  }

  update(data) {
    this.#infoButton.text = data.name;
    this.#nameLabel.innerText = data.name;
    this.#typeLabel.innerText = data.type;

    let col;
    switch (data.type) {
      case "error":
        col = "var(--error-color)";
        break;
      case "loading":
        col = "var(--terciary-color)";
        break;
      default:
        col = "var(--primary-color)";
        break;
    }
    this.#infoButton.color = col;
  }

  open() {
    if (this.#isOpened) return;
    this.#infoContainer.style.transform = "scaleY(1)";
    this.#infoButton.toggle(1);
    this.#isOpened = true;

    this.callback({ type: "opening" });

    setTimeout(() => {
      for (let i = 0; i < this.#infoContainer.children.length; i++) {
        const element = this.#infoContainer.children[i];
        element.style.visibility = "visible";
        element.style.opacity = 1;
      }
    }, this.SPEED);
  }
  close() {
    if (!this.#isOpened) return;

    this.callback({ type: "closing" });
    for (let i = 0; i < this.#infoContainer.children.length; i++) {
      const element = this.#infoContainer.children[i];
      element.style.visibility = "hidden";
      element.style.opacity = 0;
    }
    this.#infoContainer.style.transform = "scaleY(0)";
    this.#infoButton.toggle(0);
    this.#isOpened = false;
  }

  translateY(val) {
    this.#infoButton.translateY(val);
  }

  scale(val) {
    this.#infoButton.scale(val);
  }
}
