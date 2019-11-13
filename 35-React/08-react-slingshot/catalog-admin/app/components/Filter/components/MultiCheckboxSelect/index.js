import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { StringHelper } from '../../../../helpers/utils';
import CheckBoxView from '../../../CheckBoxView';
import NoOptions from '../NoOptions';

// Component Specific Styles
import './MultiCheckboxSelect.scss';

class MultiCheckboxSelect extends React.Component {
  constructor(props) {
    super(props);
    props.controller.setData(props.choices, this.reRender);
    props.controller.getExistingData();
  }

  render() {
    return this.props.controller.choices &&
      this.props.controller.choices.length > 0 ? (
      <div className="multi-checkbox-select-component">
        <h1 className="title">
          {this.props.controller.filterConfig.select_title}
        </h1>
        <div className="wrapper">
          {this.props.controller.choices.map(choice => (
            <CheckBoxView
              key={StringHelper.format('##_##', choice.id, choice.checked)}
              title={choice.title}
              isChecked={choice.checked}
              onClickEvent={() => {
                this.props.controller.eventListener(choice);
              }}
            />
          ))}
        </div>
      </div>
    ) : (
      <NoOptions />
    );
  }

  reRender = () => {
    this.setState({});
  };
}

MultiCheckboxSelect.propTypes = {
  choices: PropTypes.array.isRequired,
  controller: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  choices:
    state.filters[state.filters.activeScreen].filterData[
      ownProps.controller.filterConfig.data_key
    ],
});

export default connect(mapStateToProps)(MultiCheckboxSelect);
