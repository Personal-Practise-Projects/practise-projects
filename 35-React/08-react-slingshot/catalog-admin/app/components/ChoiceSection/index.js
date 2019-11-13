import React from 'react';
import { connect } from 'react-redux';

import PillIconChoice from '../PillIconChoice';
import ImageSelect from '../ImageSelect';
import { toggleConfirmDialog } from '../../containers/BasePage/actions';
import { ChoiceChangeConfirmation } from './choiceChangeConfirmation';

import './ChoiceSection.scss';
import { CHOICE_FIELDS, COMMON_ACTIONS, UPDATE_STATUS } from '../../common/constants';

const components = {
  imageSelect: ImageSelect,
  pillSelect: PillIconChoice,
};

class ChoiceSection extends React.Component {
  constructor(props) {
    super(props);
    this.controller = props.dataHandler.getExistingData({
      uid: CHOICE_FIELDS.CHOICE_SECTION,
    });
    this.state = {
      choices: {},
    };
    this.component = components[this.props.header.childComponent];
  }

  componentDidMount() {
    this.controller.setEventListener(this.eventListener);
    this.controller.getChoices(this.props.header, this.setData);
  }

  setData = results => {
    this.setState({
      choices: results,
      optionalInfo: this.controller.getOptionalInfo(this.props.header),
      ...this.controller.getExtraConfig(),
    });
  };

  render() {
    const { choices } = this.state;
    const Component = this.component;
    return (
      <div
        className={`choice-section-component ${this.props.header.classes ||
          ''}`}
      >
        <label className="title">{this.props.header.title}</label>
        <div className="wrapper">
          {Object.keys(choices).map((item, index) => {
            choices[item].readonly = this.state.readonly;
            return (
              Component && (
                <Component
                  key={index}
                  id={item}
                  item={choices[item]}
                  header={this.props.header}
                  controller={this.controller}
                />
              )
            );
          })}
        </div>
        {this.state.optionalInfo}
      </div>
    );
  }

  eventListener = type => {
    switch (type) {
      case COMMON_ACTIONS.TOGGLE_CONFIRM:
        this.props.toggleConfirmDialog(
          new ChoiceChangeConfirmation(this.eventListener),
        );
        break;
      case COMMON_ACTIONS.RELOAD_STATE:
        this.controller.getChoices(this.props.header, result => {
          this.setState({
            choices: result,
            optionalInfo: this.controller.getOptionalInfo(this.props.header),
          });
        });
        break;
      case COMMON_ACTIONS.CONFIRM_OK:
        this.props.toggleConfirmDialog();
        this.controller.onUpdate(
          this.props.header,
          this.controller.selectedValue,
          () => {
            this.eventListener(COMMON_ACTIONS.RELOAD_STATE);
          },
        );
        break;
      case UPDATE_STATUS:
        this.controller.getChoices(this.props.header, result => {
          this.setState({
            choices: result,
            optionalInfo: this.controller.getOptionalInfo(this.props.header),
          });
        });
        break;
    }
  };

  componentWillUnmount() {
    this.controller.setEventListener(null);
  }
}

const mapDispatchToProps = {
  toggleConfirmDialog,
};

export default connect(
  null,
  mapDispatchToProps,
)(ChoiceSection);
