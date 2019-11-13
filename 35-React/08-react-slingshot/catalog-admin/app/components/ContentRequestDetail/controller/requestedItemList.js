import { getRequestedItems } from '../services/requestedItems';
import { COMMON_ACTIONS, DONE } from '../../../common/constants';
import { ShotCategorySearch } from '../../../actions/search/commonSearchActions';
import { RequestedItemController } from './requestedItemController';

const CHILD_DEADER = {
  title: null,
  placeholder: 'Select Category',
  type: 'countSelect',
  data_key: '',
  uid: '#requestedItem',
};
export class RequestedItemsController {
  constructor(ref) {
    this.childHeader = CHILD_DEADER;
    this.ref = ref;
    this.addButtonTitle = 'Add shot category';
    this.addMoreHelpText = 'Click to add category in shot';
    this.__shotCategory = [];
    this.__childHandlers = [];
    this.loadInitialData();
  }

  disableAddMore = () => false;

  register = callback => {
    this.eventListener = callback;
    if (this.__childHandlers.length) {
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };

  loadInitialData = () => {
    ShotCategorySearch().search(null, null, (_, parsedData) => {
      this.__shotCategory = parsedData;
      getRequestedItems(this.ref.id, (status, data) => {
        if (status === DONE) {
          this.ref.requestedItems = data;
          this.ref.requestedItems.map(requestedItem => {
            this.__childHandlers.push(
              new RequestedItemController(
                requestedItem,
                this.ref,
                this.onChildActionsListener,
                this.__shotCategory,
              ),
            );
          });
          this.eventListener && this.eventListener(this.__childHandlers);
        }
      });
    });
  };

  onAction = (action, _) => {
    if (action === COMMON_ACTIONS.CREATE_NEW) {
      this.__childHandlers.push(
        new RequestedItemController(
          { content_request_id: this.ref.id },
          this.ref,
          this.onChildActionsListener,
          this.__shotCategory,
        ),
      );
      this.eventListener && this.eventListener(this.__childHandlers);
    }
  };

  onChildActionsListener = (action, data) => {
    if (action === COMMON_ACTIONS.DELETE) {
      this.__childHandlers = this.__childHandlers.filter(
        handler => handler !== data,
      );
      this.eventListener && this.eventListener(this.__childHandlers);
    } else if (action === COMMON_ACTIONS.ADDED) {
      this.ref.requestedItems.push(data.ref);
    }
  };
}
