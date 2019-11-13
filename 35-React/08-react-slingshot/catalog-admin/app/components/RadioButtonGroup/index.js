import React from 'react';

import './RadioButtonGroup.scss';

class RadioButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      checkByDefault: props.checkByDefault,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isDisabled !== this.props.isDisabled) {
      this.setState({
        value: this.props.value,
        checkByDefault: this.props.checkByDefault,
      });
    }
  }

  onChange = event => {
    const { value } = event.target;
    this.setState({
      value,
      checkByDefault: true,
    });
    this.props.onChange(value);
  };

  render() {
    return this.props.list.map((value, index) => (
      <div key={index} className="input-radio">
        <label className="input-radio-label d-flex align-items-center">
          <input
            type="radio"
            disabled={this.props.isDisabled}
            name={`radio${this.props.name}`}
            className="input-radio-input"
            checked={this.state.checkByDefault && this.state.value === value}
            onChange={this.onChange}
            value={value}
          />
          <span className="input-radio-checkmark d-inline-block" />
          <span className="input-radio-text">{value}</span>
        </label>
      </div>
    ));
  }
}

export default RadioButtonGroup;
