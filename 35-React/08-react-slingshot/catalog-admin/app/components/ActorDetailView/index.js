import React from 'react';
import { connect } from 'react-redux';

import ActorDetailHeader from '../ActorDetailHeader';
import {
  UPDATE_ACTOR_IMAGES,
  updateActor,
  updateActorImages,
} from '../../actions/actorActions';
import {
  closeContentWidget,
  openContentWidget,
} from '../../containers/BasePage/actions';
import ComponentRenderFactory from '../ComponentFactory';
import ActorDataHandler from './dataHandler';
import { COMMON_ACTIONS } from '../../common/constants';
import Logger from '../../logging/logger';

const logger = Logger.createLogger('Location details');

class ActorDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = new ActorDataHandler(
      { eventListener: this.eventListener, ...props },
      this.props.selectedActor,
    );
    this.dataVersion = this.dataHandler.dataVersion;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.selectedActor === nextProps.selectedActor &&
      this.dataVersion > this.dataHandler.dataVersion
    ) {
      return false;
    }
    this.dataHandler.setData(nextProps, nextProps.selectedActor);
    this.dataVersion = this.dataHandler.dataVersion;
    return true;
  }

  render() {
    return (
      <div className="splitpage-drawer animated slideInRight">
        <ActorDetailHeader
          name={this.props.selectedActor.actor_data.name}
          onClick={() => {
            this.eventListener({ action: COMMON_ACTIONS.CLOSE_DETAILS_PANEL });
          }}
        />
        <div className="splitpage-drawer-body">
          {this.props.headers.map((header, index) =>
            ComponentRenderFactory.component(header, index, this.dataHandler),
          )}
        </div>
      </div>
    );
  }

  eventListener = args => {
    switch (args.action) {
      case COMMON_ACTIONS.CLOSE_DETAILS_PANEL:
        this.props.closePanel(null);
        break;
      default:
        logger.error(`Un-supported action ${args.action}`);
    }
  };
}

const mapStateToProps = state => ({
  headers: state.actors.meta_info.detail_headers,
  actors: state.actors.data,
});

const mapDispatchToProps = {
  updateActor,
  updateActorImages,
  openContentWidget,
  closeContentWidget,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorDetailView);
