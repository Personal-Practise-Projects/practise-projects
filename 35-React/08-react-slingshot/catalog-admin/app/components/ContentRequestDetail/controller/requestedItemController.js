import { createRequestedItems, deleteRequestedItems, updateRequestedItems } from "../services/requestedItems";
import { COMMON_ACTIONS, DONE } from "../../../common/constants";
import Logger from "../../../logging/logger";
import { buildCategoryOption } from "../../../helpers/shotHelpers";

const logger = Logger.createLogger('ContentRequestItems');
export class RequestedItemController {
  constructor(ref, crRef, actionsListener, shotCategoriesOptions) {
    this.uid = ref.id;
    this.ref = ref;
    this.crRef = crRef;
    this.actionsListener = actionsListener;
    this.count = this.ref && this.ref.count || 0;
    this.minValue = 1;
    this.shotCategoriesOptions = buildCategoryOption(this.ref.contentCategory, shotCategoriesOptions);
  }

  getExistingData = () => {
    return this.ref && this.ref.contentCategory && this.ref.contentCategory.id
  };

  getDropDownTitle = (_, value) => {
    const headerData = this.shotCategoriesOptions && this.shotCategoriesOptions.find(data => data.id === value);
    return headerData && headerData.title;
  };

  getOptionalInfo = (_, callback) => {
    callback(this.shotCategoriesOptions)
  };

  onUpdate = (header, updateWithData, callback) => {
    switch (header.uid) {
      case '#count':
        this.createOrUpdateItem(updateWithData);
        break;
      case '#delete':
        this.ref.id ? deleteRequestedItems(this.crRef.id, this.ref.id, () => {
          this.actionsListener(COMMON_ACTIONS.DELETE, this)
        }) : this.actionsListener(COMMON_ACTIONS.DELETE, this);
        break;
      case '#requestedItem':
        this.createOrUpdateItem({ content_category: updateWithData });
        break;
      default:
        logger.log('Unknown event with header ' + header)
    }
  };

  createOrUpdateItem = (updateWithData) => {
    Object.assign(this.ref, { ...updateWithData });
    if (this.ref.id) {
      delete this.ref.cantent_category;
      updateRequestedItems(this.crRef.id, this.ref.id, this.ref, (status, response) => {
        if (status === DONE) {
          Object.assign(this.ref, response)
        }
        logger.log(response)
      })
    } else {
      //Check whether the both value (count+category) is available for creating reference or not
      if (this.ref.content_category && this.ref.count) {
        createRequestedItems(this.crRef.id, this.ref, (status, response) => {
          if (status === DONE) {
            Object.assign(this.ref, response);
            this.actionsListener(COMMON_ACTIONS.ADDED, this);
          }
        });
      }
    }
  };


}

