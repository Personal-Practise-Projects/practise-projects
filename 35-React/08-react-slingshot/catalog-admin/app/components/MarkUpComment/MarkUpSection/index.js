import React from 'react';
import connect from 'react-redux/es/connect/connect';

import CommentListView from '../CommentListView/index';
import './MarkupSection.scss';
import { COMMENT_TYPES } from '../../../common/comments/constants';
import { getXYCoordinates } from '../../../helpers/common';

class MarkupSection extends React.Component {
  constructor(props) {
    super(props);
    this.markUpSectionRef = React.createRef();
    this.toolTipRef = React.createRef();
    this.state = {
      showTooltip: true,
    };
  }

  componentDidMount() {
    this.props.dataHandler.setEventListener(this.eventListener);
    this.props.dataHandler.setData(this.markUpSectionRef, {
      width: this.props.lightBoxWidth,
      height: this.props.lightBoxHeight,
    });
    this.props.dataHandler.getMarkUps(() => this.setState({}));
  }

  showCommentTooltip(event, reference, toolTipRef) {
    const coordinateValue = getXYCoordinates(event, reference.current);
    const left = `${coordinateValue.x + 15}px`;
    const top = `${coordinateValue.y - 12}px`;
    toolTipRef.current.style.left = left;
    toolTipRef.current.style.top = top;
    this.setState({
      showTooltip: true,
    });
  }

  render() {
    return (
      <div
        ref={this.markUpSectionRef}
        className="marker-container"
        onClick={event =>
          this.props.showMarkUps &&
          this.props.dataHandler.onAddMarkUp(event, this.markUpSectionRef)
        }
      >
        {this.props.showMarkUps && (
          <div
            className="mark-up-section"
            onMouseMove={event => {
              this.showCommentTooltip(
                event,
                this.markUpSectionRef,
                this.toolTipRef,
              );
            }}
            onMouseLeave={this.hideToolTip}
          >
            {this.props.dataHandler.markUps.map((markUp, index) => (
              <button
                className="marker"
                style={{
                  left: `${markUp.coordinate_x}px`,
                  top: `${markUp.coordinate_y}px`,
                }}
                onClick={event => {
                  event.stopPropagation();
                  this.toggleComment(index);
                }}
                onMouseMove={event => {
                  event.stopPropagation();
                  this.hideToolTip();
                }}
              >
                {index + 1}
              </button>
            ))}
            <CommentListView
              className="comment-section"
              dataHandler={this.props.dataHandler}
              hideToolTip={this.hideToolTip}
            />
            <div
              className={`comment-tooltip ${
                this.state.showTooltip ? 'show' : ''
              }`}
              ref={this.toolTipRef}
            >
              Click to leave a comment
            </div>
          </div>
        )}
      </div>
    );
  }

  hideToolTip = () => {
    this.setState({
      showTooltip: false,
    });
  };

  toggleComment = index => {
    this.props.dataHandler.selectedMarkUpIndex === index
      ? this.props.dataHandler.setSelectedMarkUpIndex()
      : this.props.dataHandler.setSelectedMarkUpIndex(index);
    this.setState({});
  };

  eventListener = event => {
    switch (event.type) {
      case COMMENT_TYPES.MARKUP:
        this.setState({});
        break;
    }
  };

  componentWillUnmount() {
    this.props.dataHandler.resetData();
    this.props.dataHandler.setSelectedMarkUpIndex();
  }
}

const mapStateToProps = state => ({
  showMarkUps: state.base.showMarkUps,
  lightBoxWidth: state.base.lightBox.imageWidth,
  lightBoxHeight: state.base.lightBox.imageHeight,
});

export default connect(
  mapStateToProps,
  null,
)(MarkupSection);
