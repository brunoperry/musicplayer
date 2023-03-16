import Component from "./Component.js";
import ListButton from "./ListButton.js";

export default class List extends Component {
  #listData = null;
  #items = [];
  constructor(data, callback) {
    super(null, callback);

    this.#listData = data;
    const ul = document.createElement("ul");
    this.#listData.forEach((itemData) => {
      const listButton = new ListButton(itemData, () => this.callback(itemData));

      if (itemData.type === "update") listButton.className = "update";
      if (itemData.type === "retry") listButton.className = "retry";
      this.#items.push(listButton);
      ul.appendChild(listButton.element);
    });
    this.setElement(ul);
  }

  highlight(id) {
    this.#items.forEach((item) => {
      item.highlight = id.includes(item.data.id);
    });
  }
}
