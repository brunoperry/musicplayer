const MPHeaderTemplate = document.createElement("template");
MPHeaderTemplate.innerHTML = `
<style>
    @import url('styles.css');
    :host {
        flex: 1;
        background-color: var(--secondary-color);
    }
    label {
        color: var(--primary-color);
    }
</style>
<div class="button">
  <label class="input-label"></label>
  <slot name="icon"></slot>
</div>
<div class="header-container"></div>
`;
class MPHeader extends HTMLElement {
  static observedAttributes = ["label"];

  #labelElement;
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(MPHeaderTemplate.content.cloneNode(true));

    this.#labelElement = this.shadowRoot.querySelector("label");
  }

  connectedCallback() {
    console.log("mp header connected!");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "label":
        this.label = newValue;
        break;
    }
  }

  set label(val) {
    this.#labelElement.innerText = val;
  }
  get label() {
    return this.#labelElement.innerText;
  }
}

customElements.define("mp-header", MPHeader);
