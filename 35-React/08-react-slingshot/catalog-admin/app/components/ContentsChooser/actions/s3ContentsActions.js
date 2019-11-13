import React from 'react';
import { S3_RAW_CONTENTS } from '../../../common/constants';
import { generateUniqueId } from '../../../helpers/common';
import AxiosBuilder from '../../../common/axiosBuilder';
import { CALLBACK_EVENTS } from '../DataHandler/base';

export function getS3RawContents(callback) {
  return new AxiosBuilder(S3_RAW_CONTENTS)
    .withAuth()
    .fetch()
    .then(result => {
      callback(CALLBACK_EVENTS.DATA_RECEIVED, dataParser(result.data));
    })
    .catch(err => {
      callback(CALLBACK_EVENTS.DATA_FAILED, err);
    });
}

function dataParser(s3ContentData) {
  s3ContentData.files = s3ContentData.payload.map(file => ({
    selected: false,
    displayName: truncateFileName(file.file_key.match(/([^\/]+)(?=\.\w+$)/)[0]),
    titleName: file.file_key.match(/([^\/]+)(?=\.\w+$)/)[0],
    fileKey: file.file_key,
    thumbUrl: file.thumb_url,
    key: generateUniqueId(),
  }));
  delete s3ContentData.payload;
  return s3ContentData;
}

function truncateFileName(fileName) {
  if (fileName.length > 20) {
    return `...${fileName.slice(-20)}`;
  }
  return fileName;
}
