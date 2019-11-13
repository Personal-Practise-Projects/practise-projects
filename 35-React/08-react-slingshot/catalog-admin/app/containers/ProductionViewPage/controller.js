import {
  buildPayLoad,
  formatDateToString,
  getDateTimeInUTC,
} from '../../helpers/common';
import {
  AVATAR_STAGE,
  CHOICE_FIELDS,
  DATE_FORMAT,
  DONE,
  GLOBAL_EVENT_TYPE,
  REFRESH,
} from '../../common/constants';
import { updateShotDetails } from '../../components/ShotDetailsView/service';
import { dataReducersFactory } from '../../components/ContentsChooser/DataHandler/factory';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';
import { SHOT_CONTENT } from '../../components/ContentsChooser/actions/types';
import { WIDGET_ACTIONS } from '../../components/ContentsChooser/common/constants';
import getComponent from './helper';
import { getChoices } from '../../helpers/services';
import { SHOT_STATUS_NEXT_MAP } from '../../common/shot/constants';

export default class ProductionViewController {
  constructor(props, ref, eventListener) {
    this.choices = [
      CHOICE_FIELDS.CAMERA_ANGLE,
      CHOICE_FIELDS.LIGHTING,
      CHOICE_FIELDS.CROPPING,
      CHOICE_FIELDS.SHADOWS,
    ];
    this.getChoices();
    this.props = props;
    this.ref = ref || { id: 'ref' };
    this.eventListener = eventListener;
    this.displayShotFilter = [];
  }

  getChoices = () => {
    this.choices.forEach(choice => {
      choice = choice.substring(1);
      getChoices(choice, () => {});
    });
  };

  getExistingData = header => {
    if (header.uid === '#datePicker') {
      // eslint-disable-next-line react/no-this-in-sfc
      return this.props.selectedTimestamp * 1000;
    }
    return null;
  };

  getExtraConfig = header => {
    switch (header.uid) {
      case '#move_status':
        return { readonly: !SHOT_STATUS_NEXT_MAP[this.ref.shot_info.status] };
      default:
        return {};
    }
  };

  getDisplayDate = () => {
    const currentDate = formatDateToString(new Date(), DATE_FORMAT);
    const selectedDate = formatDateToString(
      this.props.selectedTimestamp * 1000,
      DATE_FORMAT,
    );
    return selectedDate === currentDate ? 'today' : selectedDate;
  };

  onUpdate = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#datePicker':
        // eslint-disable-next-line react/no-this-in-sfc,no-case-declarations
        const selectedTimestamp = updateWithData ? updateWithData / 1000 : null;
        // eslint-disable-next-line react/no-this-in-sfc,react/no-this-in-sfc
        this.props.updateTimestamp(selectedTimestamp);
        // eslint-disable-next-line react/no-this-in-sfc
        this.resetAndFetchProductionViewCards(selectedTimestamp);
        break;
      case '#todayPicker':
        // eslint-disable-next-line react/no-this-in-sfc
        this.resetAndFetchProductionViewCards(
          getDateTimeInUTC(new Date()) / 1000,
        );
        break;
      case '#move_status':
        // eslint-disable-next-line no-case-declarations
        const value = {
          data: JSON.stringify(
            buildPayLoad({
              [header.data_key]:
                // eslint-disable-next-line react/no-this-in-sfc
                SHOT_STATUS_NEXT_MAP[this.ref.shot_info.status],
            }),
          ),
        };
        updateShotDetails(
          value,
          // eslint-disable-next-line react/no-this-in-sfc
          this.ref,
          // eslint-disable-next-line react/no-this-in-sfc
          this.eventListener,
          (status, updatedShotData) => {
            if (status === DONE) {
              this.props.updateShots(updatedShotData);
              this.eventListener({ event: REFRESH });
              callback();
            }
          },
        );
        break;
      case '#produced_content':
        // eslint-disable-next-line react/no-this-in-sfc
        this.eventListener({
          event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
          uploadWidget: dataReducersFactory(
            SHOT_CONTENT,
            // eslint-disable-next-line react/no-this-in-sfc
            this.imageWidgetActions,
            // eslint-disable-next-line react/no-this-in-sfc
            this.ref,
          ),
        });
        break;
      default:
        break;
    }
    return null;
  };

  resetAndFetchProductionViewCards(timestamp) {
    this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
    this.props.fetchProductionViewCards(timestamp);
    this.props.fetchProductionViewCollaborators(timestamp);
  }

  imageWidgetActions = actionType => {
    if (actionType === WIDGET_ACTIONS.CLOSE) {
      this.eventListener({
        event: DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET,
      });
    }
  };

  getScreenInfo() {
    return AVATAR_STAGE.PRODUCTION_VIEW;
  }

  setProps = props => {
    this.props = props;
  };

  getComponent = item => getComponent(item);
}
