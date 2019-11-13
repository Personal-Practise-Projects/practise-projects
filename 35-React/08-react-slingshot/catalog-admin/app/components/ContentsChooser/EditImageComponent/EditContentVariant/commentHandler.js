import BaseCommentHandler from "../../../../common/comments/BaseCommentHandler";
import { COMMENT_TYPES } from "../../../../common/comments/constants";
import { createContent } from "../../actions/shotEditedContentActions";
import { STATUS_DONE } from "../../../../actions/types";
import { ProducersList } from "../../../../actions/search/commonSearchActions";
import UrlBuilder from "../../../../common/urlBuilder";

export default class EditVersionCommentHandler extends BaseCommentHandler {
  constructor(ref, callback) {
    const urlBuilder = new UrlBuilder('/comments/{refId}/')
      .addPathParam('refId', ref.id)
      .addQueryParam('order_by', 'added_on')
      .addQueryParam('comments', [COMMENT_TYPES.EDITED_CONTENT,COMMENT_TYPES.CONTENTS]);
    super(ref, COMMENT_TYPES.EDITED_CONTENT, urlBuilder);

    this.commentButtonTitle = 'Comment';
    // this.taggedUserAPI = ProducersList;
    this.updateParentComponent = callback;
  }

  getData(callback) {
    this.commentObserver = callback;
    this.fetchComments(this.ref.extraConfig.versionId, this.setComments);
  }

  createData(commentData, callback) {
    if (this.ref.extraConfig.versionId) {
      this.createComment(this.ref.extraConfig.versionId, commentData, (result) => {
        callback(result);
        this.updateParentComponent();
      });
    } else {
      this.addVersionAndComment(commentData, (result) => {
        callback(result);
        this.updateParentComponent();
      });
    }
  }

  updateComments = comment => {
    this.comments.push(comment);
    if (this.commentHistoryObserver) this.commentHistoryObserver(this.comments);
    this.commentObserver && this.commentObserver();
  };

  addVersionAndComment(commentData, callback) {
    createContent(this.ref, {data: '{}'},(status, content) => {
      if (status === STATUS_DONE) {
        Object.assign(this.ref, content);
        this.createComment(this.ref.extraConfig.versionId, commentData, callback);
      }
    });
  }
}
