import { StaffUsersList } from '../../actions/search/commonSearchActions';
import { addComment, getCommentsData } from './helpers';

export default class BaseCommentHandler {
  constructor(ref, refType, getUrlBuilder) {
    this.ref = ref;
    this.getUrlBuilder = getUrlBuilder;
    this.referenceType = refType;
    this.taggedUserAPI = StaffUsersList;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.comments = [];
    this.commentHistoryObserver = null;
    this.commentObserver = null;
  }

  setData(ref) {
    this.ref = ref;
    this.comments = [];
    this.commentHistoryObserver = null;
    this.commentObserver = null;
  }

  getTaggableUsers(callback) {
    this.taggedUserAPI().search('', [], (searchString, data) => {
      const parsedData = [];
      data.map(user => {
        parsedData.push({
          id: user.id,
          name: user.name,
          thumbnail: user.thumbnail,
        });
      });

      callback(parsedData);
    });
  }

  setComments = comments => {
    this.comments = comments;
    // TODO not a right way to register a commentObserver need to revisit this
    this.commentObserver && this.commentObserver();
  };

  getComments = callback => {
    this.commentHistoryObserver = callback;
    callback(this.comments);
  };

  updateComments = comment => {
    this.comments.unshift(comment);
    if (this.commentHistoryObserver) this.commentHistoryObserver(this.comments);
    this.commentObserver && this.commentObserver();
  };

  fetchComments = (refId, callback) => {
    getCommentsData(this.getUrlBuilder, callback);
  };

  createComment = (
    refId,
    data,
    callback,
    updateCallback = this.updateComments,
  ) => {
    addComment(this.referenceType, refId, data, result => {
      callback(result);
      updateCallback(result);
    });
  };
}
