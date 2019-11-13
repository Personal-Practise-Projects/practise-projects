import { DateRangeFilterController } from './dateRangeFilterController';
import { APPLY, CANCEL, CLEAR, WIDGET_TYPES } from '../constant';
import { MultiCheckboxSelectFilterController } from './multiCheckboxSelectFilterController';

export class BaseFilterController {
  constructor() {
    this.selectedFilters = {};
    this.filterControllers = {};
    this.callbackListener = null;
    this.choices = []; // Choices data for to be passed into MultiCheckboxSelectController
    this.refreshFilter = null;
  }

  initializeControllers = filtersConfig => {
    filtersConfig.forEach(filterConfig => {
      switch (filterConfig.type) {
        case WIDGET_TYPES.DATE_RANGE: {
          const { uid } = filterConfig;
          const selectedData = this.selectedFilters[uid] || {};
          this.filterControllers[uid] = new DateRangeFilterController(
            filterConfig,
            selectedData,
          );
          break;
        }
        case WIDGET_TYPES.MULTIPLE_CHECKBOX_SELECT:
          this.setMultiCheckboxSelectController(filterConfig);
          break;
        default:
          break;
      }
    });
  };

  setMultiCheckboxSelectController = filterConfig => {
    const selectedData = this.selectedFilters[filterConfig.uid] || {};
    this.filterControllers[
      filterConfig.uid
    ] = new MultiCheckboxSelectFilterController(
      filterConfig,
      selectedData,
      this.refreshFilter,
    );
  };

  eventListener = (type, filterConfig) => {
    let selectedFilterData = {};
    switch (type) {
      case APPLY:
        Object.keys(this.filterControllers).forEach(key => {
          const controller = this.filterControllers[key];
          selectedFilterData = Object.assign(
            selectedFilterData,
            controller.getSelectedData(),
          );
        });
        if (this.callbackListener) {
          this.callbackListener(APPLY, selectedFilterData);
        }
        break;
      case CANCEL:
        if (this.callbackListener) {
          this.callbackListener(CANCEL);
        }
        break;
      case CLEAR:
        this.filterControllers[filterConfig.uid].clearFilter();
        break;
      default:
        break;
    }
  };

  setData = selectedFilters => {
    this.selectedFilters = selectedFilters;
  };

  setRefreshFilter = callback => {
    this.refreshFilter = callback;
  };

  setEventListener = callback => {
    this.callbackListener = callback;
  };

  reset = () => {
    this.filterControllers = {};
  };
}
