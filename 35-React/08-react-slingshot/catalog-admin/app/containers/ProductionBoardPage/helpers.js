import { PRODUCTION_BOARD_STATE } from '../../common/constants';
import {
  fetchBrandsMappedToShotsForFilters,
  fetchLocationMappedToShotsForFilters,
  getCategoryListForFilters,
  getLocationTypesForFilters,
  getSetupListForFilters,
} from '../../components/Filter/service';

export function getPageTitle(stage) {
  if (stage === PRODUCTION_BOARD_STATE.PRE) return 'Pre-Production board';
  return 'Post-Production board';
}

export const getFilterData = (activeScreen, filtersConfig) => dispatch => {
  if (filtersConfig) {
    filtersConfig.forEach(filterConfig => {
      switch (filterConfig.uid) {
        case '#brand':
          fetchBrandsMappedToShotsForFilters(
            activeScreen,
            filterConfig.data_key,
            dispatch,
          );
          break;
        case '#location':
          fetchLocationMappedToShotsForFilters(
            activeScreen,
            filterConfig.data_key,
            dispatch,
          );
          break;
        case '#category':
          getCategoryListForFilters(filterConfig.data_key, dispatch);
          break;
        case '#setup':
          getSetupListForFilters(filterConfig.data_key, dispatch);
          break;
        case '#locationType':
          getLocationTypesForFilters(filterConfig.data_key, dispatch);
          break;
        default:
          break;
      }
    });
  }
};
