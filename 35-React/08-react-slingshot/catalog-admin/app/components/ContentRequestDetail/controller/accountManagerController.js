import { getCollaboratorsSearch } from '../../ShotDetailsView/services/collaborators';
import { COMMON_ACTIONS } from '../../../common/constants';

export class AccountManagerController {
  constructor(parentControllerRef) {
    this.parentControllerRef = parentControllerRef;
  }

  getSearchAPI = header => {
    // update header since labeled dropdown is showing data from header field
    header.selectedData = this.parentControllerRef.ref.account_manager;
    return getCollaboratorsSearch(header.unique_key);
  };

  onAction = (action, header, data, callback) => {
    switch (action) {
      case COMMON_ACTIONS.DELETE:
        this.parentControllerRef.onUpdate(header, null, callback);
        break;
      case COMMON_ACTIONS.SELECT:
        this.parentControllerRef.onUpdate(header, data.id, callback);
        break;
    }
  };
}
