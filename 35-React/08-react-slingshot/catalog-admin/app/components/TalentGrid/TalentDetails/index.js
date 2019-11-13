import React from 'react';
import { connect } from 'react-redux';

import { TalentDetailsHeader } from './talentDetailsHeader';
import { TalentDetailsMetaInfo } from './talentDetailsMetaInfo';

import styles from './TalentDetails.scss';

const TalentDetails = props => (
  <div className="talent-details" style={styles}>
    <TalentDetailsHeader />
    <TalentDetailsMetaInfo info={props} />
  </div>
);

const mapStateToProps = state => ({
  metaInfo: state.talent.metaInfo,
});

export default connect(
  mapStateToProps,
  null,
)(TalentDetails);
