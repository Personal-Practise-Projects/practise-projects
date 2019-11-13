import Logger from '../../../logging/logger';
import { generateUniqueId } from '../../../helpers/common';
import { getActorSearch } from '../../ShotDetailsView/services/talent';
import { ACTIONS } from '../../AddMoreItems/twoLevelSelect';
import { StringHelper } from '../../../helpers/utils';

const logger = Logger.createLogger('ContentRequestItems');
const TALENT_CHILD_KEYS = '#talentActor';

export class TalentGroupController {
  constructor(ref, shotRef, actionsListener, talentTypeOptions) {
    this.uid = ref.id;
    this.ref = ref;
    this.shotRef = shotRef;
    this.parentRefId = this.shotRef.shot_info.id;
    this.actionsListener = actionsListener;
    this.showLevelTwo = this.ref && this.ref.type;
    this.minValue = 1;
    this.talentTypeOptions = talentTypeOptions;
  }

  getExtraConfig = header => {
    if (header.uid === TALENT_CHILD_KEYS) {
      return {
        readonly: this.shotRef.shot_info.locked_info.readonly,
        readPlaceholder: StringHelper.format('--'),
      };
    }
    return {
      readonly: this.shotRef.shot_info.locked_info.readonly,
      changeable: !this.ref.type,
      readPlaceholder: StringHelper.format('--'),
    };
  };

  setEventListener = callbackListener => {
    this.eventListener = callbackListener;
  };

  getExistingData = header => {
    if (header && header.uid === TALENT_CHILD_KEYS) {
      return this.ref.actor;
    }
    return this.ref && this.ref.type;
  };

  getDropDownTitle = (header, value) => {
    if (header.uid === TALENT_CHILD_KEYS) {
      // TODO check if required to handle
    } else {
      const headerData =
        this.talentTypeOptions &&
        this.talentTypeOptions.find(data => data.id === value);
      return headerData && headerData.title;
    }
  };

  getOptionalInfo = (header, callback) => {
    if (header.uid === TALENT_CHILD_KEYS) {
      // TODO check if required to handle
    } else {
      callback(this.talentTypeOptions);
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#talentActor':
        this.addTalentInGroup(updateWithData);
        break;
      case '#talentsTypeSelect':
        this.addTalentGroupType({ type: updateWithData });
        break;
      default:
        logger.log(`Unknown event with header ${header}`);
    }
    callback && callback();
  };

  onDelete = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#talentActor':
        this.ref.actor = this.ref.actor.filter(
          actor => actor.id !== updateWithData.id,
        );
        // If all the child from group is deleted then remove the group also
        if (!(this.ref.actor && this.ref.actor.length)) {
          this.actionsListener && this.actionsListener(ACTIONS.DELETE, this);
        }
        break;
      case '#talentsTypeSelect':
        // If group has child then also delete all the child of the group from server
        this.actionsListener && this.actionsListener(ACTIONS.DELETE, this);
        break;
      default:
        logger.log(`Unknown event with header ${header}`);
    }
  };

  addTalentGroupType = updateWithData => {
    if (Object.keys(updateWithData).length > 0) {
      Object.assign(this.ref, { ...updateWithData });
      this.showLevelTwo = this.ref && this.ref.type;
      this.eventListener && this.eventListener(ACTIONS.REFRESH);
    }
  };

  addTalentInGroup = updateWithData => {
    if (Object.keys(updateWithData).length > 0) {
      const data = {
        group: this.ref.group,
        actor: updateWithData,
      };
      Object.assign(this.ref, data);
    }
  };

  getSearchAPI = () => getActorSearch(this.ref.type);

  getChildHeader = () => ({
    title: '',
    id: generateUniqueId(),
    canReselect: false,
    updateOnSelect: false,
    placeholder: `Select ${this.ref.type}`,
    uid: TALENT_CHILD_KEYS,
  });
}
