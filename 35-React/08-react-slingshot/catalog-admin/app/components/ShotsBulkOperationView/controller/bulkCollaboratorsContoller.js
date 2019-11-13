import { COMMON_ACTIONS } from '../../../common/constants';
import { getCollaboratorsSearch } from '../../ShotDetailsView/services/collaborators';

export class BulkCollaboratorsController {
  constructor(selectedChoices) {
    this.isLoading = false;
    this.__collaboratorChoices = selectedChoices;
  }

  register = callback => {
    this.eventListener = callback;
    if (this.getChoices().length) {
      this.eventListener &&
        this.eventListener(COMMON_ACTIONS.REFRESH, this.getChoices());
    }
  };

  onAction = (action, header, data) => {
    switch (action) {
      case COMMON_ACTIONS.DELETE:
        header.onSelected();
        this.eventListener &&
          this.eventListener(COMMON_ACTIONS.REFRESH, this.getChoices());
        break;
      case COMMON_ACTIONS.SELECT:
        header.onSelected(data);
        this.eventListener &&
          this.eventListener(COMMON_ACTIONS.REFRESH, this.getChoices());
        break;
    }
  };

  getSearchAPI = header => getCollaboratorsSearch(header.unique_key);

  getChoices = () => this.__collaboratorChoices;

  getExistingData = header => this;
}
