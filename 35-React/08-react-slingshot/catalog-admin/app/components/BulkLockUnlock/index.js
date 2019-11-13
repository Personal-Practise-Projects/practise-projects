import React from 'react';
import { connect } from 'react-redux';

import { unSelectAllEvent } from '../SelectItem/actions';
import { Icon } from '../Icon';
import { AppEvents } from '../../common/constants';
import Singleton from '../../common/events';

class BulkLockUnlock extends React.Component {
  componentDidUpdate() {
    this.props.dataHandler.setData(
      this.props.selectedItems,
      this.props.lockedItems,
    );
  }

  render() {
    this.props.dataHandler.register(this.onEventListener);
    return (
      <>
        <Icon
          disabled={`${
            this.props.selectedItems[this.props.dataHandler.type].count === 0
              ? 'disabled'
              : ''
          }`}
          className="icon icon-locked"
          header={{
            data_key: 'shot_info.locked',
            uid: '#bulkLock',
            updateWithData: true,
          }}
          dataHandler={this.props.dataHandler}
          extraProps={{ title: 'Lock selected shots' }}
        />
        <Icon
          disabled={`${this.props.lockedItems.length === 0 ? 'disabled' : ''}`}
          className="icon icon-unlocked"
          header={{
            data_key: 'shot_info.locked',
            uid: '#bulkUnlock',
            updateWithData: false,
          }}
          dataHandler={this.props.dataHandler}
          extraProps={{ title: 'Unlock all shots' }}
        />
      </>
    );
  }

  onEventListener = () => {
    this.props.unSelectAllEvent(this.props.dataHandler.type);
    Singleton.getInstance().notify(AppEvents.REFRESH_BASE_PAGE);
  };

  componentWillUnmount() {
    this.props.dataHandler.register(null);
  }
}

const mapStateToProps = state => ({
  selectedItems: state.selectedItems,
  lockedItems: state.shotsInfo.shots.data.filter(
    shot => shot.shot_info.locked,
  ),
});

const mapDispatchToProps = {
  unSelectAllEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BulkLockUnlock);
