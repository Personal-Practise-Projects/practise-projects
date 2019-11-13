export class SearchHandler {
  constructor(callback) {
    this.searchCallback = callback;
  }

  search(searchString) {
    this.searchCallback(searchString);
  }
}
