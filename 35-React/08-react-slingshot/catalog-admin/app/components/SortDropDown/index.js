import React from 'react';
import { connect } from 'react-redux';

import MenuDropDown from '../../form-components/MenuDropDown';
import { applySort, reverseSort } from './actions';

import './SortDropDown.scss';

class SortDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.title = 'Sort';
    this.state = {
      selectedOption: {},
    };
  }

  // eslint-disable-next-line consistent-return
  render() {
    if (this.props.sortDetails && this.props.sortDetails.length > 0) {
      const items = this.props.sortDetails.map(sortTypeObj => ({
        type: 'plain_item',
        action: () => {
          this.setState({
            selectedOption: sortTypeObj,
          });
          this.props.applySort({
            activeScreen: this.props.metaInfo.activeScreen,
            stage:
              this.props.metaInfo.stage || this.props.metaInfo.activeScreen,
            activeScreenType: this.props.metaInfo.activeScreenType,
            data: sortTypeObj,
          });
        },
        title: sortTypeObj.title,
        className:
          this.state.selectedOption.type === sortTypeObj.type ? 'active' : '',
      }));

      return (
        <div className="sort-dropdown-component">
          <MenuDropDown items={items}>
            <p className="header-sort-title">{this.title}</p>
          </MenuDropDown>
          <i
            className="header-sort-icon"
            onClick={() => {
              this.props.reverseSort({
                activeScreen: this.props.metaInfo.activeScreen,
                activeScreenType: this.props.metaInfo.activeScreenType,
              });
            }}
            role="menu"
            tabIndex={0}
          />
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  sortDetails:
    state.sort[ownProps.metaInfo.stage || ownProps.metaInfo.activeScreen]
      .availableOptions,
});

const mapDispatchToProps = {
  reverseSort,
  applySort,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortDropDown);
