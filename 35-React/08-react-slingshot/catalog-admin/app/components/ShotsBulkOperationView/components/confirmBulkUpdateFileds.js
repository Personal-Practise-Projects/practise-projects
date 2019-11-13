import React from 'react';

import { BulkUpdateHeader } from './bulkUpdateHeader';
import { StringHelper } from '../../../helpers/utils';
import { Icon } from '../../Icon';

export const WARNING_MESSAGE =
  'Leaving fields blank will clear existing data in selected fields';

export default class ConfirmBulkFieldsComponent extends React.Component {
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
        <BulkUpdateHeader
          title="Apply bulk actions"
          subtitle={StringHelper.format(
            '## field(s) selected',
            this.state.controller.headers.length,
          )}
        />
        <div className="bulk-update-panel-content readonly-state">
          <h3 className="secondary-title">Bulk actions</h3>
          <div className="icon-wrapper">
            <Icon className="icon icon-exclamation-triangle" />
            {WARNING_MESSAGE}
          </div>
          {this.state.controller.headers.map(header =>
            this.state.controller.getComponent(header),
          )}
        </div>
      </React.Fragment>
    );
  }
}
