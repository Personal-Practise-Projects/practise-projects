import React from 'react';
import { connect } from 'react-redux';

import BulkActionButton from '../BulkAction';
import DropDown from '../../form-components/DropDown';
import Search from '../Search';
import { AllowedFeature } from '../AllowedFeature';
import { BulkLockUnlockController } from '../../containers/ShotsPage/BulkLockUnlockController';
import { GLOBAL_EVENT_TYPE, SELECT_ITEMS_TYPE } from '../../common/constants';
import { checkFeature } from '../ShotDetailsView/helper';
import { PERMISSIONS_FEATURES_KEYS } from "../../common/permission";

const __features = {
  1: [PERMISSIONS_FEATURES_KEYS.FULL_ACCESS_SHOT_LIST, PERMISSIONS_FEATURES_KEYS.READ_ACCESS_SHOT_LIST]
};
class ShotListSubHeader extends React.Component {
  constructor(props) {
    super(props);
    this.searchPlaceholder =
      'Search by Assignee, Category, Setup, Status, Products and Props';
    this.bulkLockUnlockDataHandler = new BulkLockUnlockController(
      GLOBAL_EVENT_TYPE.SHOT,
    );
  }

  render() {
    return (
      <React.Fragment>
        <AllowedFeature
          features={this.props.allowedFeatures}
          dataHandler={this.bulkLockUnlockDataHandler}
        />
        <BulkActionButton
          type={GLOBAL_EVENT_TYPE.SHOT}
          page={SELECT_ITEMS_TYPE.SHOT_LIST}
        />
        {checkFeature(__features[1], __features[1][0]) &&
          this.props.categoryList.length !== 0 && (
          <DropDown
            key={0}
            title="Create new shot"
            list={this.props.categoryList}
            header={{
              placeholder: '',
              title: '',
              data_key: 'content_category',
            }}
            updateDetailsOnBlur={this.props.shotSubHeaderEventListener}
          />
        )}
        <Search
          placeholder={this.searchPlaceholder}
          handler={this.props.searchHandler}
          width={420}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  allowedFeatures: state.common.shot.allowed_features,
});

export default connect(
  mapStateToProps,
  null,
)(ShotListSubHeader);
