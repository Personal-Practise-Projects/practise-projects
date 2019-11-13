import { getMarkUpData } from '../service';
import MarkUpCommentHandler from '../CommentListView/dataHandler';
import {
  getResponsiveXYCoordinatesToRender,
  getXYCoordinates,
} from '../../../helpers/common';
import { COMMENT_TYPES } from '../../../common/comments/constants';

export default class MarkUpHandler {
  constructor(ref, referenceType) {
    this.ref = ref;
    this.markUpRefId = ref.contentId;
    this.referenceType = referenceType;
    this.markUps = [];
    this.tooltip = {
      left: 0,
      top: 0,
    };
  }

  setEventListener(eventListener) {
    this.eventListener = eventListener;
    this.commentHandler = new MarkUpCommentHandler(this, this.eventListener);
  }

  setData(markUpSectionRef, lightBoxImage) {
    this.markUpSectionRef = markUpSectionRef;
    this.ref.imageWidth = lightBoxImage.width;
    this.ref.imageHeight = lightBoxImage.height;
  }

  resetData() {
    this.eventListener = null;
    this.markUpSectionRef = null;
  }

  setSelectedMarkUpIndex(index) {
    this.selectedMarkUpIndex = index;
    this.commentHandler.setMarkUpComments(
      this.markUps[this.selectedMarkUpIndex] &&
        this.markUps[this.selectedMarkUpIndex].comments,
    );
  }

  getMarkUps(callback) {
    getMarkUpData(this.referenceType, this.markUpRefId, data => {
      const rect = this.markUpSectionRef.current.getBoundingClientRect();
      data.forEach(markUp => {
        const coordinates = getResponsiveXYCoordinatesToRender(
          markUp,
          rect,
          this.ref,
        );
        markUp.coordinate_x = coordinates.coordinate_x;
        markUp.coordinate_y = coordinates.coordinate_y;
      });

      this.markUps = data;
      callback();
    });
  }

  onAddMarkUp(event, reference) {
    const coordinateValue = getXYCoordinates(event, reference.current);
    const markUp = {
      coordinate_x: coordinateValue.x,
      coordinate_y: coordinateValue.y,
      comments: [],
    };
    let index = this.markUps.length ? this.markUps.length - 1 : 0;
    const prevComment = this.markUps[index];
    if (!prevComment || prevComment.comments.length) {
      index = prevComment ? index + 1 : index;
      this.markUps.push(markUp);
    } else {
      prevComment.coordinate_x = coordinateValue.x;
      prevComment.coordinate_y = coordinateValue.y;
    }
    this.setSelectedMarkUpIndex(index);
    this.eventListener({ type: COMMENT_TYPES.MARKUP, data: this.markUps });
  }
}
