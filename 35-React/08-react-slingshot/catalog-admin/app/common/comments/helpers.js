import AxiosBuilder from '../axiosBuilder';
import { formatDateToString, getDateTimeInLocalTimeZone, } from '../../helpers/common';
import { COMMENT, DATE_FORMAT, DATE_TIME_FORMAT, DATE_TIME_12H_FORMAT, TIME_12H_FORMAT } from '../constants';
import personPlaceholder from "../../images/common/default_profile_thumbnail.svg";

export function getCommentsData(urlBuilder, callback) {
  let parsedData = [];
  new AxiosBuilder(urlBuilder.buildUrl())
  .withAuth()
  .fetch()
  .then(response => {
    if (response.data) {
      parsedData = response.data.map(comment => parseComment(comment));
    }
    callback(parsedData);
  });
}

export function addComment(referenceType, refId, comment, callback) {
  let parsedData = {};
  const config = {
    data: JSON.stringify(comment),
  };
  new AxiosBuilder(`${COMMENT}${referenceType}/${refId}/`, config)
  .withAuth()
  .POST()
  .then(response => {
    if (response.status === 201 && response.data) {
      parsedData = parseComment(response.data);
    }
    callback(parsedData);
  });
}

export function parseComment(comment) {
  return {
    id: comment.id,
    message: comment.message,
    reference: comment.reference,
    commentedBy: comment.commented_by,
    commentedByName: comment.commented_by.name || 'Anonymous',
    commentedByImage: (
      comment.commented_by.profile_picture_thumbnail &&
      comment.commented_by.profile_picture_thumbnail.medium
    ) || personPlaceholder,
    addedOn: formatDateToString(
      getDateTimeInLocalTimeZone(comment.added_on * 1000),
      DATE_FORMAT,
    ),
    addedOnHover: formatDateToString(
      getDateTimeInLocalTimeZone(comment.added_on * 1000),
      DATE_TIME_FORMAT,
    ),
    addedOn12HFormat: formatDateToString(
      getDateTimeInLocalTimeZone(comment.added_on * 1000),
      DATE_TIME_12H_FORMAT,
    ),
    addedOnTime: formatDateToString(
      getDateTimeInLocalTimeZone(comment.added_on * 1000),
      TIME_12H_FORMAT
    ),
  };
}
