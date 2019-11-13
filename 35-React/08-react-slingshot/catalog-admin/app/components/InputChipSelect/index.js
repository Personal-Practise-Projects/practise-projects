import React from 'react';
import InputChipSelectOption from '../InputChipSelectOption';
import { StringHelper } from "../../helpers/utils";
import ReadOnlyComponentRenderFactory from "../ComponentFactory/readOnlyComponentFactory";

import './InputChipSelect.scss';

/** *
 * Options should contains
 * {
 *  id: {id of options if any },
 *  name: {display name mandatory},
 *  thumbnail: {display image}
 * }
 */
// TODO Do not make call if nothing has changed.
export default class InputChipSelect extends React.Component {
  constructor(props) {
    super(props);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.state = {
      listOpen: false,
      inputValue: '',
      searchAPI: props.dataHandler.getSearchAPI(props.header),
      selectedOptions: props.dataHandler.getExistingData(props.header),
      options: [],
      isRemovable:
        props.header.isRemovable === undefined
          ? true
          : props.header.isRemovable,
      isSearching: false,
      allowedOne: props.header.allowedOne,
      ...extraConfig
    };
  }

  render() {
    const { placeholder, title } = this.props.header;
    const {
      listOpen,
      options,
      selectedOptions,
      inputValue,
      isRemovable,
      isSearching,
    } = this.state;
    if (this.state.readonly) {
      const selectedValues = selectedOptions && selectedOptions.map(option => option.name) || [];
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type, 0, title, selectedValues.join(', ') || this.state.readPlaceholder
      )
    }
    const isAllowedOneClass = this.getAllowedOneClass();
    return (
      <div className="input-wrapper">
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
            {selectedOptions &&
              selectedOptions.map((option, index) => (
                <div className="pill d-inline-block" key={index}>
                  {option.name}
                  {isRemovable && (
                    <i
                      className="icon-cross"
                      onClick={() => this.deleteSelectedOption(option)}
                    />
                  )}
                </div>
              ))}
            <input
              className={StringHelper.format('dropdown-input d-inline-block ##', isAllowedOneClass)}
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
      </div>
    );
  }

  getAllowedOneClass() {
    return (
      this.state.allowedOne && this.state.selectedOptions && this.state.selectedOptions.length > 0
    ) ? 'invisible' : '';
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

  getOptionsBySearch = inputValue => {
    if (this.state.searchAPI) {
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
    } else {
      this.setState({
        options: [],
        isSearching: false,
      });
    }
  };

  handleClickOutside = () => {
    this.setState({
      listOpen: false,
      isSearching: false,
      inputValue: '',
    });
    if (!this.props.header.updateOnSelect)
      this.updateWithLatestResult(this.state.selectedOptions);
  };

  deleteSelectedOption = option => {
    const { selectedOptions } = this.state;
    const options = selectedOptions.filter(item => item.id !== option.id);
    this.setState({
      selectedOptions: options,
      listOpen: false,
    });
    this.props.dataHandler.onDelete(this.props.header, option, () => {});
  };

  updateWithLatestResult = options =>
    this.props.dataHandler.onUpdate(this.props.header, options, () => {});

  onDropDownSelect = option => {
    if (option.id === 0) {
      this.state.searchAPI.create(option, addedOption => {
        const selectedOptions = [...this.state.selectedOptions, addedOption];
        this.updateState(false, selectedOptions, '');
      });
    } else {
      const selectedOptions = [...this.state.selectedOptions, option];
      this.updateState(false, selectedOptions, '');
    }
    if (this.props.header.updateOnSelect) this.updateWithLatestResult(option);
  };

  updateState = (listOpen, selectedOptions, inputValue) => {
    this.setState(prevState => ({
      listOpen,
      selectedOptions,
      inputValue,
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
