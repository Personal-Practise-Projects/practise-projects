import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import IconNavigation from '../IconNavigation';
import SidePanelHeaderView from '../SidePanelHeaderView';
import ComponentRenderFactory from '../ComponentFactory';
import {
  closeContentWidget,
  openContentWidget,
} from '../../containers/BasePage/actions';

import { DETAILS_VIEW_EVENT } from './constants';
import { ShotDetailsController } from './controller/shotDetailsController';
import { ShotHeaderController } from './controller/headerController';
import { generateUniqueId } from '../../helpers/common';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import { StringHelper } from '../../helpers/utils';

import './ShotDetailsView.scss';

class ShotDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = new ShotDetailsController(
      props.shot,
      this.eventListener,
    );
    this.state = {
      forceUpdatedVersion: generateUniqueId(),
      dataVersion: this.dataHandler.dataVersion,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.forceUpdatedVersion !== nextProps.forceUpdatedVersion) {
      return {
        forceUpdatedVersion: nextProps.forceUpdatedVersion,
      };
    }
    return {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Not good practice to call set data from this callback function
    if (
      nextProps.shot.id !== this.props.shot.id ||
      this.state.dataVersion !== nextState.dataVersion ||
      this.state.forceUpdatedVersion !== nextState.forceUpdatedVersion
    ) {
      this.dataHandler.setData(nextProps.shot);
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className='shot-details-view-component'>
        <IconNavigation section={this.section} />
        {this.props.headerMetaInfo && (
          <SidePanelHeaderView
            key={StringHelper.format(
              '##-##',
              this.dataHandler.ref.id,
              this.state.forceUpdatedVersion,
            )}
            dataHandler={
              new ShotHeaderController(
                this.props.shot,
                this.props.headerMetaInfo,
                this.dataHandler,
              )
            }
          />
        )}
        <div
          key={this.state.forceUpdatedVersion}
          className="splitpage-drawer-body"
        >
          {this.props.detailsMetaInfo &&
            this.props.detailsMetaInfo.map((header, index) => {
              return (
                this.dataHandler.shouldLoadComponent(header) &&
                ComponentRenderFactory.component(
                  header, index, this.dataHandler,
                )
              );
            })}
        </div>
      </div>
    );
  }

  eventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET:
        this.props.openContentWidget(args.uploadWidget);
        this.setState({});
        break;
      case DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET:
        this.props.closeContentWidget();
        this.setState({
          dataVersion: this.dataHandler.dataVersion,
        });
        break;
      default:
        this.props.eventListener(args);
    }
  };
}

ShotDetailsView.propTypes = {
  shot: PropTypes.object.isRequired,
  eventListener: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  // TODO need to integrate shot detail page base on selected shot id and data should be present
  // on common redux store from each page(shot list, schedule or Kanban)
  shot:
    (ownProps.shot &&
      state.shotsInfo.shotDict &&
      state.shotsInfo.shotDict[ownProps.shot.id]) ||
    ownProps.shot,
  detailsMetaInfo: state.common.shot.details,
  headerMetaInfo: state.common.shot.header,
  forceUpdatedVersion:
    state.common[GLOBAL_EVENT_TYPE.SHOT].detailsUpdatedVersion,
});

const mapDispatchToProps = {
  openContentWidget,
  closeContentWidget,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShotDetailsView);
