import Component from "./Component.js";

export default class Button extends Component {
  #clickTimeout = false;
  constructor(elemID, callback) {
    super(elemID, callback);

    if (this.element) {
      this.#setupEvents();
    }
  }

  #setupEvents() {
    this.element.onclick = () => {
      if (this.#clickTimeout) return;
      this.callback();
      this.#clickTimeout = true;
      setTimeout(() => {
        this.#clickTimeout = false;
      }, this.SPEED);
    };
  }

  click() {
    this.element.onclick();
  }

  setElement(element) {
    super.setElement(element);
    this.#setupEvents();
  }

  get text() {
    return this.element.querySelector("label").innerText;
  }
  set text(val) {
    this.element.querySelector("label").innerText = val;
  }

  get color() {
    return this.element.querySelector("label").style.color;
  }
  set color(val) {
    this.element.querySelector("label").style.color = val;
  }
}
