import axios from 'axios';
import { STATUS_DONE, STATUS_FAILED } from '../../../actions/types';
import { buildShotS3GenerateSignedUrlPath, DONE, FAILED, SHOT_CONTENTS, UPLOADING, } from '../../../common/constants';
import AxiosBuilder from '../../../common/axiosBuilder';
import { editedContentDataParser } from '../common/editedContentDataParser';
import { getFileOptions } from "./common";

export function uploadReferenceImage(
  file,
  refId,
  pickerType,
  progressListener,
) {
  const apiPath = buildShotS3GenerateSignedUrlPath(
    refId,
    file.localFile.name,
    pickerType,
  );
  return new AxiosBuilder(apiPath)
    .withAuth()
    .fetch()
    .then(result => {
      const signedUrl = result.data.url;
      const options = getFileOptions(file, progressListener);
      Object.assign(file, {
        status: UPLOADING,
        serverKey: result.data.file_key,
        serverUrl: result.data.file_url,
        thumbUrl: result.data.thumb_url,
      });
      return axios.put(signedUrl, file.localFile, options);
    })
    .then(() => {
      if (file.status === UPLOADING) {
        Object.assign(file, {
          status: DONE,
        });
        progressListener(100);
      }
    })
    .catch(() => {
      Object.assign(file, {
        status: FAILED,
      });
      progressListener(0);
    });
}

export function uploadRecentContent(file, refId, pickerType, progressListener) {
  generateS3SignedUrl(
    file,
    refId,
    file.localFile.name,
    pickerType,
    (status, result) => {
      if (status === DONE) {
        const signedUrl = result.data.url;
        // Get s3 upload file options
        const options = getFileOptions(file, progressListener);
        // Update object state on upload started
        Object.assign(file, {
          status: UPLOADING,
          serverKey: result.data.file_key,
          serverUrl: result.data.file_url,
          thumbUrl: result.data.thumb_url,
        });
        // Make s3 upload multipart call
        axios
          .put(signedUrl, file.localFile, options)
          .then(() => {
            progressListener && progressListener(100);
          })
          .catch(() => {
            Object.assign(file, {
              status: FAILED,
            });
            progressListener && progressListener(0);
          });
      } else {
        progressListener && progressListener(0);
      }
    },
  );
}

function generateS3SignedUrl(file, refId, fileName, fileType, callbackRef) {
  return new AxiosBuilder(
    buildShotS3GenerateSignedUrlPath(refId, fileName, fileType),
  )
    .withDefaultAuth()
    .fetch()
    .then(result => callbackRef && callbackRef(DONE, result))
    .catch(() => {
      Object.assign(file, {
        status: FAILED,
      });
      callbackRef && callbackRef(FAILED, 0);
    });
}

export function mapShotContentFile(refId, mappedImages, listener) {
  const config = {
    data: JSON.stringify({
      mapped_images: mappedImages,
    }),
  };
  new AxiosBuilder(`${SHOT_CONTENTS}${parseInt(refId, 10)}/`, config)
    .withDefaultAuth()
    .POST()
    .then(result => {
      listener(STATUS_DONE, editedContentDataParser(result.data));
    })
    .catch(err => {
      listener(STATUS_FAILED, err);
    });
}

