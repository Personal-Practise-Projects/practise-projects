import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CLEAR_ALL } from '../constant';

function FilterHeader(props) {
  return (
    <div className="filter-header">
      <div className="left">
        <h3 className="heading">Select filter</h3>
        <span className="sub-heading">
          {props.selectedFiltersCount} filter(s) applied
        </span>
      </div>
      <div className="right">
        <div
          onClick={() => props.eventListener(CLEAR_ALL)}
          className="clear-all"
        >
          Clear all
        </div>
      </div>
    </div>
  );
}

FilterHeader.propTypes = {
  eventListener: PropTypes.func.isRequired,
  selectedFiltersCount: PropTypes.number,
};

const mapStateToProps = state => ({
  selectedFiltersCount:
    (state.filters[state.filters.activeScreen] || {}).count || 0,
});

export default connect(mapStateToProps)(FilterHeader);
