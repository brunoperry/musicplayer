import Component from "./Component.js";
import LabelButton from "./buttons/LabelButton.js";
import Utils from "../Utils.js";
export default class Info extends Component {
  #infoButton;
  #isInfoOpened = false;
  #infoData = null;
  #contentElem = null;
  #infoDetails = null;
  #shareButton = null;

  constructor() {
    super(document.querySelector("#info"));

    this.#infoButton = new LabelButton("music player", Utils.getIcon("cross"));
    this.#contentElem = this.element.querySelector("#info-content");
    this.#infoDetails = this.element.querySelector(".info-details");

    this.element.appendChild(this.#infoButton.element);
    this.#infoButton.addEventListener("click", () =>
      this.#isInfoOpened ? this.close() : this.open()
    );

    // START
    this.#shareButton = new LabelButton("share", Utils.getIcon("link"), true);
    this.#contentElem.appendChild(this.#shareButton.element);
    this.#shareButton.addEventListener("click", () => {
      this.dispatchEvent(Info.States.ON_ACTION, {
        detail: Info.States.COPY_2_CLIPBOARD,
      });
      this.#shareButton.showSubText("link copied!", 22000);
    });
    // END
  }

  async open() {
    if (this.#isInfoOpened) return;

    this.#isInfoOpened = this.#infoButton.iconed = true;
    this.element.dispatchEvent(
      new CustomEvent(Info.States.ON_ACTION, { detail: Info.States.OPENING })
    );
    await Utils.TranslateY(this.#contentElem, "0");
    // await Utils.Wait();
    Utils.TranslateX(this.#infoDetails, "0");
    await Utils.Opacity(this.#infoDetails, 1);
    Utils.Opacity(this.#shareButton.element, 1);
  }
  async close() {
    if (!this.#isInfoOpened) return;
    this.#isInfoOpened = this.#infoButton.iconed = false;
    this.#infoDetails.style.display = this.#shareButton.element.style.display =
      "none";

    await Utils.TranslateY(this.#contentElem, "-100%");

    this.#infoDetails.style.display = "block";
    this.#shareButton.element.style.display = "flex";
    Utils.TranslateX(this.#infoDetails, "100%");
    Utils.Opacity(this.#infoDetails, 0);
    Utils.Opacity(this.#shareButton.element, 0);
    this.element.dispatchEvent(
      new CustomEvent(Info.States.ON_ACTION, { detail: Info.States.CLOSING })
    );
  }

  setupLayout(data) {
    this.#infoButton.text = data.title;
    this.#infoDetails.querySelector(".title").innerText = data.title;

    const durElem = this.#infoDetails.querySelector(".duration");
    if (data.type !== "file") durElem.innerText = "∞";
    else
      durElem.innerText = `${parseInt((data.duration / 60) % 60)}:${parseInt(
        data.duration % 60
      )}`;

    this.#infoDetails.querySelector(".type").innerText = data.type;
  }
  update(state, data = null) {
    this.#infoData = data;
    this.dimmed = false;
    switch (state) {
      case Info.States.DISABLED:
        this.dimmed = true;
        break;
      case Info.States.ERROR:
        this.#infoButton.error = true;
        break;
      default:
        break;
    }
    if (data) this.setupLayout(data);
  }

  set dimmed(val = false) {
    this.#infoButton.dimmed = val;
  }
  get dimmed() {
    return this.#infoButton.dimmed;
  }

  set data(value) {
    this.#infoData = value;
  }
  get data() {
    return this.#infoData;
  }

  get isOpened() {
    return this.#isInfoOpened;
  }
}

Info.States = {
  ENABLED: "infostatesenabled",
  DISABLED: "infostatesdisabled",
  ERROR: "infostateserror",
  ON_ACTION: "infostatesonaction",
  OPENING: "infostatesopening",
  CLOSING: "infostatesclosing",
  COPY_2_CLIPBOARD: "infostatescopy2clipboard",
};
