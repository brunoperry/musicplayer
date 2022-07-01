import Utils from "../../Utils.js";
import Button from "./Button.js";

export default class ExpandableButton extends Button {
  #isCollapsed = true;

  #expandElement = null;
  #contentElements = null;

  #expandIcon = Utils.getIcon("expand");
  #collapseIcon = Utils.getIcon("collapse");
  constructor(data) {
    super(Utils.getButton("expandable"));

    this.element.querySelector("label").innerText = data.title;

    const iconsContainer = this.element.querySelector(".icons-container");
    iconsContainer.appendChild(this.#expandIcon);
    iconsContainer.appendChild(this.#collapseIcon);
    this.#expandElement = this.element.querySelector(".expand-container");
    this.#contentElements = data.expandContent;
    this.#expandElement.appendChild(this.#contentElements);

    this.#toggleIcon();

    this.element
      .querySelector(".button-container")
      .addEventListener("click", () => {
        this.#isCollapsed ? this.expand() : this.collapse();
      });
  }
  async expand() {
    if (!this.#isCollapsed) return;
    this.#isCollapsed = false;
    this.#toggleIcon();
    requestAnimationFrame(async () => {
      await Utils.Height(
        this.#expandElement,
        `${this.#contentElements.offsetHeight}px`
      );
      this.dispatchEvent(ExpandableButton.Actions.ON_ACTION, {
        detail: ExpandableButton.Actions.EXPANDED,
      });
    });
  }
  async collapse() {
    if (this.#isCollapsed) return;
    this.#isCollapsed = true;
    this.#toggleIcon();
    await Utils.Height(this.#expandElement, "0px");
    this.dispatchEvent(ExpandableButton.Actions.ON_ACTION, {
      detail: ExpandableButton.Actions.COLLAPSED,
    });
  }

  #toggleIcon() {
    if (this.#isCollapsed) {
      this.#collapseIcon.style.display = "none";
      this.#expandIcon.style.display = "initial";
    } else {
      this.#collapseIcon.style.display = "initial";
      this.#expandIcon.style.display = "none";
    }
  }
}

ExpandableButton.Actions = {
  ON_ACTION: "expandablebuttononaction",
  EXPANDED: "expandablebuttonexpanded",
  COLLAPSED: "expandablebuttoncollapsed",
};
