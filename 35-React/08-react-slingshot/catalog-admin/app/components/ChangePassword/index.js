import React from 'react';
import { connect } from 'react-redux';
import { toggleConfirmDialog } from '../../containers/BasePage/actions';
import PasswordFeature from '../PasswordFeature';

import './ChangePassword.scss';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.headers = props.controller.getHeader();
  }

  render() {
    return (
      <div className="change-password-component">
        {this.headers.map(header => {
          return (
            <div className="input-field-container">
              <PasswordFeature
                header={header}
                dataHandler={this.props.controller}
              />
            </div>
          );
        })}
      </div>
    );
  }

  componentDidMount() {
    this.props.controller.setEventListener(this.props.toggleConfirmDialog);
  }

  componentWillUnmount() {
    this.props.controller.setEventListener(null);
  }
}

const mapDispatchToProps = {
  toggleConfirmDialog,
};

export default connect(
  null,
  mapDispatchToProps,
)(ChangePassword);
