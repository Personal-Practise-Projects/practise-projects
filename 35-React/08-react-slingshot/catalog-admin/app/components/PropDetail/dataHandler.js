import AxiosBuilder from '../../common/axiosBuilder';

import { buildPayLoad } from '../../helpers/common';
import { DONE, FAILED, PROP_LIST_END_POINT } from '../../common/constants';
import { ON_UPDATE_PROP } from '../../actions/types';
import { LocationSearch } from '../../actions/search/commonSearchActions';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import { WIDGET_ACTIONS } from '../ContentsChooser/common/constants';
import { dataReducersFactory } from '../ContentsChooser/DataHandler/factory';
import { PROP_IMAGES } from '../ContentsChooser/actions/types';

export class DataHandler {
  constructor(prop, propsDispatcher, eventListener) {
    this.ref = prop;
    this.propsDispatcher = propsDispatcher;
    this.eventListener = eventListener;
    this.propId = prop.id;
    this.dataVersion = -1;
  }

  getExistingData = header => {
    switch (header.uid) {
      case '#location':
        const value = this.ref[header.data_key];
        return value ? [value] : [];
      case '#prop_images':
        return selectedPropImages(this.ref.images);
      default:
        return this.ref[header.data_key];
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#location':
        return LocationSearch();
    }
  };

  onUpdate = (header, updatedValue, callback) => {
    const dataKey = header.data_key;
    switch (header.uid) {
      case '#prop_images':
        this.eventListener({
          event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
          uploadWidget: dataReducersFactory(
            PROP_IMAGES,
            this.imageWidgetActions,
            this.ref,
          ),
        });
        return '';
      default:
        this.updateHandler(dataKey, updatedValue, callback);
    }
  };

  updateHandler = (dataKey, updatedValue, callback) => {
    const data = JSON.stringify(buildPayLoad({ [dataKey]: updatedValue }));
    new AxiosBuilder(`${PROP_LIST_END_POINT}${this.propId}/`, { data })
      .withAuth()
      .PATCH()
      .then(response => this.successCallback(response, callback))
      .catch(errorResponse => callback(FAILED, errorResponse.response.data));
  };

  successCallback = (response, callback) => {
    this.propsDispatcher({ type: ON_UPDATE_PROP, payload: response.data });
    this.dataVersion++;
    callback(DONE, response);
  };

  imageWidgetActions = (actionType, args) => {
    switch (actionType) {
      case WIDGET_ACTIONS.CLOSE:
        this.dataVersion++;
        this.propsDispatcher({ type: ON_UPDATE_PROP, payload: this.ref });
        this.eventListener({ event: DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET });
        break;
    }
  };
}

export function selectedPropImages(images) {
  const selectedFiles = [];
  images.forEach(file => {
    if (file.status === 'SELECTED') {
      selectedFiles.push(file);
    }
  });
  return selectedFiles;
}
