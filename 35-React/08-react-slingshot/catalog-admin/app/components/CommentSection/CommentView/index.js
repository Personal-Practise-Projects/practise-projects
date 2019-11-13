import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './CommentView.scss';
import parse from 'html-react-parser';
import { parseStringToHtml } from '../../../helpers/common';
import Img from '../../Img';

export default class CommentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  toggleComment = () => {
    if (this.props.isExpandable) {
      this.setState({ open: !this.state.open });
    }
  };

  render() {
    const { comment } = this.props;
    const commentBody = parse(parseStringToHtml(comment.message));
    return (
      <div
        className={classNames('comment', {
          'comment-expanded': this.state.open,
          'accordion-view': this.props.isExpandable,
        })}
      >
        <div
          className="comment-header d-flex align-items-center"
          onClick={this.toggleComment}
          role="button"
          tabIndex={0}
        >
          <div
            className={`comment-header-left d-flex ${
              this.state.open ? 'align-items-start' : 'align-items-center'
            }`}
          >
            {this.props.isExpandable && (
              <i
                className={
                  this.state.open ? 'icon-caret-up' : 'icon-caret-down'
                }
              />
            )}
            <Img className="profile-logo" src={comment.commentedByImage} />
            <div className="flex-wrapper d-flex align-items-end">
              <div className="profile-name">{comment.commentedByName}</div>
              <div className="profile-date" title={comment.addedOnHover}>
                {comment.addedOn}
              </div>
            </div>
          </div>
          <div className="comment-header-right">
            {/* Space reserved for Edit & Delete dropdown */}
          </div>
        </div>
        <div className="comment-body">{commentBody}</div>
      </div>
    );
  }
}

CommentView.defaultProps = {
  isExpandable: true,
};

CommentView.propTypes = {
  isExpandable: PropTypes.bool,
  comment: PropTypes.object,
};
