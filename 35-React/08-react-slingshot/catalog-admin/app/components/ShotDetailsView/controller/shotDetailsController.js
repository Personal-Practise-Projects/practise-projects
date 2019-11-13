import { getDateTimeInLocalTimeZone, getValueByKeyFromObject, } from '../../../helpers/common';
import { DEFAULT_CARD_COLOR, DETAILS_VIEW_EVENT } from '../constants';
import CommentHandler from './commentHandler';
import { LocationSearch, ProductSearch, PropSearch, } from '../../../actions/search/commonSearchActions';
import { TalentGroupsController } from './talentGroupsContoller';
import { CollaboratorsController } from './collaboratorsContoller';
import { getColorList } from '../../../helpers/services';
import { dataReducersFactory } from '../../ContentsChooser/DataHandler/factory';
import { SHOT_CONTENT, SHOT_REFERENCES_IMAGES, } from '../../ContentsChooser/actions/types';
import { WIDGET_ACTIONS } from '../../ContentsChooser/common/constants';
import { addStatusField, buildDataForObject, selectedReferenceImages, } from '../helper';
import { updateShotDetails } from '../service';
import { StringHelper } from '../../../helpers/utils';
import { ChoiceController } from './choiceController';
import { CHOICE_FIELDS } from '../../../common/constants';
import { SHOT_STATUS } from '../../../common/shot/constants';

export class ShotDetailsController {
  constructor(shot, eventListener) {
    this.ref = shot;
    this.eventListener = eventListener;
    this.commentHandler = new CommentHandler(shot);
    this.dropDownOptions = {
      '#color_tag': [],
    };
    this.dataVersion = -1;
    this._collaboratorsController = new CollaboratorsController(this.ref);
    this.transition_states = [
      SHOT_STATUS.PHOTOSHOOT,
      SHOT_STATUS.CREATIVE_REVIEW,
    ];
  }

  setData(shot) {
    if (this.ref.id !== shot.id) {
      this._collaboratorsController = new CollaboratorsController(shot);
      this.commentHandler = new CommentHandler(shot);
    }
    this.ref = shot;
  }

  getExtraConfig = header => {
    switch (header.uid) {
      case '#produced_content':
        return {};
      case '#next':
        return {
          readonly: this.checkState(),
        };
      default: {
        return {
          readonly: this.ref.shot_info.locked_info.readonly,
          readPlaceholder: StringHelper.format('--'),
        };
      }
    }
  };

  getExistingData = header => {
    switch (header.uid) {
      case '#due_date':
      case '#schedule_on': {
        const value = getValueByKeyFromObject(header.data_key, this.ref);
        return value ? getDateTimeInLocalTimeZone(value.timestamp) : '';
      }
      case '#collaborators':
        return this._collaboratorsController;
      case '#talents':
        return new TalentGroupsController(this.ref);
      case '#location_list': {
        const value = getValueByKeyFromObject(header.data_key, this.ref);
        return value ? [value] : [];
      }
      case '#image_references':
        return selectedReferenceImages(this.ref.image_references);
      case '#color_tag':
        const value = getValueByKeyFromObject(header.data_key, this.ref);
        return value !== null ? value : DEFAULT_CARD_COLOR;
      case CHOICE_FIELDS.CHOICE_SECTION:
        return new ChoiceController(this);
      default: {
        return getValueByKeyFromObject(header.data_key, this.ref);
      }
    }
  };

  getOptionalInfo = (header, callback) => {
    switch (header.uid) {
      case '#color_tag':
        getColorList('SHOT_DETAILS', parsedData => {
          this.dropDownOptions[header.uid] = parsedData;
          callback(this.dropDownOptions[header.uid]);
        });
        break;
    }
  };

  shouldLoadComponent = header => {
    switch (header.uid) {
      case '#next':
        const currentState = this.currentState();
        if (this.transition_states.includes(currentState)) {
          currentState === SHOT_STATUS.PHOTOSHOOT
            ? (header.label = 'Photoshoot done')
            : (header.label = 'Creative review done');
          return true;
        }
        return false;
      default:
        return true;
    }
  };

  getDropDownTitle = (header, value) => {
    switch (header.uid) {
      case '#color_tag':
        const headerData =
          this.dropDownOptions[header.uid] &&
          this.dropDownOptions[header.uid].find(data => data.id === value);
        return headerData && headerData.title;
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#product_list':
        return new ProductSearch(this.ref.brand ? this.ref.brand.id : null);
      case '#prop_list':
        return PropSearch();
      case '#location_list':
        return LocationSearch();
    }
  };

  onDelete = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#location_list':
        this.onUpdate(header, null, callback);
        break;
      default: {
        const options = this.ref[header.data_key];
        const selectedOptions = options.filter(
          item => item.id !== updateWithData.id,
        );
        this.onUpdate(header, selectedOptions, callback);
      }
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    const passCallbackResult = (status, response) => {
      this.dataVersion += 1;
      callback && callback(status, response);
    };
    switch (header.uid) {
      case '#image_references':
        this.eventListener({
          event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
          uploadWidget: dataReducersFactory(
            SHOT_REFERENCES_IMAGES,
            this.imageWidgetActions,
            this.ref,
          ),
        });
        return '';
      case '#produced_content':
        this.eventListener({
          event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
          uploadWidget: dataReducersFactory(
            SHOT_CONTENT,
            this.imageWidgetActions,
            this.ref,
          ),
        });
        return '';
      case '#color_tag':
        this.updateShot(
          { data: JSON.stringify({ color_tag: updateWithData }) },
          passCallbackResult,
        );
        break;
      case '#next':
        this.updateShot(
          {
            data: JSON.stringify(
              buildDataForObject(header, this.currentState()),
            ),
          },
          passCallbackResult,
        );
        break;
      case '#schedule_on':
        const updateWithDataDict = addStatusField(updateWithData);
        this.updateShot(
          { data: JSON.stringify({ ...updateWithDataDict }) },
          passCallbackResult,
        );
        break;
      default: {
        this.updateShot(
          { data: JSON.stringify(buildDataForObject(header, updateWithData)) },
          passCallbackResult,
        );
        break;
      }
    }
  };

  checkState = () => {
    return !this.transition_states.includes(this.currentState());
  };

  currentState = () => this.ref.shot_info.status;

  imageWidgetActions = (actionType, args) => {
    if (actionType === WIDGET_ACTIONS.CLOSE) {
      this.dataVersion++;
      this.eventListener({
        event: DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS,
        payload: this.ref,
      });
      this.eventListener({ event: DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET });
    }
  };

  updateShot = (config, callback) => {
    updateShotDetails(config, this.ref, this.eventListener, callback);
  };

  getHeaders = header => ({
    title: 'Add note',
    placeholder: 'want to add another option',
    uid: header.uid,
    data_key: header.data_key,
  });
}
