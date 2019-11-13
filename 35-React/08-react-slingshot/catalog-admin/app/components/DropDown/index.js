import React from 'react';

import Img from '../Img';
import Loader from '../../images/common/loader-blue.svg';
import styles from './Dropdown.scss';
import { buildConditionalString } from '../../common/helpers';
import { StringHelper } from '../../helpers/utils';
import { showEllipsesText } from '../../helpers/uiUtils';

/*
To make this component Searchable, set this.searchAPI variable the search action, else it works as normal dropdown.
 */
class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.searchAPI = props.dataHandler.getSearchAPI
      ? props.dataHandler.getSearchAPI(props.header)
      : null;
    this.value = props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig
      ? props.dataHandler.getExtraConfig(props.header)
      : {};
    this.state = {
      // TO be implement this feature currently it is by default changeable
      changeable: props.header.changeable || true,
      listOpen: false,
      selectedOption: this.value,
      isSearching: false,
      inputValue: '',
      headerTitle: props.header.title,
      ...extraConfig,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
    this.searchAPI && this.searchAPI.search();
    this.props.dataHandler.getOptionalInfo(this.props.header, this.setOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  render() {
    const {
      options,
      isSearching,
      selectedOption,
      headerTitle,
      inputValue,
    } = this.state;
    const listOpen = !this.state.readonly && this.state.listOpen;
    const className = buildConditionalString(
      'searchable-dropdown position-relative ',
      'expanded-dropdown',
      listOpen,
      'collapsed-dropdown',
    );
    return (
      <div
        className={className}
        ref={node => {
          this.node = node;
        }}
        style={styles}
      >
        <button
          type="button"
          className={StringHelper.format(
            'dropdown-trigger d-block rubik-semibold ##',
            this.props.dataHandler.displayChildClassRenderer &&
              this.props.dataHandler.displayChildClassRenderer(
                this.props.header,
                this.state.selectedOption,
              ),
          )}
          onClick={() => !this.state.readonly && this.toggleList()}
          disabled={this.state.readonly}
        >
          {headerTitle}
        </button>
        {listOpen && (
          <div className="dropdown-drawer">
            {this.searchAPI && (
              <div className="input-wrapper input-search position-relative">
                <i className="icon-search" />
                <input
                  value={inputValue}
                  placeholder={this.props.header.placeholder}
                  className="input-field"
                  onChange={this.onOptionSearch}
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
                    onMouseEnter={event =>
                      showEllipsesText(event.currentTarget)
                    }
                    type="button"
                    disabled={item.disabled}
                    key={index}
                    title={item.title ? item.title : item.name}
                    className={`dropdown-item d-block ${selectedOption &&
                      (item.id === selectedOption ? 'active-item' : '')}`}
                    onClick={() => this.onDropDownSelect(item)}
                  >
                    {item.title ? item.title : item.name}
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
        )}
      </div>
    );
  }

  setOptions = options => {
    this.setState(
      {
        options,
        isSearching: false,
      },
      () => {
        this.setTitle();
      },
    );
  };

  handleClickOutside = e => {
    if (!this.node || this.node.contains(e.target)) {
      return;
    }
    this.setState({
      listOpen: false,
    });
  };

  toggleList = () => {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen,
    }));
  };

  setTitle = () => {
    const headerTitle = this.props.dataHandler.getDropDownTitle(
      this.props.header,
      this.value,
    );

    if (headerTitle)
      this.setState({
        headerTitle,
      });
  };

  onDropDownSelect = item => {
    this.toggleList();
    this.setState(
      {
        listOpen: false,
        selectedOption: item.id,
        headerTitle: item.title ? item.title : item.name,
      },
      () => {
        this.updateDetailsOnBlur();
      },
    );
  };

  onOptionSearch = event => {
    const { value } = event.target;
    this.setState({
      isSearching: true,
      inputValue: value,
    });
    setTimeout(() => {
      this.getOptionsBySearch(value);
    }, 500);
  };

  getOptionsBySearch = inputValue => {
    this.searchAPI.search(inputValue, [], (searchString, option) => {
      if (searchString === this.state.inputValue) {
        this.setState({
          options: option,
          isSearching: false,
        });
      }
    });
  };

  updateDetailsOnBlur = () => {
    const value = this.state.selectedOption;
    const header = this.props.header;
    this.props.dataHandler.onUpdate(header, value, () => {});
  };
}

export default DropDown;
