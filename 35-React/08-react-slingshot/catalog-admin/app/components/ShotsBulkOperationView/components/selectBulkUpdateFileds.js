import React from 'react';
import { BulkUpdateHeader } from './bulkUpdateHeader';
import { getBulkSelectComponent } from "./Factory";

export default class SelectBulkFieldsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { controller: props.controller };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.controller !== nextProps.controller ||
      prevState.controller.headers !== nextProps.controller.headers
    ) {
      return { controller: nextProps.controller };
    }
    return {};
  }

  render() {
    return (
      <React.Fragment>
        <BulkUpdateHeader title="Apply bulk actions" />
        <div className="bulk-update-panel-content">
          <h3 className="secondary-title">Bulk actions</h3>
          {this.state.controller.headers.map(header => (
            getBulkSelectComponent(header, this.state.controller)
          ))}
        </div>
      </React.Fragment>
    );
  }
}
