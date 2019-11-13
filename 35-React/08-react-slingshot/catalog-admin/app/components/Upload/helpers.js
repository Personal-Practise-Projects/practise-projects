import { DONE, UPLOADING, WAITING } from '../../common/constants';
import { StringHelper } from "../../helpers/utils";

export function getRemainingFileCount(queue) {
  const waitingCount = queue.filter(
    uploadFileHandler => uploadFileHandler.file.status === WAITING ||
      uploadFileHandler.file.status === UPLOADING,
  ).length;
  return waitingCount ? `${waitingCount}/${queue.length}` : '';
}

export const uploadedFilesCount = function(queue) {
  return (
    queue.filter(uploadFileHandler => uploadFileHandler.file.status === DONE)
      .length || 0
  );
};

export function getUploadedQueueHeaderMessage(queue) {
  const filesCount = uploadedFilesCount(queue);
  if (filesCount <= 0) {
    return StringHelper.format('## Item(s) pending', queue.length);
  } else if (filesCount === queue.length) {
    return StringHelper.format('## Item(s) uploaded', filesCount);
  }
  return StringHelper.format('##/## Item(s) uploaded', filesCount, queue.length);
}
