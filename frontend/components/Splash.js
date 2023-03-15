export default class Splash {
  #element;
  #label;
  #MESSAGES = ["Loading, please wait...", "Still loading, hang on!", "Loading, zzzz..."];
  #intervalID = null;
  #SPEED;

  constructor() {
    this.#element = document.querySelector("#splash");
    this.#label = this.#element.querySelector("p");

    this.#SPEED = parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--speed")
        .replace(/(ms|s)/g, "")
    );

    let counter = 0;
    this.#label.innerText = this.#MESSAGES[counter];
    this.#intervalID = setInterval(() => {
      counter++;
      if (counter >= this.#MESSAGES.length) counter = 0;
      this.#label.innerText = this.#MESSAGES[counter];
    }, 5000);
  }

  error() {
    clearInterval(this.#intervalID);
    this.#intervalID = null;

    this.#label.innerText = "Error connecting to server.";
    this.#label.style.color = "var(--error-color)";

    const img = this.#element.querySelector("img");
    img.style.transform = "scale(1)";
    setTimeout(() => {
      this.#element.removeChild(this.#label);
      img.style.transform = "translateY(50px)";
      img.style.opacity = 0;
      setTimeout(() => {
        document.body.removeChild(this.#element);
      }, this.#SPEED * 3);
    }, 2000);
  }

  delete() {
    clearInterval(this.#intervalID);
    this.#intervalID = null;

    this.#label.innerText = "App loaded!";
    this.#label.style.animationName = "pulse";
    const img = this.#element.querySelector("img");
    img.style.transform = "scale(1)";
    setTimeout(() => {
      this.#element.removeChild(this.#label);
      img.style.transform = "translateY(50px)";
      img.style.opacity = 0;
      setTimeout(() => {
        document.body.removeChild(this.#element);
      }, this.#SPEED * 3);
    }, 2000);
  }

  static OFFLINE() {
    const elem = document.querySelector("#splash");
    if (!elem) return;
    const p = elem.querySelector("p");
    p.style.animationName = "pulse";
    p.innerText = "Offline...";
    setTimeout(() => {
      document.body.removeChild(elem);
    }, 3000);
  }
}
