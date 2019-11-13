import React from 'react';
import Select from '../Select';

import './AddMoreItems.scss';

const ACTIONS = {
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};
export default class TypeQuantitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: this.props.dataHandler.count || 0,
    };
  }

  render() {
    return (
      <div className="row row-container">
        <div className="col-sm-9">
          <Select
            header={this.props.header}
            dataHandler={this.props.dataHandler}
          />
        </div>
        <input
          type="number"
          className="input-field col-sm-2"
          value={this.state.currentCount}
          min={this.props.dataHandler.minValue}
          onChange={event => {
            this.setState({ currentCount: event.target.value });
          }}
          onBlur={() => this.onActions(ACTIONS.UPDATE)}
        />
        <button
          type="button"
          className="btn btn-close col-sm-1"
          title=""
          onClick={() => this.onActions(ACTIONS.DELETE)}
        >
          <i className="icon-cross" />
        </button>
      </div>
    );
  }

  onActions = action => {
    switch (action) {
      case ACTIONS.UPDATE:
        this.props.dataHandler &&
          this.props.dataHandler.onUpdate(
            { uid: '#count' },
            { count: parseInt(this.state.currentCount) },
          );
        break;
      case ACTIONS.DELETE:
        this.props.dataHandler &&
          this.props.dataHandler.onUpdate({ uid: '#delete' });
        break;
    }
  };
}
