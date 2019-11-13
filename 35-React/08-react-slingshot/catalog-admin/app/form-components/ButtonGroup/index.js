import React from 'react';
// Import Component Specific Styling
import './ButtonGroup.scss';
import { buildConditionalString } from '../../common/helpers';

class ButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    const value = props.dataHandler.getExistingData(props.header);
    this.state = {
      selectedItem: value,
      buttonList: null,
    };
  }

  componentDidMount() {
    this.props.dataHandler.getButtonGroups(this.setButtonList);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const value = nextProps.dataHandler.getExistingData(nextProps.header);
    if (value !== prevState.selectedItem) {
      return { selectedItem: value };
    }
    return {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.selectedItem !== this.state.selectedItem ||
      this.state.buttonList !== nextState.buttonList
    );
  }

  setButtonList = buttonList => {
    this.setState({
      buttonList,
    });
  };

  render() {
    const { classes } = this.props;
    const { selectedItem, buttonList } = this.state;

    return (
      <div className={`btn-group ${classes}`}>
        {buttonList &&
          buttonList.map((button, index) => (
            <button
              key={index}
              type="button"
              className={buildConditionalString(
                'btn btn-primary',
                'active',
                selectedItem.id === button.id,
              )}
              onClick={() => this.onItemSelect(button)}
            >
              {button.label}
            </button>
          ))}
      </div>
    );
  }

  onItemSelect = selectedData => {
    // Keep selected state of button also in redux instead of getting this from data handler
    this.setState({ selectedItem: selectedData });
    this.props.dataHandler.onUpdate(this.props.header, selectedData, () => {});
  };
}

export default ButtonGroup;
