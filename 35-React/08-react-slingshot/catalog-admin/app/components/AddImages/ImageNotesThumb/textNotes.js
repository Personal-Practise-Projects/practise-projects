import React from 'react';
import PropTypes from 'prop-types';
import ReadOnlyComponentRenderFactory from "../../ComponentFactory/readOnlyComponentFactory";

class TextNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  render() {
    const { name, placeholder, title } = this.props.header;
    const { value } = this.state;
    if (this.props.readonly) {
      return value && ReadOnlyComponentRenderFactory.component(
        this.props.header.type, 0, '', value || this.state.readPlaceholder
      )
    }
    return (
      <div className="input-wrapper">
        <label className="input-label d-block">{title}</label>
        <textarea
          name={name}
          value={value || ''}
          placeholder={placeholder}
          className="input-field d-block"
          onBlur={this.updateDetailsOnBlur}
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

TextNotes.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
};

export default TextNotes;
