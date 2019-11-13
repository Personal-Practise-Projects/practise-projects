import { getBrandSearch } from '../../actions/search/commonSearchActions';
import { ACTIVE_SCREEN, COMMON_ACTIONS } from '../../common/constants';

export default class ContentRequestDataHandler {
  constructor() {
    this.brandSearch = getBrandSearch();
  }

  setEventListener = eventListener => {
    this.eventListener = eventListener;
  };

  getExistingData = header => {
    switch (header.uid) {
      default: {
        return null;
      }
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#brand':
        return this.brandSearch;
    }
  };

  onUpdate = (header, updateWithData, callback) => {
    switch (header.uid) {
      default:
        this.eventListener({
          event: COMMON_ACTIONS.CREATE_NEW,
          data: updateWithData,
        });
    }
  };

  getOptionalInfo = (header, callback) => {
    const passCallbackResult = (searchString, response) => {
      callback(response);
    };
    switch (header.uid) {
      default:
        this.brandSearch.search('', [], passCallbackResult);
        break;
    }
  };

  getDropDownTitle = header => this.getExistingData(header);

  getScreenInfo() {
    return ACTIVE_SCREEN.CONTENT_REQUEST;
  }
}
