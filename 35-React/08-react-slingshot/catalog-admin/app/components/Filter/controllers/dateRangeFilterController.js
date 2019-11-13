import { COMMON_ACTIONS } from '../../../common/constants';

export class DateRangeFilterController {
  constructor(filterConfig, selectedData) {
    this.filterConfig = filterConfig;
    this.fromKey = this.filterConfig.child_keys.start_date;
    this.toKey = this.filterConfig.child_keys.end_date;
    selectedData = selectedData || {};
    this.selectedData = {
      [this.fromKey]: selectedData[this.fromKey],
      [this.toKey]: selectedData[this.toKey],
    };
    this.eventListener = null;
  }

  getExistingData = header => this.selectedData[header.uid] * 1000;

  clearFilter = () => {
    this.selectedData = { [this.fromKey]: null, [this.toKey]: null };
    this.eventListener(COMMON_ACTIONS.REFRESH, this.selectedData);
  };

  onUpdate = (header, updateWithData) => {
    updateWithData = updateWithData ? updateWithData / 1000 : null;
    this.selectedData[header.uid] = updateWithData;
    this.eventListener(COMMON_ACTIONS.REFRESH, this.selectedData);
  };

  getSelectedData = () => {
    const hasValue = Boolean(
      Object.keys(this.selectedData).some(key => this.selectedData[key]),
    );
    return hasValue ? { [this.filterConfig.uid]: this.selectedData } : {};
  };

  setEventListener = callback => {
    this.eventListener = callback;
  };
}
