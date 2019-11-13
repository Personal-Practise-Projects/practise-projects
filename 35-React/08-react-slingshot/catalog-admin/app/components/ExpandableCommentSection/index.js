import React from 'react';
import { connect } from 'react-redux';

import AddComment from '../CommentSection/AddComment';
import CommentView from './CommentView';
import EditVersionCommentHandler from '../ContentsChooser/EditImageComponent/EditContentVariant/commentHandler';
import { ADD_COMMENTS_VIEW } from '../CommentSection/AddComment/constants';
import { buildConditionalString } from '../../common/helpers';
import { setEditedVersionId } from './actions';

import styles from './ExpandableCommentSection.scss';

class ExpandableCommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalCommentsArray: [],
      isExpanded: false,
    };

    this.commentHandler = new EditVersionCommentHandler(
      this.props.editedImage,
      this.props.updateParentComponent,
    );

    this.endOfCommentsID = this.props.editedImage.uid;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let isExpanded =
      nextProps.editedImage.extraConfig.versionUid ===
      nextProps.currentExpandedVersionId;
    if (prevState.isExpanded !== isExpanded) {
      return {
        isExpanded: isExpanded,
      };
    }
    return {};
  }

  render() {
    const { isExpanded } = this.state;
    const noComments = this.__getModifiedCommentsArray().length
      ? ''
      : 'no-comments';
    const expandedClass = isExpanded ? 'expanded' : '';
    return (
      <div
        id={this.props.editedImage.id}
        className={`content-comment-component ${noComments} ${expandedClass}`}
        style={styles}
      >
        {this.__getCommentsView()}
      </div>
    );
  }

  componentDidMount() {
    if (this.props.editedImage.extraConfig.versionId) {
      this.commentHandler.getData(() => {
        this.__getComments();
      });
    }
  }

  __getComments = () => {
    this.commentHandler.getComments(comments => {
      this.setState({
        originalCommentsArray: comments,
      });
    });
  };

  __toggleView = () => {
    this.props.setEditedVersionId(
      this.props.editedImage.extraConfig.versionUid !==
      this.props.currentExpandedVersionId
        ? this.props.editedImage.extraConfig.versionUid
        : null,
    );
  };

  scrollToEnd = () => {
    // scrolls to div with id endOfCommentsID
    const target = document.getElementById(this.endOfCommentsID);
    window.setTimeout(() => target.scrollIntoView({ block: 'nearest' }), 0);
    this.scrollIntoBox();
  };

  scrollIntoBox = () => {
    // scrolls the comment box into view
    const target = document.getElementById(this.props.editedImage.id);
    window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  __getCommentsView = () => {
    const { originalCommentsArray, isExpanded } = this.state;
    return (
      <React.Fragment>
        {this.__getCommentsList()}
        {isExpanded && this.scrollToEnd()}
        <div className="add-comment-wrapper">
          {originalCommentsArray.length !== 0 && (
            <i
              className={buildConditionalString(
                'icon',
                'icon-chevron-double-up',
                isExpanded,
                originalCommentsArray.length > 2 && 'icon-chevron-double-down',
              )}
              onClick={() => {
                this.__toggleView();
                this.scrollIntoBox();
              }}
            />
          )}
          {!isExpanded &&
            originalCommentsArray.length > 0 && (
              <div
                className="comment-btn"
                onClick={() => {
                  this.__toggleView();
                  this.scrollIntoBox();
                }}
              >
                Comment
              </div>
          )}
          {(originalCommentsArray.length === 0 || isExpanded) && (
            <AddComment
              dataHandler={this.commentHandler}
              view={ADD_COMMENTS_VIEW.OPEN}
              autoFocus={isExpanded}
            />
          )}
        </div>
      </React.Fragment>
    );
  };

  __getCommentsList() {
    const comments = this.__getModifiedCommentsArray();
    return (
      <div className="comment-list-wrapper">
        {comments &&
          comments.map(comment => (
            <CommentView
              key={comment.id}
              comment={comment}
              className={this.__addBackGround(comment)}
              commentsArrayLength={this.state.originalCommentsArray.length}
              toggleCommentView={() => {
                this.props.setEditedVersionId(
                  this.props.editedImage.extraConfig.versionUid,
                );
              }}
              isExpanded={this.state.isExpanded}
            />
          ))}
        <div id={this.endOfCommentsID} />
      </div>
    );
  }

  __addBackGround(comment) {
    return comment.reference === 'MARKUP' ? 'markup-comment' : '';
  }

  __getModifiedCommentsArray() {
    const { originalCommentsArray, isExpanded } = this.state;
    const commentsLength = originalCommentsArray.length;
    return commentsLength <= 2
      ? originalCommentsArray
      : isExpanded
        ? originalCommentsArray
        : originalCommentsArray.slice(commentsLength - 2, commentsLength);
  }
}

const mapStateToProps = state => ({
  currentExpandedVersionId:
    state.expandableCommentSection.currentExpandedVersionId,
});

const mapDispatchToProps = {
  setEditedVersionId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpandableCommentSection);
