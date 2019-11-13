import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id)
      this.setState({ value: this.props.value });
  }

  render() {
    const { type, name, placeholder, title, className } = this.props.header;
    const { value } = this.state;
    return (
      <div className="input-wrapper">
        <label className="input-label d-block">{title}</label>
        <input
          type={type}
          name={name}
          value={value || ''}
          placeholder={placeholder}
          className={`input-field d-block ${className}`}
          onBlur={
            this.props.updateDetailsOnBlur ? this.updateDetailsOnBlur : null
          }
          onChange={this.onChangeValue}
        />
      </div>
    );
  }

  updateDetailsOnBlur = () => {
    const { value } = this.state;
    if (this.props.value !== value) {
      const updatedObject = {
        data_key: this.props.header.data_key,
        value,
      };
      this.props.updateDetailsOnBlur(updatedObject);
    }
  };

  onChangeValue = event => {
    this.setState({
      value: event.target.value,
    });
  };
}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  parentType: PropTypes.string,
};

export default Input;
