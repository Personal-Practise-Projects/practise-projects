import BaseCommentHandler from '../../../common/comments/BaseCommentHandler';
import { COMMENT_TYPES } from '../../../common/comments/constants';
import { addMarkUpData } from '../service';
import { getResponsiveXYCoordinates } from '../../../helpers/common';
import UrlBuilder from "../../../common/urlBuilder";

export default class MarkUpCommentHandler extends BaseCommentHandler {
  constructor(ref, eventListener) {
    const urlBuilder = new UrlBuilder('/comments/{referenceType}/{refId}/')
      .addPathParam('referenceType', COMMENT_TYPES.MARKUP)
      .addPathParam('refId', ref.id);
    super(ref, COMMENT_TYPES.MARKUP, urlBuilder);
    this.eventListener = eventListener;
  }

  setMarkUpComments = comments => {
    this.setComments(comments);
  };

  createData(commentData, callback) {
    if (!this.ref.markUps[this.ref.selectedMarkUpIndex].id) {
      this.addMarkUpAndComment(commentData, callback);
    } else {
      this.addComment(commentData, callback);
    }
  }

  addMarkUpAndComment(comment, callback) {
    const selectedMarkUp = this.ref.markUps[this.ref.selectedMarkUpIndex];
    const coordinates = getResponsiveXYCoordinates(
      selectedMarkUp,
      this.ref.markUpSectionRef.current,
      this.ref.ref,
    );
    const markUpData = {
      x: coordinates.coordinate_x,
      y: coordinates.coordinate_y,
    };
    addMarkUpData(
      this.ref.referenceType,
      this.ref.markUpRefId,
      markUpData,
      result => {
        this.ref.markUps[this.ref.selectedMarkUpIndex].id = result.data.id;
        this.addComment(comment, callback);
      },
    );
  }

  addComment(comment, callback) {
    this.createComment(
      this.ref.markUps[this.ref.selectedMarkUpIndex].id,
      comment,
      callback,
      this.onAddCommentSuccess,
    );
  }

  onAddCommentSuccess = result => {
    this.ref.markUps[this.ref.selectedMarkUpIndex].comments.push(result);
    this.setMarkUpComments(
      this.ref.markUps[this.ref.selectedMarkUpIndex].comments,
    );
    this.eventListener({ type: COMMENT_TYPES.MARKUP, data: this.ref.markUps });
  };
}
