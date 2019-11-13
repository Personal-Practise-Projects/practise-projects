import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CircularProgressbar } from 'react-circular-progressbar';
import { UPLOADING, WAITING } from '../../common/constants';
import { FILE_UPLOAD_EVENT, getProgressObjectFromStatus } from './constants';
import { StringHelper } from '../../helpers/utils';

const CALLBACK_ID = 'GLOBAL_QUEUE_FILE';
class File extends Component {
  constructor(props) {
    super(props);
    const file = props.controller.file;
    this.state = {
      progress: file.progress,
      status: file.status,
      showHoverView: false,
      file,
    };
  }

  showHoverView = event => {
    this.setState({ showHoverView: event.type === 'mouseover' });
  };

  componentDidMount() {
    this.props.controller.registerCallbackListener(
      CALLBACK_ID,
      this.__fileEvenCallbackFn,
    );
  }

  componentWillUnmount() {
    this.props.controller.unRegisterCallbackListener(CALLBACK_ID);
  }

  render() {
    const progressObjectFromStatus = getProgressObjectFromStatus(
      this.state.file.status,
    );
    const progressColorClass = progressObjectFromStatus.COLOR_CLASS;
    const onHoverIconClass = this.state.showHoverView
      ? progressObjectFromStatus.ON_HOVER_ICON_CLASS
      : '';
    return (
      <div className={StringHelper.format('queue-file ##', progressColorClass)}>
        <img
          src={this.state.file.preview}
          className="queue-file-preview "
          alt=""
        />
        <div className="queue-file-info">
          <div className="primary-info">{this.state.file.shotTitle}</div>
          <div className="secondary-info" title={this.state.file.name}>
            {this.state.file.name}
          </div>
        </div>
        <div
          className="queue-file-progress"
          title={progressObjectFromStatus.TOOLTIP}
          onClick={() =>
            progressObjectFromStatus.TRIGGER_EVENT(this.props.controller)
          }
          onMouseOver={event => this.showHoverView(event)}
          onMouseLeave={event => this.showHoverView(event)}
        >
          <i
            className={StringHelper.format(
              '## ##',
              progressObjectFromStatus.ICON_CLASS,
              onHoverIconClass,
            )}
          />
          {this.state.file.status === UPLOADING ? (
            <CircularProgressbar
              minValue={0}
              maxValue={100}
              value={this.state.file.progress || 0}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }

  __fileEvenCallbackFn = (eventType, args) => {
    switch (eventType) {
      case FILE_UPLOAD_EVENT.IN_PROGRESS:
        this.setState({ progress: args.file.progress });
      case FILE_UPLOAD_EVENT.DONE:
        this.setState({ status: args.file.status });
        break;
    }
  };
}

File.propTypes = {
  controller: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const progress = state.uploads.dataDict[ownProps.controller.uid]
    ? state.uploads.dataDict[ownProps.controller.uid].progress
    : 0;
  const status = state.uploads.dataDict[ownProps.controller.uid]
    ? state.uploads.dataDict[ownProps.controller.uid].status
    : 'WAITING';
  return { progress, status };
};

export default connect(mapStateToProps)(File);
