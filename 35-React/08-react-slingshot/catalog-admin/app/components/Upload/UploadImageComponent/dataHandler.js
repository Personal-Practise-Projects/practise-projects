import { CANCELED, DONE } from '../../../common/constants';
import { FILE_UPLOAD_EVENT } from "../../Upload/constants";

/**
 * Upload file handle will be responsible for managing upload state for a file
 * It need upload end point where file need to be uploaded and progress will broadcast for the file event
 *
 */
export default class UploadFileController {
  constructor(file, refId, pickerType, uploadEndPoint, onUploadDone = null) {
    if (!file) {
      throw new Error('File is mandatory to create Handler reference');
    }
    this.statusCallbacks = {};
    this.uid = file.uid;
    this.file = file;
    this.refId = refId;
    this.pickerType = pickerType;
    this.uploadEndPoint = uploadEndPoint;
    this.onUploadDone = onUploadDone;
  }

  /**
   * Data handler will keep reference of file object and soon as this function is called it check if
   * uploadEndPoint is available it start the upload for the file for the provided if
   */
  startUpload = () => {
    this.uploadEndPoint && this.uploadEndPoint(
      this.file,
      this.refId,
      this.pickerType,
      this.onUploadProgress,
    );
    return this;
  };

  /**
   * Cancel file upload for the provided file
   */
  cancelUpload = () => {
    if ([CANCELED, DONE].indexOf(this.file.status) === -1) {
      this.file.cancelToken && this.file.cancelToken();
      this.file.status = CANCELED;
    }
    this.__broadcastEvent(FILE_UPLOAD_EVENT.CANCEL);
  };

  registerCallbackListener = (callbackId, statusCallback) => {
    if (statusCallback) {
      this.statusCallbacks[callbackId] = statusCallback;
    }
  };

  unRegisterCallbackListener = (callbackId) => {
    if (callbackId) {
      this.statusCallbacks[callbackId] = null;
    } else {
      this.statusCallbacks = {};
    }
  };

  onUploadProgress = progress => {
    Object.assign(this.file, { progress });
    //If file progress is reached to 100% then check if after UploadDone is need to call or not
    // if not then broadcast the event else call the callback ref and wait for file upload final step to complete
    if (progress >= 100 && this.onUploadDone) {
      this.onUploadDone(this, () => {
        this.__broadcastEvent(FILE_UPLOAD_EVENT.DONE);
      });
    } else {
      this.__broadcastEvent(FILE_UPLOAD_EVENT.IN_PROGRESS);
    }
  };

  __broadcastEvent = (event) => {
    Object.keys(this.statusCallbacks).forEach(key => {
      this.statusCallbacks[key] && this.statusCallbacks[key](event, this);
    });
  };

}
