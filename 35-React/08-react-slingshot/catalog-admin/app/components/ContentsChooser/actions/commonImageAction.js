import axios from 'axios';
import { FAILED, S3_GENERATE_SIGNED_URL_IMAGE_COMMON, UPLOADING, } from '../../../common/constants';
import AxiosBuilder from '../../../common/axiosBuilder';
import { getFileOptions } from "./common";


export function uploadEndpoint(dataParser = __defaultDataParser) {
  return new CommonHandler(dataParser || __defaultDataParser).upload
}

class CommonHandler {
  constructor(dataParser) {
    this.dataParser = dataParser;
  }

  upload = (file, refId, pickerType, progressListener) => {
    const apiPath = S3_GENERATE_SIGNED_URL_IMAGE_COMMON(
      file.localFile.name,
      refId,
      pickerType,
    );
    return new AxiosBuilder(apiPath)
      .withAuth()
      .fetch()
      .then(result => {
        const signedUrl = result.data.url;
        const options = getFileOptions(file, progressListener);
        this.dataParser(file, result.data);
        return axios.put(signedUrl, file.localFile, options);
      })
      .then(() => {
        progressListener && progressListener(100);
      })
      .catch(err => {
        Object.assign(file, {
          status: FAILED,
        });
        progressListener(0);
      });
  };
}


function __defaultDataParser(file, data) {
  Object.assign(file, {
    status: UPLOADING,
    serverKey: data.file_key,
    serverUrl: data.file_url,
    thumbUrl: data.thumb_url,
  });
  return file
}
