import React from 'react';
import Avatar from 'react-avatar';

import Carat from '../Carat';
import { getShotColorFromStatus } from '../../helpers/common';
import SelectItem from '../SelectItem';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';

import './ShotCard.scss';
import VerticalSeparator from '../VerticalSeparator';
import { CounterInfo } from '../CounterInfo';

class ShotCard extends React.Component {
  render() {
    const cardShot = this.props.shotDataParser
      ? this.props.shotDataParser(this.props.shot)
      : {};
    const draggable =
      cardShot.draggable &&
      (this.props.draggable === undefined || this.props.draggable);
    let extraProps = {};
    if (draggable) {
      extraProps = {
        draggable: true,
        'data-draggable': true,
      };
    }
    return (
      <article
        id={this.props.shotId}
        data-droppable={cardShot.droppable}
        data-card-ident={cardShot.id}
        className={`
          shot-card-component schedule-card  position-relative 
          ${getAnimationClass(cardShot)} 
          ${this.props.selectedClass || ''} 
          ${cardShot.draggable ? 'shot-card' : ''}
          ${cardShot.disabled ? 'disabled' : ''} 
        `}
        onClick={() => {
          this.props.onClick(this.props.shot);
        }}
        {...extraProps}
      >
        {this.props.allowSelect && (
          <SelectItem
            header={{ type: GLOBAL_EVENT_TYPE.SHOT }}
            item={cardShot}
            parent={this.props.selectEventType}
          />
        )}
        <Carat
          size="12px"
          color={cardShot.shot.color_tag}
          className="position-absolute position"
          radius="2px"
        />
        {cardShot.owner &&
          cardShot.owner.profile_picture_thumbnail && (
            <div
              className="position-absolute schedule-card-profile"
              title={cardShot.owner.name}
            >
              <Avatar
                initials={cardShot.owner.name}
                size="32"
                round="50%"
                src={cardShot.owner.profile_picture_thumbnail.large}
              />
            </div>
          )}
        <span
          className={`status-light ${getShotColorFromStatus(
            cardShot.shotStatus,
          )} d-inline-block`}
        />
        <div className="shot-meta">
          <h3 className="shot-brand d-block">
            {cardShot.brand}
            {getLockInfo(cardShot)}
          </h3>
          <span className="shot-number d-block">{cardShot.shotNumber}</span>
        </div>
        <div className="shot-config">
          <div className="shot-config-left">
            <span className="shot-category d-block">{cardShot.category}</span>
            <div className="wrapper">
              <span className="shot-setup">{cardShot.setup}</span>
              {cardShot.counterInfo && <VerticalSeparator />}
              <CounterInfo data={cardShot.counterInfo} />
            </div>
          </div>
          {cardShot.display_date && (
            <div className="shot-config-right">
              <span className="shot-due d-block">{cardShot.display_date}</span>
            </div>
          )}
        </div>
      </article>
    );
  }
}
export default ShotCard;

const getAnimationClass = function(shotCard) {
  if (shotCard.shot.updatedOn && new Date() - shotCard.shot.updatedOn <= 5000) {
    return 'animated zoomIn';
  }
  delete shotCard.shot.updatedOn;
  return '';
};

const getLockInfo = function(card) {
  return (
    card.locked && (
      <React.Fragment>
        <i className="icon-lock" data-tip="" data-for="lock-tooltip" title='Shot is locked'/>
      </React.Fragment>
    )
  );
};
