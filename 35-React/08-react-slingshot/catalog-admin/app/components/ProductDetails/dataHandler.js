import { ON_UPDATE_PRODUCTS } from '../../actions/types';
import { getDateTimeInLocalTimeZone } from '../../helpers/common';
import { DONE } from '../../common/constants';
import { getBrandSearch, getTenantSearch, LocationSearch } from '../../actions/search/commonSearchActions';
import { dataReducersFactory } from '../ContentsChooser/DataHandler/factory';
import { PRODUCT_IMAGES } from '../ContentsChooser/actions/types';
import { DETAILS_VIEW_EVENT } from '../ShotDetailsView/constants';
import { WIDGET_ACTIONS } from '../ContentsChooser/common/constants';
import { updateProductInfo } from '../../services/product';
import Logger from "../../logging/logger";

const PRODUCT_STATUS = [
  { id: 'GOOD', title: 'Good' },
  { id: 'DAMAGED', title: 'Damaged' },
  { id: 'RETURNED', title: 'Returned' },
  { id: 'SWATCHABLE', title: 'Swatchable' },
];

const logger = Logger.createLogger('ProductDetails');

export class DataHandler {
  constructor(product, updateProduct, eventListener) {
    this.ref = product;
    this.eventListener = eventListener;
    this.updateProduct = updateProduct;
    this.dataVersion = -1;
  }

  getExistingData = header => {
    switch (header.uid) {
      case '#receivedOn':
      case '#expireOn': {
        const value = this.ref[header.data_key];
        return value ? getDateTimeInLocalTimeZone(value.timestamp) : '';
      }
      case '#brand':
      case '#storage_location': {
        const value = this.ref[header.data_key];
        return value ? [value] : [];
      }
      case '#contentRequest': {
        const value = this.ref[header.data_key];
        return value && value.length
          ? value.map(a => `CR ${a}`).join(', ')
          : 'No Mapped Content Request';
      }
      case '#product_images':
        return selectedProductImages(this.ref.images);
      case '#tenant':
        return this.ref[header.data_key];
      default:
        return this.ref[header.data_key];
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#brand':
        return getBrandSearch();
      case '#storage_location':
        return LocationSearch();
      case '#tenant':
        return getTenantSearch();
    }
  };

  getOptionalInfo = (header, callback) => {
    if (header.uid === '#tenant') {
      getTenantSearch().search('', [], (searchString, data) => {
        callback(data);
      });
    } else {
      callback(PRODUCT_STATUS);
    }
  };

  //TODO it should be part of get Existing Data
  getDropDownTitle = (header, selectedOption) => {
    if (header.uid === '#tenant') {
      return (this.ref[header.data_key] && this.ref[header.data_key].name) || header.placeholder
    } else {
      const headerData =
        PRODUCT_STATUS && PRODUCT_STATUS.find(data => data.id === selectedOption);
      return headerData.title;
    }
  };

  onDelete = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#brand':
      case '#storage_location':
      case '#tenant':
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
    const data = {};
    const dataKey = header.data_key;
    const passCallbackResult = (status, response) => {
      if (status === DONE) {
        this.ref[dataKey] = updateWithData;
        this.updateProduct(response);
      }
      callback(status, response);
    };
    switch (header.uid) {
      case '#receivedOn':
      case '#expireOn':
        data[dataKey] = updateWithData ? updateWithData / 1000 : null;
        break;
      case '#brand':
      case '#storage_location':
      case '#tenant':
        data[dataKey] = updateWithData ? updateWithData.id : null;
        break;
      case '#product_images':
        this.eventListener({
          event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
          uploadWidget: dataReducersFactory(
            PRODUCT_IMAGES,
            this.imageWidgetActions,
            this.ref,
          ),
        });
        return '';
      default:
        data[dataKey] = updateWithData;
    }
    updateProductInfo(this.ref.id, data, passCallbackResult);
  };

  successCallback = (dispatch, response) => {
    dispatch({
      type: ON_UPDATE_PRODUCTS,
      payload: response.data,
    });
  };

  errorCallback = errorResponse => logger.error(errorResponse);

  imageWidgetActions = (actionType, args) => {
    switch (actionType) {
      case WIDGET_ACTIONS.CLOSE:
        this.dataVersion++;
        this.updateProduct(this.ref);
        this.eventListener({ event: DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET });
        break;
    }
  };
}

export function selectedProductImages(images) {
  const selectedFiles = [];
  images.forEach(file => {
    if (file.status === 'SELECTED') {
      selectedFiles.push(file);
    }
  });
  return selectedFiles;
}
