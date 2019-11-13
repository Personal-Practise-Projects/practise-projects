import React from 'react';

import Button from '../../Button';
import Comment from '../Comment';
import { ADD_COMMENTS_VIEW } from './constants';

import styles from './AddComment.scss';

export default class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isDisabled: false,
      addComments: false,
      staffUsers: [],
      isFocus: false,
      commentVersion: 1,
    };
  }

  setStaffUsers = data => {
    this.setState({
      staffUsers: data,
    });
  };

  onAddCommentsClick = () => {
    this.setState({
      addComments: true,
    });
  };

  setMessage = message => {
    this.setState({
      message,
    });
  };

  createCommentObject = () => {
    const { currentUser } = this.props.dataHandler;
    return {
      commented_by: currentUser.id,
      message: this.state.message,
    };
  };

  render() {
    return this.__getAddCommentView(this.props.view);
  }

  componentDidMount() {
    this.props.dataHandler.getTaggableUsers(this.setStaffUsers);
  }

  __getAddCommentClosedView(viewType) {
    const { addComments } = this.state;
    return (
      <div className="comment-area" style={styles}>
        {addComments ? (
          this.__getAddCommentOpenView(viewType)
        ) : (
          <Button
            className="primary-cta comment-area-cta"
            onClick={this.onAddCommentsClick}
            displayElement={
              this.props.dataHandler.commentButtonTitle || 'Add a comment'
            }
          />
        )}
      </div>
    );
  }

  __getAddCommentOpenView(viewType) {
    const { message, staffUsers, isDisabled, isFocus } = this.state;
    return (
      <div className="add-comment">
        <Comment
          key={this.state.commentVersion}
          users={staffUsers}
          placeholder="Write your comments here"
          updateData={this.setMessage}
          onFocus={this.__onFocus}
          onBlur={this.__onBlur}
          autoFocus={this.props.autoFocus}
        />
        {(isFocus || message) && (
          <div className="add-comment-actions d-flex align-items-center justify-content-start">
            <Button
              className="primary-cta"
              isDisabled={!message || isDisabled}
              onClick={this.__addComment}
              displayElement="Save"
            />
            <Button
              className="secondary-cta"
              onClick={this.__cancelComment}
              displayElement="Cancel"
            />
          </div>
        )}
      </div>
    );
  }

  __getAddCommentView(viewType) {
    switch (viewType) {
      case ADD_COMMENTS_VIEW.OPEN:
        return this.__getAddCommentOpenView(viewType);
      default:
        return this.__getAddCommentClosedView(viewType);
    }
  }

  __onFocus = () => {
    this.setState({
      isFocus: true,
    });
  };

  __onBlur = () => {
    this.setState({
      isFocus: false,
    });
  };

  __addComment = () => {
    this.setState({
      isDisabled: true,
    });
    const comment = this.createCommentObject();
    this.props.dataHandler.createData(comment, this.__cancelComment);
  };

  __cancelComment = result => {
    if (result) {
      this.setState({
        addComments: false,
        message: null,
        isDisabled: false,
        commentVersion: ++this.state.commentVersion,
      });
    } else
      this.setState({
        isDisabled: false,
      });
  };
}
