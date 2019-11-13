import { COMMON_ACTIONS } from '../../../common/constants';
import { TalentGroupController } from './talentGroupController';
import { getActorTypeSearch } from '../../ShotDetailsView/services/talent';
import { StringHelper } from '../../../helpers/utils';

const CHILD_HEADER = {
  title: null,
  placeholder: 'Select type',
  type: 'twoLevelSelect',
  data_key: '',
  uid: '#talentsTypeSelect',
};

export class TalentController {
  constructor(shot, ref) {
    this.childHeader = CHILD_HEADER;
    this.shot = shot;
    this.ref = ref;
    this.ref.talents = [];
    this.parentshotId = this.shot.shot_info.id;
    this.addButtonTitle = 'Add talent';
    this.__talentTypeList = [];
    this.__childHandlers = [];
    this.loadInitialData();
  }

  getExtraConfig = header => ({
    readonly: this.shot.shot_info.locked_info.readonly || header.disabled,
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
      this.ref.talents.map(talent => {
        this.__childHandlers.push(
          new TalentGroupController(
            talent,
            this.shot,
            this.onChildActionsListener,
            this.__talentTypeList,
          ),
        );
      });
      this.eventListener && this.eventListener(this.__childHandlers);
    });
  };

  onAction = (action, _) => {
    this.ref.talents.push({ actor: [] });
    if (action === COMMON_ACTIONS.CREATE_NEW) {
      this.__childHandlers.push(
        new TalentGroupController(
          this.ref.talents[this.ref.talents.length - 1],
          this.shot,
          this.onChildActionsListener,
          this.__talentTypeList,
        ),
      );
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };

  onChildActionsListener = (action, data) => {
    if (action === COMMON_ACTIONS.DELETE) {
      this.ref.talents = this.ref.talents.filter(talent => talent != data.ref);

      this.__childHandlers = this.__childHandlers.filter(
        handler => handler !== data,
      );
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };
}
