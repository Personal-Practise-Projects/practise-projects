import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectAll, selectRow, unSelectAll, unSelectRow } from './actions';
import CheckBoxView from '../CheckBoxView';
import { StringHelper } from '../../helpers/utils';
import { ALL_SELECT_TYPE } from '../CheckBoxView/constants';
import { getAllSelectState, getAllSelectTitle } from './helpers';

import './SelectItem.scss';

class SelectItem extends React.Component {
  constructor(props) {
    super(props);
    this.checkedClass = ALL_SELECT_TYPE.NONE;
    this.title = props.all && props.showTitle ? 'Select All' : '';
  }

  render() {
    this.checkedClass = this.getCheckedClass();
    this.title = this.getTitle();
    const isDisabled =
      this.props.isDisabled ||
      !(
        (this.props.all && this.props.item.length > 0) ||
        this.props.item.selectableData
      );
    return (
      <div className="select-item-component">
        <CheckBoxView
          className={StringHelper.format('heading ##', this.checkedClass)}
          isDisabled={isDisabled}
          onClickEvent={event => {
            event.stopPropagation();
            this.toggleSelect();
          }}
          title={this.title}
        />
      </div>
    );
  }

  getCheckedClass() {
    if (this.props.all) {
      return getAllSelectState(
        Object.keys(this.props.selectedItems).length,
        this.props.item.length,
      );
    }
    return this.props.selectedItems[this.props.item.id]
      ? ALL_SELECT_TYPE.ALL
      : ALL_SELECT_TYPE.NONE;
  }

  getTitle() {
    if (this.props.all && this.props.showTitle) {
      return getAllSelectTitle(Object.keys(this.props.selectedItems).length);
    }
    return '';
  }

  toggleSelect = () => {
    if (this.props.all) {
      this.checkedClass === ALL_SELECT_TYPE.NONE
        ? this.props.selectAll(
            this.props.header.type,
            this.props.item,
            this.props.parent,
          )
        : this.props.unSelectAll(this.props.header.type, this.props.parent);
    } else {
      this.checkedClass === ALL_SELECT_TYPE.NONE
        ? this.props.selectRow(
            this.props.header.type,
            this.props.item,
            this.props.parent,
          )
        : this.props.unSelectRow(
            this.props.header.type,
            this.props.item,
            this.props.parent,
          );
    }
  };
}

SelectItem.propTypes = {
  selectedItems: PropTypes.object,
  //If select all component need to show title then pass as true else no title will be display and only work with all true
  showTitle: PropTypes.bool,
  //If its a select all component provide true
  all: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  selectedItems:
    (state.selectedItems[ownProps.header.type] &&
      state.selectedItems[ownProps.header.type].dataDict[ownProps.parent]) ||
    {},
});

const mapDispatchToProps = {
  selectRow,
  selectAll,
  unSelectRow,
  unSelectAll,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectItem);
