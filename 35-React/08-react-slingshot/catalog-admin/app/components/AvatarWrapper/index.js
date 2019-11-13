import React, { Component } from 'react';
import { connect } from 'react-redux';
import AvatarGroup from '@atlaskit/avatar-group';
import { onAvatarSelect } from '../../actions/avatarWrapperActions';
import { avatarListConfig } from './config';
import { unSelectAllEvent } from '../SelectItem/actions';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';

import './AvatarWrapper.scss';

class AvatarWrapper extends Component {
  render() {
    return (
      <div className="avatar-wrapper-component">
        <AvatarGroup
          {...avatarListConfig}
          data={this.getAvatarGroupData()}
          onAvatarClick={({ item }) => {
            this.onAvatarClick(item);
          }}
        />
      </div>
    );
  }

  getAvatarGroupData = () => Object.values(this.props.availableAvatars || {});

  onAvatarClick = item => {
    this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
    this.props.onAvatarSelect({
      type: this.props.dataHandler.getScreenInfo(),
      data: item,
    });
  };
}

const mapStateToProps = (state, ownProps) => ({
  availableAvatars:
    ownProps.dataHandler &&
    state.avatar[ownProps.dataHandler.getScreenInfo()].availableAvatars,
});

const mapDispatchToProps = {
  onAvatarSelect,
  unSelectAllEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvatarWrapper);
