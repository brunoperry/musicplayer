export default class Login {
  #element;
  constructor() {
    this.#element = document.querySelector("#login");
    this.#element.onsubmit = async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const credentials = {
        username: this.#element.querySelector("#username").value,
        password: this.#element.querySelector("#password").value,
      };
      const req = await fetch("https://api.brunoperry.net/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const res = await req.json();
      if (res.status === 200) {
        localStorage.setItem("musicplayertoken", res.token);
        window.location.reload();
      } else {
        console.log(res.message);
      }
    };
  }

  show() {
    this.#element.style.display = "flex";
    setTimeout(() => {
      this.#element.style.transform = "translateY(0)";
      this.#element.style.opacity = 1;
    }, this.SPEED);
  }

  hide() {
    this.#element.style.display = "none";
    this.#element.style.transform = "translateY(20px)";
    this.#element.style.opacity = 0;
  }

  get view() {
    return this.#element;
  }
}
