import React from "react";
import { toast } from 'react-toastify';

import ChangePassword from './index'
import { CHANGE_PASSWORD, } from '../../common/constants';
import { resetPassword } from '../../common/handler';

const newConfirmPassword = 'New password and Confirm password should be same';
const oldNewPassword = 'Old password and new password should be different';

export class ChangePasswordController {
  constructor() {
    this.headers = [
      {
        title: 'Old password',
        type: 'password',
        uid: '#oldPassword',
        placeholder: '●●●●●●●●',
        showPassword: false,
      },
      {
        title: 'New password',
        type: 'password',
        uid: '#newPassword',
        placeholder: '●●●●●●●●',
        showPassword: true,
      },
      {
        title: 'Confirm password',
        type: 'password',
        uid: '#confirmPassword',
        placeholder: '●●●●●●●●',
        showPassword: false,
      },
    ];
  }

  setEventListener = (toggleConfirmDialog) => {
    this.toggleConfirmDialog = toggleConfirmDialog;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.message = '';
  };


  stateEventListener = (dialogStateChangeCallbackFn) => {
    this.dialogStateChangeCallbackFn = dialogStateChangeCallbackFn;
  };

  getExistingData = header => {};

  onUpdate = (header, value) => {
    switch (header.uid) {
      case '#oldPassword':
        this.oldPassword = value;
        break;
      case '#newPassword':
        this.newPassword = value;
        break;
      case '#confirmPassword':
        this.confirmPassword = value;
        break;
    }
    this.dialogStateChangeCallbackFn && this.dialogStateChangeCallbackFn({});
  };

  getFooterConfig = () => {
    return [
      {
        title: 'Reset',
        isDisabled: !this.oldPassword || !this.newPassword,
        actionType: CHANGE_PASSWORD
      },
    ];
  };

  getChildren() {
    return <ChangePassword key={1} controller={this}/>
  }

  getHeader = () => {
    return this.headers;
  };

  eventListener = () => {
    if (this.newPassword !== this.confirmPassword) {
      this.message = newConfirmPassword;
      toast.error(this.message);
    } else if (this.newPassword === this.oldPassword) {
      this.message = oldNewPassword;
      toast.error(this.message);
    } else {
      const data = {
        old_password: this.oldPassword,
        new_password: this.newPassword,
      };
      const config = {
        data: JSON.stringify(data),
      };
      resetPassword(config, this.successCallback, this.errorCallback);
    }
  };

  successCallback = message => {
    toast.success(message);
    this.toggleConfirmDialog();
  };
  errorCallback = message => {
    toast.error(message);
  };
}
