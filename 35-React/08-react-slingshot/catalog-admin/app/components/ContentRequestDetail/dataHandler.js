import CRCommentHandler from './commentHandler';

import {
  buildPayLoad,
  getDateTimeInLocalTimeZone,
  getValueByKeyFromObject,
} from '../../helpers/common';
import { getBrandSearch } from '../../actions/search/commonSearchActions';
import { ChannelSearch } from '../../actions/search/channelSearch';
import {
  getContentRequestChoices,
  updateContentRequestDetails,
} from './service';
import { RequestedItemsController } from './controller/requestedItemList';
import { ACCOUNT_MANAGER } from '../../common/constants';
import { AccountManagerController } from './controller/accountManagerController';

export class DataHandler {
  constructor(contentRequest, dispatcher, eventListener = undefined) {
    this.id = contentRequest.id;
    this.ref = contentRequest;
    this.dispatcher = dispatcher;
    this.commentHandler = new CRCommentHandler(contentRequest);
    this.eventListener = eventListener;
  }

  setData(contentRequest) {
    this.ref = contentRequest;
    this.commentHandler = new CRCommentHandler(contentRequest);
  }

  getExistingData = header => {
    switch (header.uid) {
      case '#due_date': {
        const value = getValueByKeyFromObject(header.data_key, this.ref);
        return value ? getDateTimeInLocalTimeZone(value.timestamp) : '';
      }
      case '#requestedItems': {
        return new RequestedItemsController(this.ref);
      }
      case ACCOUNT_MANAGER: {
        return new AccountManagerController(this);
      }
      default: {
        return getValueByKeyFromObject(header.data_key, this.ref);
      }
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#brand':
        return getBrandSearch();
      case '#channels':
        return new ChannelSearch();
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    const passCallbackResult = (status, response) => {
      callback(status, response);
    };
    switch (header.uid) {
      default: {
        const config = {
          data: JSON.stringify(
            buildPayLoad({ [header.data_key]: updateWithData }),
          ),
        };
        this.updateContentRequest(config, passCallbackResult);
        break;
      }
    }
  };

  getOptionalInfo = (header, callback) => {
    switch (header.uid) {
      case '#status':
        getContentRequestChoices(callback);
        break;
    }
  };

  getDropDownTitle = header => this.getExistingData(header);

  onDelete = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#brand':
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

  updateContentRequest = (config, callback) => {
    updateContentRequestDetails(config, this.ref, this.dispatcher, callback);
  };
}
