import React from 'react';
import { connect } from 'react-redux';
import { WIDGET_ACTIONS } from '../ContentsChooser/common/constants';
import { clearQueue, onFileUploaded, populateQueue, removeFromQueue, } from './actions';
import { toggleConfirmDialog } from '../../containers/BasePage/actions';
import { CANCEL_MSG, ConfirmationController, } from './controllers/closeAllConfirmation';
import { getRemainingFileCount } from './helpers';
import { StringHelper } from '../../helpers/utils';
import Logger from '../../logging/logger';
import Singleton from './manager';
import QueueHeader from './QueueHeader';
import File from './file';
import { UPLOADING_NEXT } from '../../actions/types';

import './uploadQueue.scss';

const logger = Logger.createLogger('UploadList');

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    this.uploadManager = Singleton.getInstance();
    this.state = { minimize: true, currentUploadingUID: null };
  }

  componentDidMount() {
    this.uploadManager.updateStateFromPropsAndListener(
      this.eventCallbackListener,
      this.props,
    );
    window.addEventListener('beforeunload', this.__windowEventListener);
  }

  componentWillUnmount() {
    this.uploadManager.updateStateFromPropsAndListener(null, null);
    window.removeEventListener('beforeunload', this.__windowEventListener);
  }

  render() {
    return (
      this.props.queue.length > 0 && (
        <div className="upload-queue">
          <QueueHeader
            queue={this.props.queue}
            minimize={this.state.minimize}
            callbackRef={this.eventCallbackListener}
          />
          {!this.state.minimize && (
            <div className="queue-filelist">
              {this.props.queue.map(controller => (
                <File key={controller.uid} controller={controller} />
              ))}
            </div>
          )}
        </div>
      )
    );
  }

  eventCallbackListener = (eventType, args) => {
    switch (eventType) {
      case WIDGET_ACTIONS.CLOSE_ALL:
        this.props.toggleConfirmDialog();
        this.uploadManager.cancelAll();
        this.setState({});
        break;
      case WIDGET_ACTIONS.MAXIMIZE:
        this.setState({ minimize: false });
        break;
      case WIDGET_ACTIONS.MINIMIZE:
        this.setState({ minimize: true });
        break;
      case WIDGET_ACTIONS.CLOSE_WHITE:
        if (getRemainingFileCount(this.props.queue)) {
          this.props.toggleConfirmDialog(
            new ConfirmationController(this.eventCallbackListener),
          );
        } else {
          this.uploadManager.cancelAll();
          this.setState({});
        }
        break;
      case UPLOADING_NEXT:
        // On upload next event refresh state of widget
        if (this.state.currentUploadingUID !== args.uid) {
          this.setState({ currentUploadingUID: args.uid });
        }
      default:
        logger.log(StringHelper.format('Not implemented event: ##', eventType));
    }
  };

  __windowEventListener = event => {
    if (getRemainingFileCount(this.props.queue)) {
      event.returnValue = CANCEL_MSG;
    }
  };
}

UploadList.propTypes = {};

const mapStateToProps = state => ({
  queue: state.uploads.queue,
  controllerDict: state.uploads.dataDict,
  fileUploadedCount: state.uploads.fileUploadedCount,
});

const mapDispatchToProps = {
  populateQueue,
  onFileUploaded,
  clearQueue,
  removeFromQueue,
  toggleConfirmDialog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadList);
