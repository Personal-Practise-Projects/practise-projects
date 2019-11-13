import React from 'react';
import { buildConditionalString } from '../../common/helpers';
import ReadOnlyComponentRenderFactory from '../ComponentFactory/readOnlyComponentFactory';

import './Select.scss';

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig
      ? props.dataHandler.getExtraConfig(props.header)
      : {};
    this.state = {
      // TO be implement this feature currently it is by default changeable
      selectedOption: this.value,
      changeable:
        props.header.changeable === undefined || props.header.changeable,
      listOpen: false,
      headerTitle:
        this.props.dataHandler.getDropDownTitle(
          this.props.header,
          this.value,
        ) || props.header.placeholder,
      ...extraConfig,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
    this.props.dataHandler.getOptionalInfo(this.props.header, this.setOptions);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  render() {
    const enableTrigger = this.isAllowedToChange();
    if (this.state.readonly) {
      return ReadOnlyComponentRenderFactory.component(
        this.props.header.type,
        0,
        this.props.header.title,
        this.state.headerTitle || this.state.readPlaceholder,
      );
    }
    return (
      <React.Fragment>
        {this.props.header.title && (
          <label className="input-label d-block">
            {this.props.header.title}
          </label>
        )}
        <div
          className={
            this.state.listOpen
              ? 'open-select position-relative'
              : 'collapsed-select position-relative'
          }
          ref={node => {
            this.node = node;
          }}
        >
          {// If trigger is enable show trigger button else show as title
          enableTrigger ? (
            <button
              type="button"
              className={
                this.props.header.placeholder === this.state.headerTitle
                  ? 'select-trigger d-block rubik-semibold placeholder'
                  : 'select-trigger d-block rubik-semibold'
              }
              onClick={() => this.toggleList()}
            >
              {this.state.headerTitle}
            </button>
          ) : (
            <span className="select-trigger-disable d-block rubik-semibold">
              {this.state.headerTitle}
            </span>
          )}
          {this.getDropdownChoices(enableTrigger)}
        </div>
      </React.Fragment>
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

  updateDetailsOnBlur = () => {
    const value = this.state.selectedOption;
    const header = this.props.header;
    this.props.dataHandler.onUpdate(header, value, () => {
      this.checkStateRefresh();
    });
  };

  isAllowedToChange = () =>
    this.state.changeable &&
    (!this.state.selectedOption || !this.state.readonly);

  getDropdownChoices(enableTrigger) {
    return (
      enableTrigger &&
      this.state.options &&
      this.state.options.length > 0 && (
        <div className="select-drawer">
          {this.state.options.map((item, index) => (
            <button
              type="button"
              key={index}
              title={item.title ? item.title : item.name}
              className={buildConditionalString(
                'select-item d-block',
                'select-active-item',
                item.id === this.state.selectedOption,
              )}
              onClick={() => this.onDropDownSelect(item)}
            >
              {item.title ? item.title : item.name}
            </button>
          ))}
        </div>
      )
    );
  }

  checkStateRefresh = () => {
    const extraConfig = this.props.dataHandler.getExtraConfig
      ? this.props.dataHandler.getExtraConfig(this.props.header)
      : {};

    const changed = Object.keys(extraConfig).find(
      key => extraConfig[key] !== this.state[key],
    );
    if (changed) {
      this.setState({
        ...extraConfig,
      });
    }
  };
}

export default Select;
