import Component from "./Component.js";

export default class Modal extends Component {
  #currentChild = null;
  constructor(elemID, callback) {
    super(elemID, callback);

    this.element.querySelector(".cancel").onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.hide();
    };
  }

  show(elemID) {
    this.#currentChild = this.element.querySelector(`#${elemID}`);

    if (!this.#currentChild) {
      return;
    }

    this.element.style.display = "flex";
    requestAnimationFrame(() => {
      this.element.style.transform = "scaleY(1)";
      setTimeout(() => {
        this.#currentChild.style.display = "flex";
        setTimeout(() => {
          this.#currentChild.style.transform = "translateY(0)";
          this.#currentChild.style.opacity = 1;
        }, this.SPEED);
      }, this.SPEED);
    });
  }

  hide() {
    if (this.#currentChild) {
      this.#currentChild.style.display = "none";
      this.#currentChild.style.transform = "translateY(20px)";
      this.#currentChild.style.opacity = 0;
    }
    this.element.style.transform = "scaleY(0)";
  }
}
