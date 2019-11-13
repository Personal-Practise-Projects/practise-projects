import AxiosBuilder from '../../common/axiosBuilder';
import { MARKUP_COMMENT } from '../../common/constants';
import { parseComment } from '../../common/comments/helpers';

export function getMarkUpData(referenceType, refId, callback) {
  let parsedData = [];
  new AxiosBuilder(`${MARKUP_COMMENT}${referenceType}/${refId}/`)
    .withAuth()
    .fetch()
    .then(response => {
      if (response.data) {
        parsedData = response.data.map(markUp => {
          markUp.comments = markUp.comments.map(comment =>
            parseComment(comment),
          );
          return markUp;
        });
      }
      callback(parsedData);
    });
}

export function addMarkUpData(referenceType, refId, markUpData, callback) {
  const config = {
    data: JSON.stringify(markUpData),
  };
  new AxiosBuilder(`${MARKUP_COMMENT}${referenceType}/${refId}/`, config)
    .withAuth()
    .POST()
    .then(response => {
      callback(response);
    });
}
