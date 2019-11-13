import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../Loader';
import { COMMON_ACTIONS } from '../../common/constants';
import LabeledDropDown from '../LabeledDropDown';
import ReadOnlyComponentRenderFactory from '../ComponentFactory/readOnlyComponentFactory';
import { buildConditionalString } from '../../common/helpers';

import './MultiTypeSelect.scss';

export default class MultiTypeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.controller = props.dataHandler.getExistingData(this.props.header);
    this.state = {
      choices: [],
      isLoading: this.controller.isLoading,
      collapsed:
        this.props.header.collapsed === undefined
          ? true
          : this.props.header.collapsed,
    };
  }

  componentDidMount() {
    this.controller.register(this.eventListener);
  }

  render() {
    const renderChild = !(this.state.isLoading || this.state.collapsed);
    const childComponents = renderChild ? this.renderChildComponents() : [];
    return (
      <section
        className="multi-type-select-component"
        id={createIdentifier(this.props.header.title)}
        title={this.props.header.help_text}
      >
        <h4 className="heading" onClick={this.toggleCollapseState}>
          <i
            className={buildConditionalString(
              'icon icon-caret-right',
              '',
              this.state.collapsed,
              'open',
            )}
          />
          {this.props.header.title}
        </h4>
        {this.state.isLoading ? (
          <Loader display={this.state.isLoading} />
        ) : (
          <div className="wrapper">
            {renderChild &&
              (childComponents.length > 0
                ? childComponents
                : noDataMessage(this.controller))}
          </div>
        )}
      </section>
    );
  }

  componentWillUnmount() {
    this.controller.register(null);
  }

  eventListener = eventType => {
    if (eventType === COMMON_ACTIONS.REFRESH) {
      this.setState({
        choices: this.controller.getChoices(),
        isLoading: this.controller.isLoading,
      });
    }
  };

  toggleCollapseState = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  };

  renderChildComponents = () => {
    const childComponents = [];
    this.state.choices.forEach(choice => {
      const value = choice.selectedData && choice.selectedData.title;
      return (
        <div className="section-container">
          {choice.readonly
            ? value &&
              childComponents.push(
                ReadOnlyComponentRenderFactory.component(
                  choice.type,
                  0,
                  choice.title,
                  value,
                ),
              )
            : childComponents.push(getLabeledDropDown(this.controller, choice))}
        </div>
      );
    });
    return childComponents;
  };
}

MultiTypeSelect.propTypes = {
  dataHandler: PropTypes.object.isRequired,
  header: PropTypes.object.isRequired,
};

function createIdentifier(currentTitle) {
  return currentTitle && currentTitle.replace(/\s+/g, '').toLowerCase();
}

function getLabeledDropDown(controller, choice) {
  return (
    <LabeledDropDown
      key={choice.uid}
      header={choice}
      dataHandler={controller}
    />
  );
}

function noDataMessage(controller) {
  return (
    controller.noDataMessage && (
      <span className="readonly-subtitle">{controller.noDataMessage}</span>
    )
  );
}
