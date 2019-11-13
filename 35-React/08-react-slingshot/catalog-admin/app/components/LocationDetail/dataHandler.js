import { buildPayLoad, getValueByKeyFromObject } from '../../helpers/common';
import { CategorySearch, StaffUsersList, } from '../../actions/search/commonSearchActions';
import { dataReducersFactory } from '../ContentsChooser/DataHandler/factory';
import { LOCATION_IMAGES } from '../ContentsChooser/actions/types';
import { CONTENT_STATUS, WIDGET_ACTIONS } from '../ContentsChooser/common/constants';
import { updateLocation } from './service';
import { DONE } from '../../common/constants';

export default class LocationDataHandler {
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
      case '#location_photos':
        return __selectedImages(this.ref.images);
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
    const data = {};
    const dataKey = header.data_key;
    const passCallbackResult = (status, response) => {
      if (status === DONE) {
        this.ref[dataKey] = updateWithData;
      }
      callback(status, response);
    };
    switch (header.uid) {
      case '#location_photos':
        __openLocationImageWidget(
          this.ref,
          this.props.openContentWidget,
          this.imageWidgetHandler,
        );
        break;
      case '#price':
        if (!updateWithData) {
          updateWithData = null;
        }
      default:
        data[dataKey] = updateWithData;
        this.updateLocationDetail(data, passCallbackResult);
    }
  };

  updateLocationDetail = (payload, callback) => {
    const config = {
      data: JSON.stringify(buildPayLoad(payload)),
    };
    updateLocation(config, this.ref, this.props.onUpdateLocation, callback);
  };

  imageWidgetHandler = (action, args) => {
    switch (action) {
      case WIDGET_ACTIONS.CLOSE:
        const payload = {
          id: this.ref.id,
          key: 'images',
          value: this.ref.images,
        };
        this.dataVersion += 1;
        this.props.updateLocationImages(payload);
        this.props.closeContentWidget();
        break;
    }
  };
}

function __openLocationImageWidget(ref, dispatcher, callbackListener) {
  const injectors = dataReducersFactory(LOCATION_IMAGES, callbackListener, ref);
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
