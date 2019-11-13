import AxiosBuilder from '../../common/axiosBuilder';
import { buildPayLoad, getValueByKeyFromObject } from '../../helpers/common';
import {
  CategorySearch,
  StaffUsersList,
} from '../../actions/search/commonSearchActions';
import { dataReducersFactory } from '../ContentsChooser/DataHandler/factory';
import { ACTOR_IMAGES } from '../ContentsChooser/actions/types';
import {
  CONTENT_STATUS,
  WIDGET_ACTIONS,
} from '../ContentsChooser/common/constants';
import { ActorChoiceController } from './ActorChoiceController';
import { CHOICE_FIELDS, DONE, FAILED } from '../../common/constants';

export default class ActorDataHandler {
  constructor(props, ref) {
    this.props = props;
    this.ref = ref;
    this.dataVersion = -1;
  }

  setData(props, location) {
    Object.assign(this.props, { ...props });
    this.ref = location;
  }

  getExistingData = header => {
    switch (header.uid) {
      case '#actor_photos':
        return __selectedImages(
          getValueByKeyFromObject(header.data_key, this.ref),
        );
      case CHOICE_FIELDS.CHOICE_SECTION:
        return new ActorChoiceController(this);
      default:
        return getValueByKeyFromObject(header.data_key, this.ref);
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#categories':
        return CategorySearch();
      case '#brand_users':
        return StaffUsersList();
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    const payload = {};
    const dataKey = header.data_key;
    const passCallbackResult = (status, ref, response) => {
      if (status === DONE) {
        Object.assign(ref, { ...response });
        this.props.updateActor(response);
      }
      callback(status, response);
    };
    switch (header.uid) {
      case '#actor_photos':
        __openLocationImageWidget(
          this.ref,
          this.props.openContentWidget,
          this.imageWidgetHandler,
        );
        break;
      default:
        payload[dataKey] = updateWithData;
        this.__updateDetail(payload, passCallbackResult);
    }
  };

  imageWidgetHandler = (action, args) => {
    switch (action) {
      case WIDGET_ACTIONS.CLOSE:
        this.dataVersion += 1;
        this.props.updateActor(this.ref);
        this.props.closeContentWidget();
        break;
    }
  };

  __updateDetail = (payload, callbackListener) => {
    updateActorService(
      buildPayLoad(payload),
      this.ref,
      this.props.selectedActorType,
      callbackListener,
    );
  };
}

function __openLocationImageWidget(ref, dispatcher, callbackListener) {
  const injectors = dataReducersFactory(ACTOR_IMAGES, callbackListener, ref);
  dispatcher(injectors);
}

function __selectedImages(images) {
  const selectedFiles = [];
  images.forEach(file => {
    if (file.status === CONTENT_STATUS.MAPPED) {
      selectedFiles.push(file);
    }
  });
  return selectedFiles;
}

export function updateActorService(payload, ref, actorType, callbackListener) {
  const config = {
    data: JSON.stringify(payload),
  };
  new AxiosBuilder(`/${actorType}/${ref.id}/`, config)
    .withAuth()
    .PATCH()
    .then(response => {
      callbackListener(DONE, ref, response.data);
    })
    .catch(error => {
      callbackListener(FAILED, ref, error);
    });
}
