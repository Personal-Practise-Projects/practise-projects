import React from 'react';

import './Search.scss';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      classes: props.classes,
    };
  }

  getComponentToDisplay = () => {
    const { value, classes } = this.state;
    const { placeholder } = this.props;
    return (
      <React.Fragment>
        <div className="input-wrapper input-search position-relative">
          <i className="icon-search" />
          <input
            value={value}
            style={this.getInputStyleProperties()}
            placeholder={placeholder}
            className={`input-field ${classes}`}
            onKeyPress={this.onKeyPress}
            onChange={this.onChangeValue}
            onBlur={this.onBlur}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    return this.getComponentToDisplay();
  }

  getInputStyleProperties() {
    return {
      width: `${this.props.width}px`,
    };
  }

  onKeyPress = event => {
    if (event.key === 'Enter')
      this.props.searchHandler.search(this.state.value.trim());
  };

  onChangeValue = event => {
    this.setState({
      value: event.target.value,
    });
  };
}
