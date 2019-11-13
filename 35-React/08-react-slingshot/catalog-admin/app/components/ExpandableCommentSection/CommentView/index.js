import React from 'react';
import parse from 'html-react-parser';

import Img from '../../Img';
import { parseStringToHtml } from '../../../helpers/common';

import './CommentView.scss';

export default class CommentView extends React.Component {
  constructor(props) {
    super(props);
    this.commentBody = parse(parseStringToHtml(this.props.comment.message));
    this.state = {
      readMore: false,
    };
  }

  expandReadMore = () => {
    this.setState({
      readMore: !this.state.readMore,
    });
    if (this.props.commentsArrayLength > 2) {
      this.props.toggleCommentView();
    }
  };

  render() {
    const { comment, className } = this.props;
    const { readMore } = this.state;
    return (
      <div id={comment.id} className={`comment-view-component ${className}`}>
        <div className="comment">
          <div className="comment-image">
            <Img
              src={comment.commentedByImage}
              alt="User Image"
              className="image"
            />
          </div>
          <div className="comment-content">
            <div className="comment-content-header">
              <div className="left">
                <h3 className="name">{comment.commentedByName}</h3>
                <span className="date" title={comment.addedOn12HFormat}>
                  {comment.addedOn} - {comment.addedOnTime}
                </span>
              </div>
              <div className="right">
                {/* Space reserved for Edit & Delete dropdown */}
              </div>
            </div>
            <div className="comment-content-body">
              <div
                className={`comment-text ${
                  !this.props.isExpanded ? (readMore ? '' : 'read-more') : ''
                }`}
              >
                {this.commentBody}
                {!this.props.isExpanded && (
                  <span
                    className="read-more-less-btn"
                    onClick={this.expandReadMore}
                  >
                    {this.commentBody.length < 97 ? '' : '..more' }
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isExpanded !== this.props.isExpanded) {
      this.setState({
        readMore: false,
      });
    }
  }
}
