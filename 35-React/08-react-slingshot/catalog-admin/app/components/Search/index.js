import React from 'react';

import debounce from 'lodash/debounce';

import PropTypes from 'prop-types';

import './Search.scss';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      showInput: props.showInput,
      classes: props.classes,
    };
  }

  /* eslint-disable camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.value && this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getComponentToDisplay = () => {
    const { value, classes, showInput } = this.state;
    const { placeholder } = this.props;
    if (showInput) {
      return (
        <div className="input-wrapper input-search position-relative">
          <input
            autoFocus={this.props.canCollapse || this.props.autoFocus}
            value={value}
            style={this.getInputStyleProperties()}
            placeholder={placeholder}
            className={`input-field ${classes}`}
            onKeyPress={this.onKeyPress}
            onChange={this.onChangeValue}
            onBlur={this.onBlur}
          />
        </div>
      );
    }
    return (
      <React.Fragment>
        <button type="button" className="btn btn-toggle-search">
          <i className="icon-search" />
        </button>
        {value && <span className="search-label d-inline-block">{value}</span>}
      </React.Fragment>
    );
  };

  // TODO: overflow label
  render() {
    return (
      <div
        className="search-component"
        onClick={() => this.onSearchIconClick()}
        role="searchbox"
        tabIndex={0}
      >
        {this.getComponentToDisplay()}
      </div>
    );
  }

  getInputStyleProperties() {
    return {
      width: `${this.props.width}px`,
    };
  }

  canCollapse = () => this.props.canCollapse && !this.state.value;

  updateShowInputState(canShowInput) {
    this.setState({
      showInput: canShowInput,
    });
  }

  onSearchIconClick = () => {
    this.updateShowInputState(true);
  };

  onKeyPress = event => {
    if (event.key === 'Enter' && this.canCollapse()) {
      this.updateShowInputState(false);
    }
  };

  onChangeValue = event => {
    this.setState({
      value: event.target.value,
    });
    this.searchData();
  };

  onBlur = () => {
    if (this.canCollapse()) this.updateShowInputState(false);
  };

  searchData = debounce(() => {
    if (this.props.handler.search) {
      this.props.handler.search(this.state.value.trim());
    } else {
      this.props.handler(this.state.value.trim());
    }
  }, 500);
}

Search.propTypes = {
  autoFocus: PropTypes.bool,
  canCollapse: PropTypes.bool,
  classes: PropTypes.string,
  handler: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  placeholder: PropTypes.string,
  showInput: PropTypes.bool,
  value: PropTypes.string,
  width: PropTypes.number,
};

Search.defaultProps = {
  canCollapse: false,
  showInput: true,
};
