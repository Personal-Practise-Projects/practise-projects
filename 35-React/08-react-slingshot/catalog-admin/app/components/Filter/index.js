import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FilterIcon from './components/filterIcon';
import FilterHeader from './components/filterHeader';
import FilterFooter from './components/filterFooter';
import RightFilterPanel from './components/RightFilterPanel';
import { APPLY, CANCEL, CLEAR, CLEAR_ALL, TOGGLE } from './constant';
import { buildConditionalString } from '../../common/helpers';
import { clearAllFilter, toggleFilter, updateAllFilters } from './action';
import { unSelectAllEvent } from '../SelectItem/actions';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import { getFilterData } from '../../containers/ProductionBoardPage/helpers';

// Import Component Specific Styles
import './Filter.scss';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      controller: null,
      selectedFilterConfig: {},
    };
    props.controller.setData(props.filters.selectedFilters);
    props.controller.setRefreshFilter(this.reRender);
    props.controller.initializeControllers(
      props.availableFilters,
      props.activeScreen,
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { availableFilters } = nextProps;
    if (
      nextProps.controller !== prevState.controller ||
      !prevState.selectedFilterConfig ||
      prevState.isOpen !== nextProps.isOpen
    ) {
      if (prevState.isOpen !== nextProps.isOpen) {
        nextProps.controller.reset();
      }
      nextProps.controller.setData(nextProps.filters.selectedFilters);
      nextProps.controller.initializeControllers(
        availableFilters,
        nextProps.activeScreen,
      );
      const defaultSelectedFilter = availableFilters[0];
      return {
        isOpen: nextProps.isOpen,
        controller: nextProps.controller,
        selectedFilterConfig: defaultSelectedFilter,
      };
    }
    return null;
  }

  render() {
    if (this.props.availableFilters) {
      return (
        <div
          className="filter-component"
          ref={node => {
            this.node = node;
          }}
        >
          <FilterIcon eventListener={this.eventListener} />
          {this.props.isOpen && (
            <div className="filter-container">
              <FilterHeader eventListener={this.eventListener} />
              {this.getFilterBody()}
            </div>
          )}
        </div>
      );
    }
    return <React.Fragment />;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
    this.props.controller.setEventListener(this.eventListener);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
    this.props.controller.setEventListener(null);
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {
    // Filters data (i.e. Brands, Categories, Setups etc)
    if (prevProps.filtersConfig !== this.props.filtersConfig) {
      this.props.getFilterData(
        this.props.activeScreen,
        this.props.filtersConfig,
      );
    }
  }

  getFilterBody() {
    return (
      <div className="filter-body">
        {this.getLeftSection()}
        {this.getRightSection()}
      </div>
    );
  }

  getLeftSection() {
    return (
      <div className="filter-options">
        {this.props.availableFilters &&
          this.props.availableFilters.map((filterConfig, index) =>
            this.getOption(index, filterConfig),
          )}
      </div>
    );
  }

  getRightSection() {
    return (
      <div className="right-panel">
        <RightFilterPanel
          selectedController={
            this.props.controller.filterControllers[
              this.state.selectedFilterConfig.uid
            ]
          }
        />
        <FilterFooter eventListener={this.props.controller.eventListener} />
      </div>
    );
  }

  getOption = (index, filterConfig) => {
    const count =
      this.props.controller.filterControllers[filterConfig.uid] &&
      this.props.controller.filterControllers[filterConfig.uid].count;
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        key={index}
        className={buildConditionalString(
          'filter-option',
          'active',
          filterConfig.uid === this.state.selectedFilterConfig.uid,
        )}
        onClick={() => this.onFilterClick(filterConfig)}
      >
        <div className="wrapper">
          <span className="title">{filterConfig.title}</span>
          {count > 0 && <div className="count">{count}</div>}
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="clear"
          onClick={() => {
            this.props.controller.eventListener(CLEAR, filterConfig);
          }}
        >
          Clear
        </div>
      </div>
    );
  };

  reRender = () => {
    this.setState({});
  };

  onFilterClick = filterConfig => {
    this.setState({ selectedFilterConfig: filterConfig });
  };

  handleClickOutside = e => {
    if (!this.node || this.node.contains(e.target)) {
      return;
    }
    this.eventListener(CANCEL);
  };

  eventListener = (type, data) => {
    switch (type) {
      case APPLY:
        this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
        this.props.updateAllFilters(data);
        break;
      case TOGGLE:
        this.props.toggleFilter();
        break;
      case CLEAR_ALL:
        this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
        this.props.clearAllFilter();
        break;
      case CANCEL:
        this.props.toggleFilter(false);
        break;
      default:
        break;
    }
  };
}

Filter.propTypes = {
  filters: PropTypes.object,
  filtersConfig: PropTypes.array,
  availableFilters: PropTypes.array,
  unSelectAllEvent: PropTypes.func,
  controller: PropTypes.object,
  toggleFilter: PropTypes.func,
  clearAllFilter: PropTypes.func,
  updateAllFilters: PropTypes.func,
  isOpen: PropTypes.bool,
  activeScreen: PropTypes.string,
  getFilterData: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  activeScreen: state.filters.activeScreen,
  isOpen: state.filters.isOpen,
  filters: state.filters[state.filters.activeScreen] || {},
  filtersConfig: state.common.shot.filters[state.filters.activeScreen],
  availableFilters:
    state.common[ownProps.filterType].filters[state.filters.activeScreen],
});

const mapDispatchToProps = {
  clearAllFilter,
  toggleFilter,
  updateAllFilters,
  unSelectAllEvent,
  getFilterData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Filter);
