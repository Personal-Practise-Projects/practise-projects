import React from 'react';
import CommentHistory from '../../CommentSection/CommentHistory';
import AddComment from '../../CommentSection/AddComment';
import { ADD_COMMENTS_VIEW } from '../../CommentSection/AddComment/constants';

export default class CommentListView extends React.Component {
  getStyle = () => ({
    top: `${
      this.props.dataHandler.markUps[this.props.dataHandler.selectedMarkUpIndex]
        .coordinate_y
    }px`,
    left: `${
      this.props.dataHandler.markUps[this.props.dataHandler.selectedMarkUpIndex]
        .coordinate_x
    }px`,
  });

  render() {
    const classname = this.props.className ? this.props.className : '';
    return (
      this.props.dataHandler.selectedMarkUpIndex >= 0 && (
        <section
          className={`section-details ${classname}`}
          id="comments"
          style={this.getStyle()}
          onClick={event => event.stopPropagation()}
          onMouseMove={event => {
            event.stopPropagation();
            this.props.hideToolTip();
          }}
        >
          <h4>COMMENTS</h4>
          <CommentHistory dataHandler={this.props.dataHandler.commentHandler} />
          <AddComment
            dataHandler={this.props.dataHandler.commentHandler}
            view={ADD_COMMENTS_VIEW.OPEN}
          />
        </section>
      )
    );
  }
}
