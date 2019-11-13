import { CALLBACK_EVENTS } from '../DataHandler/base';
import { searchObject } from '../../../helpers/common';

const SEARCH_FIELDS = ['fileKey'];

export class SearchHandler {
  constructor(eventListener) {
    this.callback = eventListener
  }

  setAllData = (data) => {
    this.data = data;
  };

  search = searchString => {
    this.callback(
      CALLBACK_EVENTS.DATA_UPDATED,
      searchObject(this.data, searchString, SEARCH_FIELDS),
    );
  };
}
