import { COMMON_ACTIONS, DONE } from '../../../common/constants';
import { TalentGroupController } from './talentGroupController';
import { getActorTypeSearch, getTalentData } from '../services/talent';
import { StringHelper } from '../../../helpers/utils';

const CHILD_HEADER = {
  title: null,
  placeholder: 'Select type',
  type: 'twoLevelSelect',
  data_key: '',
  uid: '#talentsTypeSelect',
};

export class TalentGroupsController {
  constructor(ref) {
    this.childHeader = CHILD_HEADER;
    this.ref = ref;
    this.parentRefId = this.ref.shot_info.id;
    this.addButtonTitle = 'Add talent';
    this.addMoreHelpText = 'Click to add talent in shot';
    this.__talentTypeList = [];
    this.__childHandlers = [];
    this.loadInitialData();
  }

  getExtraConfig = header => ({
    readonly: this.ref.shot_info.locked_info.readonly || header.disabled,
    readPlaceholder: StringHelper.format('--'),
  });

  disableAddMore = () => false;

  register = callback => {
    this.eventListener = callback;
    if (this.__childHandlers.length) {
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };

  loadInitialData = () => {
    getActorTypeSearch().search(null, null, (_, parsedData) => {
      this.__talentTypeList = parsedData;
      getTalentData(this.parentRefId, (status, data) => {
        if (status === DONE) {
          data.map(talentGroup => {
            this.__childHandlers.push(
              new TalentGroupController(
                talentGroup,
                this.ref,
                this.onChildActionsListener,
                this.__talentTypeList,
              ),
            );
          });
          this.eventListener && this.eventListener(this.__childHandlers);
        }
      });
    });
  };

  onAction = (action, _) => {
    if (action === COMMON_ACTIONS.CREATE_NEW) {
      this.__childHandlers.push(
        new TalentGroupController(
          { actor: [] },
          this.ref,
          this.onChildActionsListener,
          this.__talentTypeList,
        ),
      );
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };

  onChildActionsListener = (action, data) => {
    if (action === COMMON_ACTIONS.DELETE) {
      this.__childHandlers = this.__childHandlers.filter(
        handler => handler !== data,
      );
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };
}
