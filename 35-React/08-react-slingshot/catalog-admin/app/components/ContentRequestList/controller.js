import { fetchAccountManagers } from './services';
import { ACTIVE_SCREEN } from '../../common/constants';
import { accountManagersParser } from './parser';

export class ContentRequestListController {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.fetchAccountManagers();
  }

  resetEventListener() {
    this.eventListener = null;
  }

  fetchAccountManagers() {
    fetchAccountManagers(data => {
      this.eventListener({
        type: ACTIVE_SCREEN.CONTENT_REQUEST,
        data: accountManagersParser(data),
      });
    });
  }
}
