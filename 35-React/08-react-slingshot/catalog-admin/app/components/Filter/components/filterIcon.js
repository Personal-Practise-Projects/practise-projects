import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TOGGLE } from '../constant';

function FilterIcon(props) {
  return (
    <div className="filter-cta" onClick={() => props.eventListener(TOGGLE)}>
      <i className="icon-filter" />
      {props.selectedFiltersCount !== 0 && (
        <div className="filter-count">{props.selectedFiltersCount}</div>
      )}
    </div>
  );
}

FilterIcon.propTypes = {
  eventListener: PropTypes.func.isRequired,
  selectedFiltersCount: PropTypes.number,
};

const mapStateToProps = state => ({
  selectedFiltersCount:
    (state.filters[state.filters.activeScreen] || {}).count || 0,
});

export default connect(mapStateToProps)(FilterIcon);
