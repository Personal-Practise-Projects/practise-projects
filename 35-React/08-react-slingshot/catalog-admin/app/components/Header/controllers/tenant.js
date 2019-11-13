import { getTenantSearch } from '../../../actions/search/commonSearchActions';
import {
  getCurrentSelectedTenant,
  updateSelectedTenantId,
} from '../../../helpers/user';
import Singleton from '../../../common/events';
import { AppEvents } from '../../../common/constants';
import { NAVIGATION_EVENT_TYPE } from '../constants';

export class TenantController {
  constructor(eventListener) {
    this.ref = { id: 'tenantDropDown' };
    this.eventListener = eventListener;
    this.selectedTenant = getCurrentSelectedTenant();
    this.tenantSearch = getTenantSearch();
  }

  fetchTenantList = callback => {
    this.tenantSearch.search('', [], (searchString, data) => {
      this.tenantList = data;
      if (callback) {
        callback(this.tenantList);
      }
    });
  };

  getExistingData = () => this.selectedTenant;

  onUpdate = (header, value) => {
    updateSelectedTenantId(value);
    this.selectedTenant = value;
    this.eventListener(NAVIGATION_EVENT_TYPE.TENANT_CHANGED);
    Singleton.getInstance().notify(AppEvents.REFRESH_BASE_PAGE);
  };

  getSearchAPI = header => this.tenantSearch;

  getOptionalInfo = (header, callback) => {
    if (this.tenantList) {
      callback(this.tenantList);
    } else {
      this.fetchTenantList(callback);
    }
  };

  getDropDownTitle = (header, selectedOption) => {
    if (this.tenantList) {
      const selectedTenant = this.tenantList.find(
        tenant => selectedOption === tenant.id,
      );
      if (selectedTenant) {
        return selectedTenant.name;
      }
    }
    return '';
  };
}
