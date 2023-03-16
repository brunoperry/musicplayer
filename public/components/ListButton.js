import Button from "./Button.js";

export default class ListButton extends Button {
  #listButtonData;

  constructor(data, callback) {
    super(null, callback);

    this.#listButtonData = data;

    const divElement = document.createElement("div");
    const template = document.querySelector(".list-item");
    const templateClone = template.content.cloneNode(true);
    templateClone.querySelector("label").textContent = this.#listButtonData.name;
    divElement.appendChild(templateClone);

    this.setElement(divElement.children[0]);

    const iconsContainer = divElement.querySelector(".toggle");
    if (data.type === "folder") {
      iconsContainer.children[0].style.display = "initial";
    } else {
      this.element.className = "leaf";
      this.element.removeChild(iconsContainer);
    }
  }

  get data() {
    return this.#listButtonData;
  }

  get highlight() {
    this.element.className.includes(" hightlight");
  }
  set highlight(val) {
    if (val) {
      this.element.className += " highlight";
    } else {
      this.element.className = this.element.className.replace(" highlight", "");
    }
  }

  get className() {
    return this.element.className;
  }
  set className(val) {
    this.element.className = val;
  }
}
