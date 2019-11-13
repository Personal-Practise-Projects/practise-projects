import React from 'react';
import PropTypes from 'prop-types';

import AvatarWrapper from '../AvatarWrapper';
import BulkActionButton from '../BulkAction';

import './SubHeader.scss';

export default function SubHeader(props) {
  const classes = props.className ? props.className : '';
  return (
    <section className={`subheader-component title ${classes}`}>
      <div className="title-left">
        <div className="wrapper">
          <h3 className="title">{props.data.title}</h3>
          <div className="meta-info">
            {props.data.subtitle && (
              <p className="subheading">{props.data.subtitle}</p>
            )}
            {props.startChildren}
          </div>
        </div>
        {props.leftChildren}
        <AvatarWrapper dataHandler={props.dataHandler} />
      </div>
      <div className="title-right">
        {props.bulkAction && (
          <BulkActionButton
            type={props.bulkAction.type}
            page={props.bulkAction.pageType}
          />
        )}
        {props.rightChildren}
      </div>
    </section>
  );
}

SubHeader.propTypes = {
  bulkAction: PropTypes.object,
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  dataHandler: PropTypes.object,
  leftChildren: PropTypes.arrayOf(PropTypes.any),
  rightChildren: PropTypes.arrayOf(PropTypes.any),
  startChildren: PropTypes.arrayOf(PropTypes.any),
};
