import React from 'react';
import PropTypes from 'prop-types';

import CommentView from '../CommentView';

export default class CommentHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  componentDidMount() {
    this.props.dataHandler.getComments(this.setCommentsOnUpdate);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.dataHandler.ref.id !== prevProps.dataHandler.ref.id ||
      this.props.dataHandler.comments !== this.state.comments
    )
      this.props.dataHandler.getComments(this.setCommentsOnUpdate);
  }

  setCommentsOnUpdate = comments => {
    this.setState({
      comments,
    });
  };

  render() {
    const { comments } = this.state;
    return comments.length ? (
      <div className="comment-history">
        {comments.map((comment, index) => (
          <CommentView
            key={index}
            comment={comment}
            isExpandable={this.props.dataHandler.isExpandable}
          />
        ))}
      </div>
    ) : (
      ''
    );
  }
}

CommentHistory.propTypes = {
  dataHandler: PropTypes.object,
};
