import Utils from "../Utils.js";

export default class Component {
  #elem;
  #events = [];
  animID = null;
  #pos = { x: 0, y: 0 };
  constructor(elem) {
    this.#elem = elem;
  }

  addEventListener(name, ev) {
    this.#elem.addEventListener(name, ev);
    this.#events.push({ name: name, event: ev });
  }
  dispatchEvent(name, data) {
    this.#elem.dispatchEvent(new CustomEvent(name, data));
  }
  removeEventListener(name) {
    let newEvents = [];
    for (let i = 0; i < this.#events.length; i++) {
      const evt = this.#events[i];
      if (evt.name === name) {
        this.#elem.removeEventListener(evt.name, evt.event);
        continue;
      }
      newEvents.push(evt);
    }
    this.#events = newEvents;
  }
  /* FX */
  async translate(elem, vec) {
    Utils.Translate(elem, vec);
  }

  set id(val) {
    this.#elem.setAttribute("id", val);
  }
  get id() {
    return this.#elem.getAttribute("id");
  }

  set width(val) {
    this.#elem.style.width = `${val}px`;
  }
  get width() {
    return this.#elem.offsetWidth;
  }

  set height(val) {
    let value = "" + val;
    if (!value.includes("var") && !value.includes("%")) value = `${val}px`;
    this.#elem.style.height = value;
  }
  get height() {
    return this.#elem.offsetHeight;
  }

  get element() {
    return this.#elem;
  }
  set element(elem) {
    this.#elem = elem;
  }

  set opacity(val) {
    this.#elem.style.opacity = val;
  }
  get opacity() {
    return this.#elem.style.opacity;
  }
}
