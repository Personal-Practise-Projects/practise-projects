import React from 'react';
import CheckBoxView from '../CheckBoxView';
import './NestedCheckBox.scss';
import { StringHelper } from '../../helpers/utils';
import { ALL_SELECT_TYPE } from '../CheckBoxView/constants';

const ACTION_TYPE = {
  TOGGLE_ALL: 'TOGGLE_SELECT_ALL',
  SELECT: 'SELECT',
};

export default class NestedCheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choices: [],
      allSelectType: ALL_SELECT_TYPE.NONE,
    };
  }

  componentDidMount() {
    this.props.controller.fetchChoices(this.props.header, choices => {
      this.setState({
        choices,
        allSelectType: __getAllSelectState(choices),
      });
    });
  }

  render() {
    return this.state.choices ? (
      <div className="nested-checkbox">
        <CheckBoxView
          title={this.props.header.title}
          onClickEvent={() => {
            this.onEventListener(ACTION_TYPE.TOGGLE_ALL);
          }}
          className={StringHelper.format(
            'heading ##',
            this.state.allSelectType,
          )}
        />
        <div className="wrapper">
          {this.state.choices.map(choice => (
            <CheckBoxView
              title={choice.title}
              isChecked={choice.checked}
              onClickEvent={() => {
                this.onEventListener(ACTION_TYPE.SELECT, choice);
              }}
            />
          ))}
        </div>
      </div>
    ) : (
      <React.Fragment />
    );
  }

  onEventListener = (eventType, data) => {
    const existingSelectStatus = this.state.allSelectType;
    let allSelectType = ALL_SELECT_TYPE.NONE;
    if (eventType === ACTION_TYPE.TOGGLE_ALL) {
      allSelectType = __toggleAllChoices(
        this.__isSelectAll(),
        this.state.choices,
      );
    } else if (data) {
      __toggleChoiceSelection(!data.checked, data);
      allSelectType = __getAllSelectState(this.state.choices);
    }
    if (
      [existingSelectStatus, allSelectType].indexOf(ALL_SELECT_TYPE.NONE) !== -1
    ) {
      this.props.controller.onUpdate(this.props.header);
    }
    this.setState({ allSelectType });
  };

  __isSelectAll = () => this.state.allSelectType === ALL_SELECT_TYPE.NONE;
}

function __toggleAllChoices(isSelected, choices) {
  choices.map(choice => {
    __toggleChoiceSelection(isSelected, choice);
  });
  return isSelected ? ALL_SELECT_TYPE.ALL : ALL_SELECT_TYPE.NONE;
}

function __toggleChoiceSelection(isSelected, choice) {
  isSelected ? choice.onSelected() : choice.onUnselected();
}

function __getAllSelectState(choices) {
  const selectedDropDownCount = choices.filter(choice => choice.checked).length;
  let allSelectType = ALL_SELECT_TYPE.PARTIAL;
  if (selectedDropDownCount === 0) {
    allSelectType = ALL_SELECT_TYPE.NONE;
  } else if (selectedDropDownCount === choices.length) {
    allSelectType = ALL_SELECT_TYPE.ALL;
  }
  return allSelectType;
}
