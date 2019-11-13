import React from 'react';
import Fade from 'react-reveal/Fade';
import PropTypes from 'prop-types';

import { shotDataToShotCard } from './reducer';
import ShotCard from '../ShotCard';

export default function ShotList(props) {
  if (props.shots && props.shots.length > 0) {
    return props.shots.map(shot => (
      <Fade key={shot.id} left duration={300}>
        <ShotCard
          shot={shot}
          shotId={shot.id}
          draggable={props.draggable}
          allowSelect={props.allowBulk}
          selectEventType={props.selectEventType}
          onClick={props.onClickListener}
          shotDataParser={shotDataToShotCard}
        />
      </Fade>
    ));
  }
  return <React.Fragment />;
}

ShotList.propTypes = {
  onClickListener: PropTypes.func.isRequired,
  shots: PropTypes.array.isRequired,
};
