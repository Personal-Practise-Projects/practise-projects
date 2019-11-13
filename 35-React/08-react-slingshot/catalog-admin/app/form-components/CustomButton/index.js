import React from 'react';

import './CustomButton.scss';

class CustomButton extends React.Component {
  render() {
    const { label, classes, id, icon } = this.props.header;
    const classname = classes || '';
    const { readonly } =
      (this.props.dataHandler.getExtraConfig &&
        this.props.dataHandler.getExtraConfig(this.props.header)) ||
      {};
    return (
      <button
        type="button"
        disabled={readonly}
        id={id || ''}
        onClick={() => this.handleClick()}
        className={`custom-button-component primary-cta ${classname}`}
      >
        {icon && <i className={icon} />}
        {label}
      </button>
    );
  }

  handleClick = () => {
    this.props.dataHandler.onUpdate(this.props.header, null, () => {
      this.setState({});
    });
  };
}

export default CustomButton;
