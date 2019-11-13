import { COMMON_ACTIONS, DONE } from '../../../common/constants';
import {
  createShotCollaborators,
  deleteShotCollaborator,
  getCollaboratorsSearch,
  getCollaboratorTypeSearch,
  getShotCollaborators,
} from '../services/collaborators';

export class CollaboratorsController {
  constructor(ref) {
    this.ref = ref;
    this.refId = ref.shot_info.id;
    this.isLoading = true;
    this.__collaboratorChoices = [];
    this.noDataMessage = 'No collaborator available';
    this.loadInitialData();
  }

  getExistingData = header => this;

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
        if (header.originalData) {
          deleteShotCollaborator(
            this.refId,
            this.__collaboratorChoices,
            header.originalData.id,
            this.__notifyForReceivedCollaborators,
          );
        }
        break;
      case COMMON_ACTIONS.SELECT:
        createShotCollaborators(
          this.refId,
          this.__collaboratorChoices,
          header.id,
          data.id,
          this.__notifyForReceivedCollaborators,
        );
        break;
    }
  };

  loadInitialData = () => {
    getCollaboratorTypeSearch().search(null, null, (_, choices) => {
      getShotCollaborators(
        this.refId,
        choices,
        this.__notifyForReceivedCollaborators,
      );
    });
  };

  __notifyForReceivedCollaborators = (status, choices) => {
    if (status === DONE) {
      this.__collaboratorChoices = choices || [];
      this.isLoading = false;
      this.eventListener &&
        this.eventListener(COMMON_ACTIONS.REFRESH, this.getChoices());
    }
  };

  getSearchAPI = header => getCollaboratorsSearch(header.unique_key);

  getChoices = () =>
    this.__collaboratorChoices.map(choice => {
      choice.readonly =
        this.ref.shot_info && this.ref.shot_info.locked_info.readonly;
      return choice;
    });
}
