import BaseCommentHandler from '../../../common/comments/BaseCommentHandler';
import { COMMENT_TYPES } from '../../../common/comments/constants';
import UrlBuilder from '../../../common/urlBuilder';

export default class ShotCommentHandler extends BaseCommentHandler {
  constructor(ref) {
    const getUrlBuilder = new UrlBuilder('/comments/{referenceType}/{refId}/')
      .addPathParam('referenceType', COMMENT_TYPES.SHOT)
      .addPathParam('refId', ref.shot_info.id);
    super(ref, COMMENT_TYPES.SHOT, getUrlBuilder);
  }

  getData(callback) {
    this.commentObserver = callback;
    this.fetchComments(this.ref.shot_info.id, this.setComments);
  }

  createData(commentData, callback) {
    this.createComment(this.ref.shot_info.id, commentData, callback);
  }
}
