import React from 'react';
import { connect } from 'react-redux';

import {
  updateTalentData,
  updateTalentConfig,
} from '../../actions/talentActions';
import { fetchTalentData, fetchTalentConfig } from './services';

import SubHeader from '../../components/SubHeader';
import { PlainHeader } from '../../components/PlainHeader';
import { getParameterByName } from '../../helpers/common';
import BasePage from '../BasePage';
import Loader from '../../components/Loader';
import TalentGrid from '../../components/TalentGrid';

import styles from './TalentPage.scss';
import { buildFeatureReference } from './helper';

class TalentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isLoading && nextProps.talents.actor_info.length > 0) {
      return { isLoading: false };
    }
    return null;
  }

  getTalentLength = () => [<span>{this.props.talents.actor_info.length}</span>];

  getTitle = () => (
    <p className="title">
      <span className="title-heading">{this.props.talents.brand_name}</span> -
      CR {this.props.talents.cr_id}
    </p>
  );

  render() {
    const { talents } = this.props;
    const classname = this.props.talents.actor_info.length > 3 ? '' : 'less-than-3-models';
    return (
      <BasePage>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <div id="talent-page" style={styles}>
            <PlainHeader title={this.getTitle()} className="talent-header" />
            <SubHeader
              data={{ title: 'Model Listing' }}
              leftChildren={this.getTalentLength()}
            />
            <TalentGrid
              className={classname}
              featureReference={buildFeatureReference}
              talents={talents}
            />
          </div>
        )}
      </BasePage>
    );
  }

  componentDidMount() {
    const uniqueCode = getParameterByName(null, 'q');
    fetchTalentData(this.props.updateTalentData, uniqueCode);
    fetchTalentConfig(this.props.updateTalentConfig);
  }

}

const mapStateToProps = state => ({
  talents: state.talent.data,
  metaInfo: state.talent.metaInfo,
  dataDict: state.talent.dataDict,
});

const mapDispatchToProps = {
  updateTalentData,
  updateTalentConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TalentPage);
