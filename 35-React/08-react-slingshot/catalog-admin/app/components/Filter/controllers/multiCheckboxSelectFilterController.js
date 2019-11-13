export class MultiCheckboxSelectFilterController {
  constructor(filterConfig, selectedData, callback) {
    this.filterConfig = filterConfig;
    this.selectedData = selectedData[this.filterConfig.data_key] || [];
    this.choices = [];
    this.count = this.selectedData.length; // keeps count of the selected choices
    this.refreshFilter = callback;
    this.refreshMultiSelectCheckbox = null;
  }

  getExistingData = () => {
    const hasValue = this.selectedData.length;
    if (hasValue) {
      this.selectedData.forEach(selectedChoice => {
        this.choices.forEach(choice => {
          if (choice.id === selectedChoice.id) {
            choice.checked = true;
          }
        });
      });
    }
  };

  clearFilter = () => {
    this.choices.forEach(choice => {
      choice.checked = false;
    });
    this.selectedData = [];
    this.count = 0;
    this.refreshFilter(); // Re-Render Filter Component
    this.refreshMultiSelectCheckbox(); // Re-Render MultiSelectCheckbox Component
  };

  eventListener = clickedChoice => {
    if (clickedChoice.checked) {
      this.selectedData = this.selectedData.filter(
        choice => choice.id !== clickedChoice.id,
      );
    } else {
      this.selectedData.push(clickedChoice);
    }
    clickedChoice.checked = !clickedChoice.checked;
    this.refreshMultiSelectCheckbox();
    // Set count and refresh filter component
    this.count = this.selectedData.length;
    this.refreshFilter();
  };

  getSelectedData = () => {
    const hasValue = this.selectedData.length;
    const config = {
      [this.filterConfig.uid]: {
        [this.filterConfig.data_key]: this.selectedData,
        type: this.filterConfig.type,
        mode: this.filterConfig.mode,
        projection: this.filterConfig.projection,
      },
    };
    return hasValue ? config : {};
  };

  setData = (choices, callback) => {
    this.choices = choices
      ? choices.map(choice => Object.assign({}, choice))
      : [];
    this.refreshMultiSelectCheckbox = callback;
  };
}
