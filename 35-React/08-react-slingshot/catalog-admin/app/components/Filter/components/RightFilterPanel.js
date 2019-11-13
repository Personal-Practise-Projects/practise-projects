import React from 'react';
import PropTypes from 'prop-types';
import ComponentRenderFactory from '../componentRenderFactory';
import './RightFilterPanel.scss';

export default function RightFilterPanel(props) {
  return (
    <div className="right-filter-panel-component">
      {props.selectedController &&
        ComponentRenderFactory.component(props.selectedController)}
    </div>
  );
}
RightFilterPanel.propTypes = {
  selectedController: PropTypes.object.isRequired,
};
