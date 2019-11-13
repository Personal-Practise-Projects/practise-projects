import React from 'react';
import PropTypes from 'prop-types'
import { COMMON_ACTIONS } from "../../common/constants";
import { getComponent } from "./helper";

import './AddMoreItems.scss'

export default class AddMoreItems extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = props.dataHandler.getExistingData(this.props.header);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.state = {
      disableAddMore: this.dataHandler.disableAddMore(),
      itemsHandlers: [],
      ...extraConfig
    }
  }

  componentDidMount() {
    this.dataHandler.register(this.optionHeaderListener);
  }

  componentWillUnmount() {
    this.dataHandler.register();
  }

  render() {
    return (
      <div className="add-more-items">
        {this.getItems()}
        <button
          type="button"
          disabled={this.state.readonly || this.state.disableAddMore}
          className="btn addmore-button btn-link btn-add-row"
          onClick={() => {
            !this.state.readonly && this.dataHandler.onAction(COMMON_ACTIONS.CREATE_NEW);
          }}
        >
          <i className="icon-circle-plus"/> {this.dataHandler.addButtonTitle}
        </button>
        <span className="help-text d-block">
          {this.dataHandler.addMoreHelpText}
          </span>
      </div>
    )
  }

  getItems() {
    return this.state.itemsHandlers.map(itemsController => (
      getComponent(itemsController.uid, this.dataHandler.childHeader, itemsController)
    ));
  }

  optionHeaderListener = (itemsHandlers) => {
    this.setState({ itemsHandlers: itemsHandlers })
  };
}

AddMoreItems.propTypes = {
  dataHandler: PropTypes.object,
};
