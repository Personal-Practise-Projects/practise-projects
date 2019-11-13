export class SchedulePageSearchHandler {
  constructor(searchHandler) {
    this.dropDownOptions = {
      '#searchTypes': [],
    };
    this.eventListener = searchHandler;
    this.selectedSearchType = null;
    this.placeholder =
      'Search by brand name, content request id, category, setup type or model name';
  }

  setTypeEventListener = typeEventListener => {
    this.typeEventListener = typeEventListener;
  };

  search(searchString) {
    if (this.eventListener) {
      this.eventListener({
        type: this.selectedSearchType.id,
        search: searchString,
      });
    }
  }

  getExistingData = () => this.selectedSearchType;

  getDropDownTitle = (header, value) => {
    this.selectedSearchType = value
      ? this.dropDownOptions[header.uid] &&
        this.dropDownOptions[header.uid].find(data => data.id === value.id)
      : this.dropDownOptions[header.uid][0];
    return this.selectedSearchType.title
      ? this.selectedSearchType.title
      : this.selectedSearchType.name;
  };

  displayChildClassRenderer = () => '';

  onUpdate = (header, value) => {
    this.selectedSearchType = this.dropDownOptions[header.uid].find(
      options => options.id === value,
    );
    this.typeEventListener(this.selectedSearchType);
  };
}
