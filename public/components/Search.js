export default class Search {
  #data;
  #element;
  #searchInput;
  #searchList;
  #searchItemTemplate;
  #callback;

  constructor(searchData, callback) {
    this.#data = searchData;
    this.#callback = callback;
    this.#element = document.querySelector("#search");

    this.#searchInput = this.#element.querySelector("#search-input");
    this.#searchInput.oninput = async () => {
      const searchData = await this.#searchData(this.#searchInput.value);
      if (searchData.length < 100) this.#rebuildSearchResults(searchData);
      else this.#rebuildSearchResults([]);
    };
    this.#searchList = this.#element.querySelector("#search-results");
    this.#searchItemTemplate = document.querySelector(".search-item");
  }

  async #searchData(keyword) {
    const results = [];

    const word = keyword.toLowerCase();
    const searchRecursively = async (items) => {
      for (const item of items) {
        const name = item.name.toLowerCase();
        if (name.includes(word)) {
          results.push(item);
        }

        if (item.children) {
          await searchRecursively(item.children);
        }
      }
    };

    await searchRecursively(this.#data);

    return results;
  }

  #rebuildSearchResults(searchData) {
    this.#searchList.innerHTML = "";

    if (searchData.length === 0) {
      const templateClone = this.#searchItemTemplate.content.cloneNode(true);
      const label = templateClone.querySelector("label");
      label.textContent = "no results";
      label.className = "placeholder";
      this.#searchList.appendChild(templateClone);
      return;
    }

    for (let i = 0; i < searchData.length; i++) {
      const item = searchData[i];
      const templateClone = this.#searchItemTemplate.content.cloneNode(true);
      templateClone.querySelector("label").textContent = item.name;
      this.#searchList.appendChild(templateClone);
      this.#searchList.children[i].onclick = () => {
        this.#callback(item.id);
        this.hide();
      };
    }
  }

  show() {
    this.#element.style.display = "flex";
    this.#rebuildSearchResults([]);
    this.#searchInput.focus();
    setTimeout(() => {
      this.#element.style.transform = "translateY(0)";
      this.#element.style.opacity = 1;
    }, this.SPEED);
  }

  hide() {
    this.#element.style.display = "none";
    this.#element.style.transform = "translateY(20px)";
    this.#element.style.opacity = 0;
    this.#searchList.innerHTML = "";
    this.#searchInput.value = "";
  }

  get view() {
    return this.#element;
  }
}
