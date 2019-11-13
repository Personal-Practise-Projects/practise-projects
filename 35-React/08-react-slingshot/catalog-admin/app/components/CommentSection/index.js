import React from 'react';

import AddComment from './AddComment';
import CommentHistory from './CommentHistory';
import './CommentSection.scss';

export default class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
    };
  }

  componentDidMount() {
    this.props.dataHandler.commentHandler.getData(this.showComments);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.dataHandler.id !==
      (prevProps.dataHandler && prevProps.dataHandler.id)
    ) {
      this.props.dataHandler.commentHandler.getData(this.showComments);
      this.setState({
        showComments: false,
      });
    }
  }

  showComments = () => this.setState({ showComments: true });

  render() {
    const { showComments } = this.state;
    return (
      showComments && (
        <section className="comment-section-component" id="comments">
          <h4 className="title">Comments</h4>
          <AddComment dataHandler={this.props.dataHandler.commentHandler} />
          <CommentHistory dataHandler={this.props.dataHandler.commentHandler} />
        </section>
      )
    );
  }
}
