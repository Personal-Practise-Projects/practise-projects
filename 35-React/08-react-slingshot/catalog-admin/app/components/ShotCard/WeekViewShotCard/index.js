import React from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import { getShotColorFromStatus } from '../../../helpers/common';
import Carat from '../../Carat';

function WeekViewShotCard(props) {
  // eslint-disable-next-line react/prop-types
  const cardShot = props.shotDataParser(props.shot);
  // eslint-disable-next-line react/prop-types
  const { shotId, onClick } = props;
  return (
    <Fade left duration={500}>
      <article
        id={shotId}
        data-card-ident={cardShot.id}
        className={`schedule-card position-relative ${
          cardShot.shot.shot_info.locked ? 'disabled' : ''
        }`}
        onClick={() => {
          onClick(props.shot);
        }}
      >
        <Carat
          size="12px"
          color={cardShot.shot.color_tag}
          className="position-absolute position"
          radius="2px"
        />
        <span
          className={`status-light ${getShotColorFromStatus(
            cardShot.shotStatus,
          )} d-inline-block`}
        />
        <div className="shot-meta">
          <h3 className="shot-brand d-block">{cardShot.brand}</h3>
          <span className="shot-number d-block">{cardShot.shotNumber}</span>
        </div>
      </article>
    </Fade>
  );
}

WeekViewShotCard.propType = {
  shotDataParser: PropTypes.func.isRequired,
  shotId: PropTypes.number.isRequired,
  shot: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default WeekViewShotCard;
