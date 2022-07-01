import Utils from "../../Utils.js";
import Button from "./Button.js";

export default class LabelButton extends Button {
  #btnLabel;
  #icon;
  #subLabel;

  constructor(text = "...", ico = null, inline = false) {
    super(Utils.getButton("labeled"));
    this.#btnLabel = this.element.querySelector("label");
    this.#subLabel = this.element.querySelector("span");
    this.#icon = this.element.querySelector(".icons-container");
    if (ico) {
      this.#icon.appendChild(ico);
      this.#icon.style.display = "none";
    }
    this.text = text;

    if (inline) {
      this.#btnLabel.style.display = "initial";
      this.#btnLabel.style.textAlign = "left";
      this.#icon.style.display = "flex";
      this.#icon.style.maxWidth = "var(--button-height)";
    }
  }

  showSubText(text = "", mili = Utils.SPEED) {
    this.#subLabel.innerText = text;
    Utils.Opacity(this.#subLabel, 1);
    if (this.animID !== null) {
      clearTimeout(this.animID);
      this.animID = null;
    }
    this.animID = setTimeout(() => Utils.Opacity(this.#subLabel, 0), mili);
  }

  addEventListener(name, event) {
    super.addEventListener(name, (ev) => event(ev));
  }

  set error(value) {
    this.#btnLabel.style.color = value ? "var(--red-a)" : "var(--red-b)";
  }

  set dimmed(value) {
    value
      ? (this.#btnLabel.style.color = "var(--blue-b)")
      : (this.#btnLabel.style.color = "var(--yellow-b)");
  }
  get dimmed() {
    return this.enabled;
  }

  set iconed(val) {
    if (val) {
      this.#btnLabel.style.display = "none";
      this.#icon.style.display = "flex";
    } else {
      this.#btnLabel.style.display = "initial";
      this.#icon.style.display = "none";
    }
  }
  get iconed() {
    return this.#icon.style.display === "initial" ? true : false;
  }
  get text() {
    return this.#btnLabel.innerText;
  }
  set text(value) {
    this.#btnLabel.innerText = value;
  }
}
