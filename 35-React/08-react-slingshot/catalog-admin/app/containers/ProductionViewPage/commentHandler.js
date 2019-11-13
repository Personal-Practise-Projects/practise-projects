import ShotCommentHandler from '../../components/ShotDetailsView/controller/commentHandler';

export default class ProductionViewCommentHandler extends ShotCommentHandler {
  constructor(ref) {
    super(ref);
    this.isExpandable = false;
  }

  setComments = comments => {
    this.comments = comments;
    if (this.commentObserver) {
      this.commentObserver(comments);
    }
  };
}
