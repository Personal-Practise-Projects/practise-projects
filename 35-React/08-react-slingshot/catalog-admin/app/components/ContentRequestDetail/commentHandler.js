import BaseCommentHandler from '../../common/comments/BaseCommentHandler';
import { COMMENT_TYPES } from '../../common/comments/constants';
import UrlBuilder from "../../common/urlBuilder";

export default class CRCommentHandler extends BaseCommentHandler {
  constructor(ref) {
    const urlBuilder = new UrlBuilder('/comments/{referenceType}/{refId}/')
      .addPathParam('referenceType', COMMENT_TYPES.CONTENT_REQUEST)
      .addPathParam('refId', ref.id);
    super(ref, COMMENT_TYPES.CONTENT_REQUEST,urlBuilder);
  }

  getData(callback) {
    this.commentObserver = callback;
    this.fetchComments(this.ref.id, this.setComments);
  }

  createData(commentData, callback) {
    this.createComment(this.ref.id, commentData, callback);
  }
}
