import { CategorySearch, getBrandAdminSearch, StaffUsersList, } from '../../actions/search/commonSearchActions';
import { DONE } from '../../common/constants';
import { dataReducersFactory } from '../ContentsChooser/DataHandler/factory';
import { CONTENT_STATUS, WIDGET_ACTIONS } from '../ContentsChooser/common/constants';
import { BRAND_REFERENCES } from '../ContentsChooser/actions/types';
import { DETAILS_VIEW_EVENT } from './constants';

export class BrandDetailsInputDataHandler {
  constructor(brand, updateHandler, eventListener) {
    this.ref = brand;
    this.dataVersion = -1;
    this.updateHandler = updateHandler;
    this.eventListener = eventListener;
  }

  setData(brand) {
    this.ref = brand;
  }

  getExistingData = header => {
    switch (header.uid) {
      case '#website':
        return this.ref.website;
      case '#instagram_handle':
        return this.ref.instagram_handle;
      case '#categories':
        return this.ref.categories.map(category => {
          category.thumbnail = category.logo_thumbnail;
          delete category.logo_thumbnail;
          return category;
        });
      case '#brand_admin':
        const brand_admin = this.ref.brand_admin && {
          id: this.ref.brand_admin.id,
          name: `${this.ref.brand_admin.name || ''} <${
            this.ref.brand_admin.email
          }>`,
        };
        return brand_admin;
      case '#notes':
        return this.ref.notes;
      case '#color_code':
        return this.ref.color_code;
      case '#reference_files':
        return __selectedFiles(this.ref.reference_files);
      default:
        return '';
    }
  };

  getSearchAPI = header => {
    switch (header.uid) {
      case '#categories':
        return CategorySearch();
      case '#brand_users':
        return new StaffUsersList();
      case '#brand_admin':
        return getBrandAdminSearch(this.ref.id);
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
      case '#reference_files':
        this.eventListener({
          event: DETAILS_VIEW_EVENT.OPEN_FILE_WIDGET,
          uploadWidget: dataReducersFactory(
            BRAND_REFERENCES,
            this.fileWidgetHandler,
            this.ref,
          ),
        });
        return '';
      case '#categories':
        data[dataKey] = updateWithData.map(category => category.id);
        this.updateHandler(this.ref.id, data, passCallbackResult);
        break;
      case '#brand_admin':
        data[dataKey] = updateWithData.id;
        this.updateHandler(this.ref.id, data, passCallbackResult);
        break;
      default:
        data[dataKey] = updateWithData;
        this.updateHandler(this.ref.id, data, passCallbackResult);
    }
  };

  onDelete = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#brand_admin':
        this.onUpdate(header, null, callback);
        break;
    }
  };

  fileWidgetHandler = (action, args) => {
    switch (action) {
      case WIDGET_ACTIONS.CLOSE:
        this.dataVersion++;
        this.eventListener({
          event: DETAILS_VIEW_EVENT.CLOSE_FILE_WIDGET,
        });
        break;
    }
  };
}

function __selectedFiles(files) {
  const selectedFiles = [];
  files.forEach(file => {
    if (file.status === CONTENT_STATUS.MAPPED) {
      selectedFiles.push(file);
    }
  });
  return selectedFiles;
}
