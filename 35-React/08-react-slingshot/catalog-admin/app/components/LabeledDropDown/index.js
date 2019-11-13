import React from 'react';

import Img from '../Img';
import Loader from '../../images/common/loader-blue.svg';
import { showEllipsesText } from '../../helpers/uiUtils';
import OnClickOutside from '../OnClickOutside';
import { COMMON_ACTIONS } from '../../common/constants';

import './LabeledDropDown.scss';

/*
To make this component Searchable, set this.searchAPI variable the search action, else it works as normal dropdown.
 */
class LabeledDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.controller = props.dataHandler.getExistingData(props.header);
    this.searchAPI = this.controller.getSearchAPI
      ? this.controller.getSearchAPI(props.header)
      : null;
    this.state = {
      listOpen: false,
      selectedOption: props.header.selectedData,
      isSearching: false,
      searchValue: '',
      headerTitle: props.header.selectedData
        ? props.header.selectedData.title
        : props.header.placeholder,
    };
  }

  componentDidMount() {
    this.searchAPI && this.searchAPI.search();
  }

  render() {
    const { options, isSearching, headerTitle, searchValue } = this.state;
    const listOpen = !this.state.readonly && this.state.listOpen;
    return (
      <OnClickOutside callbackFn={this.handleOutsideClick}>
        <div
          className="labeled-dropdown-component"
          ref={node => {
            this.node = node;
          }}
        >
          {this.props.header.title && (
            <label className="dropdown-label">{this.props.header.title}</label>
          )}
          <div className={`dropdown-wrapper ${listOpen ? 'expanded' : ''}`}>
            <button
              type="button"
              className="dropdown-button"
              onClick={() => !this.state.readonly && this.toggleList()}
              disabled={this.state.readonly}
            >
              {headerTitle}
              {this.state.selectedOption && (
                <i
                  className="icon-cross clear-icon"
                  onClick={event => {
                    event.stopPropagation();
                    this.updateDetailsOnBlur(COMMON_ACTIONS.DELETE);
                  }}
                />
              )}
            </button>
            {listOpen &&
              dropDownOptions.call(
                this,
                searchValue,
                isSearching,
                options,
                this.state.selectedOption,
              )}
          </div>
        </div>
      </OnClickOutside>
    );
  }

  toggleList = () => {
    const listOpen = !this.state.listOpen;
    this.setState({ listOpen }, () => {
      if (listOpen) {
        this.getOptionsBySearch(this.state.searchValue);
      }
    });
  };

  onDropDownSelect = item => {
    this.toggleList();
    this.setState(
      {
        listOpen: false,
        selectedOption: item,
        headerTitle: item.title ? item.title : item.name,
      },
      () => {
        this.updateDetailsOnBlur(COMMON_ACTIONS.SELECT);
      },
    );
  };

  onSearchKeyEnter = event => {
    const { value } = event.target;
    this.setState({
      isSearching: true,
      searchValue: value,
    });
    setTimeout(() => {
      this.getOptionsBySearch(value);
    }, 500);
  };

  getOptionsBySearch = searchValue => {
    this.searchAPI.search(searchValue, [], (searchString, option) => {
      if (searchString === this.state.searchValue) {
        this.setState({
          options: option,
          isSearching: false,
        });
      }
    });
  };

  updateDetailsOnBlur = action => {
    const value =
      action === COMMON_ACTIONS.SELECT ? this.state.selectedOption : null;
    const header = this.props.header;
    this.controller.onAction(action, header, this.state.selectedOption, () => {
      this.setState({
        selectedOption: value,
        headerTitle: value ? value.title : header.placeholder,
      });
    });
  };

  handleOutsideClick = e => {
    if (!this.node || this.node.contains(e.target)) {
      return;
    }
    this.setState({ listOpen: false });
  };
}

export default LabeledDropDown;

let dropDownOptions = function(
  searchValue,
  isSearching,
  options,
  selectedOption,
) {
  return (
    <div className="dropdown-list">
      {this.searchAPI && (
        <div className="input-wrapper input-search position-relative">
          <i className="icon-search" />
          <input
            autoFocus
            value={searchValue}
            placeholder={this.props.header.placeholder}
            className="input-field"
            onChange={this.onSearchKeyEnter}
          />
        </div>
      )}
      {isSearching ? (
        <div className="option-loading d-flex align-items-center justify-content-center">
          <div className="flex-wrapper text-center">
            <Img src={Loader} alt="Loading" className="no-result-logo" />
            <span className="empty-body d-block">Loading...</span>
          </div>
        </div>
      ) : options && options.length > 0 ? (
        <React.Fragment>
          {options.map((item, index) => (
            <button
              onMouseEnter={event => showEllipsesText(event.currentTarget)}
              type="button"
              key={index}
              title={item.name}
              className={`dropdown-item d-block ${selectedOption &&
                (item.id === selectedOption.id ? 'active-item' : '')}`}
              onClick={() => this.onDropDownSelect(item)}
            >
              {item.name}
            </button>
          ))}
        </React.Fragment>
      ) : (
        <div className="dropdown-options">
          <button
            type="button"
            className="option-wrapper option-switched d-flex position-relative"
            disabled
          >
            No matches found
          </button>
        </div>
      )}
    </div>
  );
};
