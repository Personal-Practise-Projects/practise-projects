import React from 'react';
import InputChipSelectOption from '../../components/InputChipSelectOption';
import { StringHelper } from '../../helpers/utils';
import ReadOnlyComponentRenderFactory from '../../components/ComponentFactory/readOnlyComponentFactory';

import './SearchableDropDown.scss';
import { DONE } from '../../common/constants';

/** *
 * Options should contains
 * {
 *  id: {id of options if any },
 *  name: {display name mandatory},
 *  thumbnail: {display image}
 * }
 */
export default class SearchableDropDown extends React.Component {
  constructor(props) {
    super(props);
    const extraConfig = props.dataHandler.getExtraConfig
      ? props.dataHandler.getExtraConfig(props.header)
      : {};
    this.state = {
      listOpen: false,
      inputValue: '',
      searchAPI: props.dataHandler.getSearchAPI(props.header),
      selectedValue: props.dataHandler.getExistingData(props.header),
      options: [],
      isSearching: false,
      isRemovable:
        undefined === props.header.isRemovable || props.header.isRemovable,
      isError: false,
      errorMessage: '',
      ...extraConfig,
    };
  }

  render() {
    const { placeholder, title } = this.props.header;
    const {
      listOpen,
      options,
      selectedValue,
      inputValue,
      isSearching,
      isError,
      errorMessage,
    } = this.state;
    const isAllowedOneClass = selectedValue ? 'invisible' : '';
    if (this.state.readonly) {
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type,
        0,
        title,
        (this.state.selectedValue && this.state.selectedValue.name) || this.state.readPlaceholder,
      );
    }
    return (
      <div className={`input-wrapper ${isError && 'error-wrapper'}`}>
        <label className="input-label d-block">{title}</label>
        <div
          onBlur={this.handleClickOutside}
          className={
            listOpen
              ? 'dropdown dropdown-expanded'
              : 'dropdown dropdown-collapsed'
          }
        >
          <div className="dropdown-display">
            {this.state.selectedValue && (
              <div
                className="pill d-inline-block"
                key={this.state.selectedValue.id}
              >
                {this.state.selectedValue.name}
                {this.state.isRemovable && (
                  <i
                    className="icon-cross"
                    onClick={() => this.clearSelection()}
                  />
                )}
              </div>
            )}
            <input
              className={StringHelper.format(
                'dropdown-input d-inline-block ##',
                isAllowedOneClass,
              )}
              type="text"
              value={inputValue || ''}
              onClick={this.toggleList}
              onChange={this.onOptionSearch}
              placeholder={placeholder}
            />
          </div>
          <InputChipSelectOption
            options={options}
            isSearching={isSearching}
            optionSelected={this.isOptionSelected}
            onDropDownSelect={this.onDropDownSelect}
          />
        </div>
        {isError && (
          <span className="validation-message error-message red-error">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }

  toggleList = () => {
    this.setState({
      listOpen: true,
      isSearching: true,
    });
    this.getOptionsBySearch('');
  };

  onOptionSearch = event => {
    const { value } = event.target;
    this.setState({
      isSearching: true,
      listOpen: true,
      inputValue: value,
    });
    setTimeout(() => {
      this.getOptionsBySearch(value);
    }, 500);
  };

  clearSelection = () => {
    this.setState({
      selectedValue: null,
      listOpen: false,
    });
    this.props.dataHandler.onDelete(this.props.header);
  };

  getOptionsBySearch = inputValue => {
    this.state.searchAPI.search(
      inputValue,
      this.state.selectedOptions,
      (searchString, option) => {
        if (searchString === this.state.inputValue) {
          this.setState({
            options: option,
            isSearching: false,
          });
        }
      },
    );
  };

  handleClickOutside = () => {
    this.setState({
      listOpen: false,
      isSearching: false,
      inputValue: '',
    });
  };

  onDropDownSelect = option => {
    if (option.id === 0) {
      this.state.searchAPI.create(option, (status, addedOption) => {
        if (status === DONE) {
          this.updateState(false, addedOption, '');
          this.props.dataHandler.onUpdate(
            this.props.header,
            addedOption,
            () => {},
          );
        } else {
          this.setState({
            listOpen: false,
            isError: true,
            errorMessage: addedOption.data[this.props.header.data_key][0],
          });
        }
      });
    } else {
      this.updateState(false, option, '');
      this.props.dataHandler.onUpdate(this.props.header, option, () => {});
    }
  };

  updateState = (listOpen, selectedValue, inputValue) => {
    this.setState(prevState => ({
      listOpen,
      selectedValue,
      inputValue,
      isError: false,
    }));
  };

  isOptionSelected = option => {
    if (this.props.header.canReselect) return false;
    return (
      this.state.selectedOptions &&
      this.state.selectedOptions.some(item => item.id === option.id)
    );
  };
}
