export default class Component {
  element;
  callback;
  SPEED = 0;

  constructor(elementID = null, callback = () => {}) {
    this.element = document.querySelector(elementID);
    this.callback = callback;

    this.SPEED = parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--speed")
        .replace(/(ms|s)/g, "")
    );
  }

  setElement(element) {
    this.element = element;
  }
  scale(val) {
    this.element.style.transform = `scale3d(${val},${val},1)`;
  }
  translateY(val) {
    this.element.style.transform = `translateY(${val}px)`;
  }
  transform(val) {
    this.element.style.transform = val;
  }

  get displayed() {
    return this.element.style.display === "initial";
  }
  set displayed(value) {
    let display;
    value ? (display = "initial") : (display = "none");
    this.element.style.display = display;
  }
}
