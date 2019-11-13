import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgressbar } from 'react-circular-progressbar';

import Img from '../../Img';
import { FAILED, UPLOADING } from '../../../common/constants';
import { StringHelper } from "../../../helpers/utils";
// Import Static Assets
import 'react-circular-progressbar/dist/styles.css';
import { FILE_UPLOAD_EVENT } from "../../Upload/constants";

const CALLBACK_ID = 'uploadImageComponent';

export default class UploadImageComponent extends React.Component {
  componentDidMount() {
    this.props.controller.registerCallbackListener(
      CALLBACK_ID,
      this.onStatusCallbackListener,
    );
  }

  componentWillUnmount() {
    this.props.controller.unRegisterCallbackListener(CALLBACK_ID,);
  }

  render() {
    const element = this.elementOverThumbnailFromStatus();
    return (
      <div className="content-card d-inline-block position-relative">
        <Img
          src={this.props.controller.file.preview}
          alt="Uploading image"
          className="content-card-thumbnail img-fluid"
        />
        <button
          className="content-card-cancel"
          onClick={this.props.controller.cancelUpload}
        >
          <i className="icon-cross"/>
        </button>
        {element}
      </div>
    );
  }

  elementOverThumbnailFromStatus() {
    const keyId = `cpb${this.props.controller.file.key}`;
    const status = this.props.controller.file.status;
    /**
     * Method evaluate type of element should show with image thumb based on status
     */
    let element = <div key={keyId} />;
    if (status === FAILED) {
      element = (
        <div
          id={keyId}
          key={keyId}
          className="warning d-flex align-items-center justify-content-center"
        >
          <div className="flex-wrapper text-center">
            <span className="warning-icon d-block" />
            <span className="warning-message d-block">
              Unable to upload photo
            </span>
            <button
              className="warning-action secondary-cta"
              onClick={this.props.controller.startUpload}
            >
              Try again
            </button>
          </div>
        </div>
      );
    } else if (status === UPLOADING) {
      element = (
        <div
          id={keyId}
          key={keyId}
          className="circular-progress d-flex align-items-center justify-content-center
                     position-absolute"
        >
          <CircularProgressbar
            minValue={0}
            maxValue={100}
            value={this.props.controller.file.progress || 0}
            text={StringHelper.format('##%', this.props.controller.file.progress || 0)}
          />
        </div>
      );
    }
    return element;
  }

  onStatusCallbackListener = (eventType, fileController) => {
    switch (eventType) {
      case FILE_UPLOAD_EVENT.DONE:
      case FILE_UPLOAD_EVENT.IN_PROGRESS:
        this.setState({ uploadProgress: fileController.file.progress });
        break;
      case FILE_UPLOAD_EVENT.CANCEL:
        if (this.props.onCanceled) {
          this.props.onCanceled(this.props.controller);
        }
        break;
    }
  };
}

UploadImageComponent.propTypes = {
  controller: PropTypes.object.isRequired,
  onCanceled: PropTypes.func,
};
