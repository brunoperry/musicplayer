import Component from "./Component.js";
import IconButton from "./buttons/IconButton.js";

export default class Controls extends Component {
  #previousButton;
  #playPauseButton;
  #nextButton;

  #currentState = Controls.States.PAUSED;

  constructor() {
    super(document.querySelector("#controls"));

    const elem = this.element;

    this.#previousButton = new IconButton(["previous"], null, "previous track");
    this.#previousButton.addEventListener("click", () => {
      elem.dispatchEvent(
        new CustomEvent(Controls.States.ON_ACTION, {
          detail: {
            state: Controls.States.PREVIOUS,
          },
        })
      );
    });
    elem.appendChild(this.#previousButton.element);

    this.#playPauseButton = new IconButton(
      ["play", "pause", "loading", "cross"],
      null,
      "play pause"
    );
    this.#playPauseButton.setFill(3, "var(--red-a)");
    this.#playPauseButton.id = "play-pause-button";
    this.#playPauseButton.addEventListener("click", () => {
      elem.dispatchEvent(
        new CustomEvent(Controls.States.ON_ACTION, {
          detail: {
            state: this.#currentState,
          },
        })
      );
    });
    elem.appendChild(this.#playPauseButton.element);

    this.#nextButton = new IconButton(["next"], null, "next track");
    this.#nextButton.addEventListener("click", () => {
      this.element.dispatchEvent(
        new CustomEvent(Controls.States.ON_ACTION, {
          detail: {
            state: Controls.States.NEXT,
          },
        })
      );
    });
    elem.appendChild(this.#nextButton.element);
  }

  set state(val) {
    this.#currentState = val;
    switch (this.#currentState) {
      case Controls.States.PLAYING:
        this.#playPauseButton.toggle(1);
        break;
      case Controls.States.PAUSED:
        this.#playPauseButton.toggle(0);
        break;
      case Controls.States.SEEKING:
        this.#playPauseButton.toggle(2);
        break;
      case Controls.States.ERROR:
        this.#playPauseButton.toggle(3);
        break;
    }
  }
  get state() {
    return this.#currentState;
  }
}

Controls.States = {
  ON_ACTION: "controlsastatesonaction",
  PLAYING: "controlsastatesplaying",
  PLAY: "controlsastatesplay",
  PAUSED: "controlsastatespaused",
  SEEKING: "controlsastatesseeking",
  ERROR: "controlsastateserror",
  NEXT: "controlsastatesnext",
  PREVIOUS: "controlsastatesprevious",
};
