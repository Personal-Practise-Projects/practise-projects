import { logout } from '../../common/handler';
import {
  redirectToOrderHistory,
  redirectToInviteUsers,
} from '../../common/helpers';
import { TenantController } from './controllers/tenant';
import { CHANGE_PASSWORD_MODAL } from '../../actions/types';
import { ChangePasswordController } from '../ChangePassword/ChangePasswordController';

export class NavHeaderDropDownController {
  constructor() {
    this.ref = { id: 'header' };
    this.tenantController = new TenantController(this.tenantEventListener);
    this.changePasswordController = new ChangePasswordController();
    this.profileOptions = [
      {
        type: 'plain_item',
        title: 'Order History',
        action: redirectToOrderHistory,
      },
      {
        type: 'plain_item',
        title: 'Invite Users',
        action: redirectToInviteUsers,
      },
      {
        type: 'plain_item',
        title: 'Change Password',
        action: this.changePasswordEventListener,
      },
      { type: 'plain_item', title: 'Logout', action: logout },
    ];
  }

  getController = header => {
    switch (header.uid) {
      case '#tenant':
        return this.tenantController;
      default:
        return this;
    }
  };

  registerEventListener = eventListener => {
    this.eventListener = eventListener;
  };

  getExistingData = header => {};

  onUpdate = (header, value) => {};

  getOptionalInfo = (header, callback) => {};

  getDropDownTitle = (header, selectedOption) => {};

  tenantEventListener = (eventType, args) => {
    this.eventListener && this.eventListener(eventType, args);
  };

  changePasswordEventListener = () => {
    this.eventListener(CHANGE_PASSWORD_MODAL, this.changePasswordController);
  };
}
