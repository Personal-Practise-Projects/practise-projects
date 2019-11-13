import React from 'react';
import PropTypes from 'prop-types';

import './CheckBox.scss';
import { DONE } from "../../common/constants";

export default class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...getStateFromController(this.props.header, this.props.dataHandler),
    };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataHandler.dataVersion !== prevState.dataVersion) {
      return {
        dataVersion: nextProps.dataHandler.dataVersion,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isChecked !== nextState.isChecked
      || nextProps.dataHandler.dataVersion !== this.state.dataVersion
      || this.state.isDisabled !== nextState.isDisabled
    );
  }

  render() {
    return (
      <div className="input-wrapper checkbox-wrapper">
        <label
          className={this.state.isDisabled ? 'disabled-checkbox input-label' : 'input-label'}
        >
          <input
            type="checkbox"
            className="input-field"
            value={this.props.header.value || ''}
            disabled={this.state.isDisabled}
            checked={this.state.isChecked}
            onChange={this.toggleChange}
          />
          <span className="checkbox-checker" />
          <span className="checkbox-content">{this.props.header.title || ''}</span>
        </label>
      </div>
    );
  }

  toggleChange = () => {
    this.setState(
      {
        isChecked: !this.state.isChecked,
      },
      () => {
        this.props.dataHandler.onUpdate(
          this.props.header,
          this.state.isChecked,
          (status) => {
            if (status === DONE) {
              this.setState({ ...getStateFromController(this.props.header, this.props.dataHandler), })
            } else {
              //If api is failed revert the lock button state
              this.setState({ isChecked: !this.state.isChecked, })
            }
          },
        );
      },
    );
  };
}

let getStateFromController = function (header, controller) {
  const existingData = controller.getExistingData(header);
  const extraConfig = controller.getExtraConfig ? controller.getExtraConfig(header) : {};
  const isDisabled = extraConfig.readonly || existingData.isDisabled;
  return { ...existingData, isDisabled };
};

CheckBox.propTypes = {
  isChecked: PropTypes.bool,
};
