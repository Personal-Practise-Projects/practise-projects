import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import { refreshDetails } from '../../actions/commonActions';
import { DONE } from '../../common/constants';
import UserInfoComponent from '../UserInfo';
import { buildConditionalString } from '../../common/helpers';
import { unSelectRow } from '../SelectItem/actions';

import './LockUnlock.scss';

class LockUnlock extends React.Component {
  constructor(props) {
    super(props);
    const controller = props.dataHandler.getController(props.header);
    this.state = {
      dataController: controller,
      isChecked: controller.isChecked(),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isChecked !== nextState.isChecked;
  }

  render() {
    const extraConfig = this.state.dataController.getExtraConfig();
    return (
      <div className="lock-unlock-component">
        <i
          className={buildConditionalString(
            'icon',
            'icon-locked',
            this.state.isChecked,
            'icon-unlocked',
          )}
          onClick={this.toggleChange}
          data-tip=""
          data-for="lockUnlock"
        />
        <ReactTooltip
          id="lockUnlock"
          className="react-tooltip-component"
          place="bottom"
          type="dark"
          effect="solid"
        >
          <div className="text">{extraConfig.placeholder}</div>
          {extraConfig.userInfo && (
            <UserInfoComponent
              title={extraConfig.userInfo.title}
              thumb={extraConfig.userInfo.profile_thumb.small}
            />
          )}
        </ReactTooltip>
      </div>
    );
  }

  toggleChange = () => {
    this.setState(
      {
        isChecked: !this.state.isChecked,
      },
      () => {
        this.state.dataController.onUpdate(this.state.isChecked, status => {
          if (status === DONE) {
            // If item is locked then remove it from selected item
            const dataController = this.state.dataController;
            if (this.state.isChecked) {
              this.props.unSelectRow(dataController.globalEventType, {
                selectableData: dataController.ref,
              });
            }
            // If api is success refresh detail page
            this.props.refreshDetails(dataController.globalEventType);
          } else {
            // If api is failed revert the lock button state
            this.setState({ isChecked: !this.state.isChecked });
          }
        });
      },
    );
  };
}

LockUnlock.propTypes = {
  isChecked: PropTypes.bool,
};

const mapDispatchToProps = {
  refreshDetails,
  unSelectRow,
};
export default connect(
  null,
  mapDispatchToProps,
)(LockUnlock);
