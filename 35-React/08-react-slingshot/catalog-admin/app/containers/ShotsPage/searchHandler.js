import { searchObject } from '../../helpers/common';

const searchFields = [
  'shot_info.category.name',
  'shot_info.setup_type.name',
  'shot_info.owner.name',
  'shot_info.status',
  { product_list: ['name'] },
  { prop_list: ['name'] },
];

export class SearchHandler {
  constructor(callback) {
    this.data = [];
    this.callback = callback;
    this.searchString = '';
  }

  setData(data) {
    this.data = data;
  }

  search(searchString) {
    this.searchString = searchString;
    const searchData = searchObject(this.data, this.searchString, searchFields);
    this.callback(searchData);
  }

  searchedData() {
    return searchObject(this.data, this.searchString, searchFields);
  }
}
