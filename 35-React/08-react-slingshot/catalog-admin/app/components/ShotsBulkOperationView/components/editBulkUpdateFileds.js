import React from 'react';

import ComponentRenderFactory from '../../ComponentFactory';
import { BulkUpdateHeader } from './bulkUpdateHeader';
import { StringHelper } from '../../../helpers/utils';

export default class EditBulkFieldsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      controller: props.controller,
    };
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
        <BulkUpdateHeader
          title="Apply bulk actions"
          subtitle={StringHelper.format(
            '## field(s) selected',
            this.state.controller.headers.length,
          )}
        />

        <div className="bulk-update-panel-content edit-state">
          <h3 className="secondary-title">Bulk actions</h3>
          {this.state.controller.headers.map((header, index) =>
            ComponentRenderFactory.component(
              header,
              index,
              this.state.controller,
            ),
          )}
        </div>
      </React.Fragment>
    );
  }
}
