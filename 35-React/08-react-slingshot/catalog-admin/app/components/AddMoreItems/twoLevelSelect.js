import React from 'react';
import Select from '../Select';
import InputChipSelect from '../InputChipSelect';

import './AddMoreItems.scss';
import ReadOnlyComponentRenderFactory from "../ComponentFactory/readOnlyComponentFactory";

export const ACTIONS = {
  REFRESH: 'REFRESH',
  DELETE: 'DELETE',
};
export default class TwoLevelSelect extends React.Component {
  constructor(props) {
    super(props);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.state = {
      showLevelTwo: this.props.dataHandler.showLevelTwo,
      ...extraConfig
    };
  }

  componentDidMount() {
    this.props.dataHandler.setEventListener(this.onActions);
  }

  render() {
    const childHeaders = this.props.dataHandler.getChildHeader();
    if (this.state.readonly) {
      const title = this.props.dataHandler.getExistingData();
      const children = this.props.dataHandler.getExistingData(childHeaders);
      const selectedValues = children && children.map(option => option.name) || [];
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type, 0, title,
        selectedValues.join(', ') || this.state.readPlaceholder
      )
    }
    return (
      <div className="child-parent">
        <div className="d-flex align-items-center justify-content-between">
          <Select
            header={this.props.header}
            dataHandler={this.props.dataHandler}
          />
          <button
            type="button"
            className="btn btn-close"
            title=""
            onClick={() => this.onActions(ACTIONS.DELETE)}
          >
            <i className="icon-cross" />
          </button>
        </div>
        {this.state.showLevelTwo && (
          <div className="child-box">
            <InputChipSelect
              header={childHeaders}
              dataHandler={this.props.dataHandler}
            />
          </div>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    this.props.dataHandler.setEventListener(null);
  }

  onActions = action => {
    switch (action) {
      case ACTIONS.REFRESH:
        this.setState({ showLevelTwo: this.props.dataHandler.showLevelTwo });
        break;
      case ACTIONS.DELETE:
        this.props.dataHandler &&
          this.props.dataHandler.onDelete(this.props.header);
        break;
    }
  };
}
