import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import { openBulkUpdate } from '../../containers/BasePage/actions';
import { createBulkController } from './factory';

import './BulkActionButton.scss';

function BulkActionButton(props) {
  if (props.bulkHeaders && props.bulkHeaders.length > 0) {
    return (
      <Button
        key="schedulePage-leftHeader-typeButton"
        className="bulk-action-button-component ternary-cta"
        displayElement="Bulk actions"
        isDisabled={props.selectedItemCount <= 0}
        onClick={() => {
          props.openBulkUpdate(
            createBulkController(props.type, {
              bulkHeaders: [...props.bulkHeaders],
              selectedItems: props.selectedItems,
            }),
          );
        }}
      />
    );
  }
  return <React.Fragment />;
}

const mapStateToProps = (state, ownProps) => ({
  selectedItemCount: state.selectedItems[ownProps.type].count,
  selectedItems: state.selectedItems[ownProps.type].data,
  bulkHeaders: state.common[ownProps.type].bulkMeta[ownProps.page],
});

const mapDispatchToProps = {
  openBulkUpdate,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BulkActionButton);
