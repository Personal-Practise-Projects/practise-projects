import React from 'react';

import './ToggleTextArea.scss';
import { BULK_ACTIONS } from '../ShotsBulkOperationView/constants';
import ReadOnlyComponentRenderFactory from '../ComponentFactory/readOnlyComponentFactory';

export default class ToggleTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.header = props.controller.getHeaders(props.header);
    this.existingValue = props.controller.getExistingData(props.header);
    this.state = {
      showInput: this.existingValue || false,
      value: this.existingValue,
      ...this.props.controller.getExtraConfig(),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.existingValue = this.props.controller.getExistingData(
        this.props.header,
      );
      this.setState({
        value: this.existingValue,
        showInput: this.existingValue || false,
      });
    }
  }

  render() {
    return (
      <div
        className={`edit-text-link-component ${
          this.state.readonly ? 'disabled' : ''
        }`}
      >
        {!this.state.showInput ? (
          <div className="other-option-cta" onClick={this.toggleInput}>
            Other option
          </div>
        ) : this.state.readonly ? (
          ReadOnlyComponentRenderFactory.component(
            this.props.header.type,
            0,
            '',
            this.state.value,
          )
        ) : (
          <textarea
            value={this.state.value}
            placeholder={this.props.header.placeholder}
            className="other-option-textarea"
            onBlur={this.updateDetailsOnBlur}
            onChange={this.onChange}
          />
        )}
      </div>
    );
  }

  onChange = event => this.setState({ value: event.target.value });

  toggleInput = () => {
    this.setState({
      showInput: !this.state.showInput,
    });
  };

  updateDetailsOnBlur = () => {
    if (!this.state.value) {
      this.toggleInput();
    }
    if (this.existingValue !== this.state.value) {
      this.props.controller.onUpdate(
        this.props.header,
        this.state.value,
        () => {
          this.props.controller.eventListener(BULK_ACTIONS.RELOAD_STATE);
        },
      );
    }
  };
}
