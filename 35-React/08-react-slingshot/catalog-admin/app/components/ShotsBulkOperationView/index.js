import React from 'react';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';
import { BULK_ACTIONS } from './constants';
import { getBulkUploadComponent } from './components/Factory';
import {
  closeBulkUpdate,
  toggleConfirmDialog,
} from '../../containers/BasePage/actions';

import { BulkUpdateConfirmationController } from './controller/bulkUpdateConfirmation';
import { unSelectAllEvent } from '../SelectItem/actions';
import Singleton from '../../common/events';
import { AppEvents } from '../../common/constants';

import './styles/BulkUpdate.scss';

class BulkUpdateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateFromController(props.controller.initialController);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.state.currentController !== nextState.currentController ||
      this.state.enableNext !== nextState.enableNext
    );
  }

  render() {
    const nextLabel = this.state.currentController.nextLabel;
    const prevLabel = this.state.currentController.prevLabel;
    this.state.currentController.register(this.onEventListener);
    return (
      <div className="bulk-update-container-component">
        <div className="bulk-update-overlay position-relative">
          <div className="bulk-update-panel animated slideInRight">
            {getBulkUploadComponent(
              this.state.currentController.type,
              this.state.currentController,
            )}
            <div className="bulk-update-panel-footer">
              {
                <button
                  className="ternary-cta"
                  onClick={() => this.onEventListener(BULK_ACTIONS.CLOSE)}
                >
                  Cancel
                </button>
              }
              {prevLabel && (
                <button
                  className="ternary-cta"
                  onClick={() => this.onEventListener(BULK_ACTIONS.BACK)}
                >
                  {prevLabel}
                </button>
              )}
              {nextLabel && (
                <button
                  disabled={!this.state.currentController.enableNext}
                  className="primary-cta"
                  title={nextLabel}
                  onClick={() => this.onEventListener(BULK_ACTIONS.NEXT)}
                >
                  {nextLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  onEventListener = (eventType, args) => {
    switch (eventType) {
      case BULK_ACTIONS.NEXT:
        this.state.currentController.applyNext(this.onEventListener);
        break;
      case BULK_ACTIONS.BACK:
        this.state.currentController.applyBack(this.onEventListener);
        break;
      case BULK_ACTIONS.CLOSE:
        this.props.toggleConfirmDialog(
          new BulkUpdateConfirmationController(this.onEventListener),
        );
        break;
      case BULK_ACTIONS.CLOSE_RELOAD:
        this.props.unSelectAllEvent(this.props.controller.type);
        this.props.closeBulkUpdate();
        Singleton.getInstance().notify(AppEvents.REFRESH_BASE_PAGE);
        break;
      case BULK_ACTIONS.NEXT_LOAD:
        this.setState({
          ...stateFromController(this.state.currentController.next),
        });
        break;
      case BULK_ACTIONS.PREV_LOAD:
        this.setState({
          ...stateFromController(this.state.currentController.prev),
        });
        break;
      case BULK_ACTIONS.SHOW_ERROR:
        args && toast.error(args);
        break;
      case BULK_ACTIONS.RELOAD_STATE:
        this.setState({
          ...stateFromController(this.state.currentController),
        });
        break;
      case BULK_ACTIONS.CONFIRM_OK:
        this.props.unSelectAllEvent(this.props.controller.type);
        this.props.closeBulkUpdate();
        this.props.toggleConfirmDialog(null);
        break;
    }
  };

  componentWillUnmount() {
    // Unregister callback listener as component is getting unmount
    this.state.currentController && this.state.currentController.register(null);
  }
}

let stateFromController = function(controller) {
  return {
    currentController: controller,
    enableNext: controller.enableNext,
  };
};

const mapDispatchToProps = {
  closeBulkUpdate,
  toggleConfirmDialog,
  unSelectAllEvent,
};

export default connect(
  null,
  mapDispatchToProps,
)(BulkUpdateContainer);
