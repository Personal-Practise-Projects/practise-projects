import React from 'react';
import './ColorToolTip.scss';

class ColorToolTip extends React.Component {
  constructor(props) {
    super(props);
    this.value = this.props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.state = {
      toolTipOpen: false,
      selectedColor: this.value,
      ...extraConfig
    };
  }

  componentDidMount() {
    this.props.dataHandler.getOptionalInfo(this.props.header, this.setOptions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.options !== nextState.options ||
      this.state.toolTipOpen !== nextState.toolTipOpen ||
      this.state.selectedColor !== nextState.selectedColor
    );
  }

  onClick = () => {
    this.toggleDropDown(!this.state.toolTipOpen);
  };

  setOptions = options => {
    this.setState({
      options,
    });
  };

  render() {
    const { toolTipOpen, options, selectedColor } = this.state;
    return options ? (
      <div
        className={
          toolTipOpen
            ? 'color-tooltip position-relative tooltip-expanded'
            : 'color-tooltip position-relative tooltip-collapsed'
        }
      >
        <button
          type="button"
          disabled={this.state.readonly}
          className="color-tooltip-trigger position-relative"
          onClick={() => !this.state.readonly && this.onClick()}
        >
          <span
            className="color-tooltip-selection"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="color-tooltip-title">{this.props.header.title}</span>
          <span className="color-tooltip-description">
            {this.props.header.placeholder}
          </span>
        </button>
        {!this.state.readonly && this.state.toolTipOpen &&
          this.getColorDropDown(options, selectedColor)}
      </div>
    ) : (
      ''
    );
  }

  getColorDropDown = (options, selectedColor) => (
    <div className="color-tooltip-drawer" ref={node => (this.node = node)}>
      <div className="color-tooltip-header">
        <h4>Color labels</h4>
      </div>
      <div className="color-tooltip-content">
        <div className="color-row">
          {options.map((color, index) => (
            <div className="color-square position-relative" key={index}>
              <label
                className={
                  selectedColor === color.name
                    ? 'color-square-label checked-color'
                    : 'color-square-label'
                }
                style={{ backgroundColor: color.name }}
                onClick={event => {
                  event.preventDefault();
                  this.onToolTipSelect(color);
                }}
              >
                <i className="icon-checkmark" />
                <input type="checkbox" className="color-square-input" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  onToolTipSelect = color => {
    if (color.name === this.state.selectedColor) {
      this.setState({
        selectedColor: '#8169ea',
        selectedColorId: null,
      });
    } else {
      this.setState({
        selectedColor: color.name,
        selectedColorId: color.id,
      });
    }
  };

  handleClickOutside = event => {
    if (!this.node || this.node.contains(event.target)) {
      // Click was inside the scope - Terminate Action
      return;
    }

    // Click was outside the scope - Continue Processing
    this.toggleDropDown(false);
  };

  updateDetailsOnBlur = () => {
    const value = this.state.selectedColorId;
    const header = this.props.header;
    this.props.dataHandler.onUpdate(header, value, () => {});
  };

  toggleDropDown = isOpen => {
    this.setState({ toolTipOpen: isOpen }, () => {
      if (isOpen) {
        document.addEventListener('mousedown', this.handleClickOutside, false);
      } else {
        document.removeEventListener(
          'mousedown',
          this.handleClickOutside,
          false,
        );
        if (this.value !== this.state.selectedColor) {
          this.updateDetailsOnBlur();
          this.value = this.state.selectedColor;
        }
      }
    });
  };
}

export default ColorToolTip;
