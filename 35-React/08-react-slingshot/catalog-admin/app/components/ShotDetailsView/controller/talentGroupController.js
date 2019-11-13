import Logger from '../../../logging/logger';
import { generateUniqueId } from '../../../helpers/common';
import {
  deleteActor,
  deleteActorGroup,
  getActorSearch,
  updateActorGroup,
} from '../services/talent';
import { ACTIONS } from '../../AddMoreItems/twoLevelSelect';
import { ArrayUtils, StringHelper } from '../../../helpers/utils';
import { getIdArrayFromObjectArray } from '../../../actions/search/helpers';
import { DONE } from '../../../common/constants';

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
        const actorObject = {
          actor_id: updateWithData.id,
          group_id: this.ref.group,
        };
        deleteActor(actorObject, this.parentRefId, data => {
          this.ref.actor = this.ref.actor.filter(
            actor => actor.id !== updateWithData.id,
          );
          // If all the child from group is deleted then remove the group also
          if (!(this.ref.actor && this.ref.actor.length)) {
            this.actionsListener && this.actionsListener(ACTIONS.DELETE, this);
          }
          logger.log(`Mapped Actor deleted latest data is ${data}`);
        });
        break;
      case '#talentsTypeSelect':
        // If group has child then also delete all the child of the group from server
        if (this.ref.group !== undefined) {
          deleteActorGroup(this.parentRefId, this.ref.group);
        }
        this.actionsListener && this.actionsListener(ACTIONS.DELETE, this);
        break;
      default:
        logger.log(`Unknown event with header ${header}`);
    }
  };

  addTalentGroupType = updateWithData => {
    Object.assign(this.ref, { ...updateWithData });
    this.showLevelTwo = this.ref && this.ref.type;
    this.eventListener && this.eventListener(ACTIONS.REFRESH);
  };

  addTalentInGroup = updateWithData => {
    const latestActorsIds = getIdArrayFromObjectArray(updateWithData);
    const existingActors = getIdArrayFromObjectArray(this.ref.actor);
    const newActor = ArrayUtils.arrSubtract(latestActorsIds, existingActors);
    if (newActor && newActor.length) {
      const data = {
        group: this.ref.group,
        actor: newActor,
      };

      updateActorGroup(data, this.parentRefId, (status, data) => {
        if (status === DONE) {
          Object.assign(this.ref, data);
          logger.log(data);
        }
      });
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
