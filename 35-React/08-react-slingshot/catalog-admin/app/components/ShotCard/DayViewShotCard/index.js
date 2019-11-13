import React from 'react';
import Fade from 'react-reveal/Fade';
import ShotCard from '../index';

function DayViewShotCard(props) {
  return (
    <Fade left duration={300}>
      <ShotCard {...props} />
    </Fade>
  );
}
export default DayViewShotCard;
