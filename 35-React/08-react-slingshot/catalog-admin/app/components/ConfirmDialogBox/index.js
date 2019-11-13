import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

import './ConfirmDialogBox.scss';
import Button from '../Button';
import { toggleConfirmDialog } from '../../containers/BasePage/actions';

class ConfirmDialogBox extends React.Component {
  componentDidMount() {
    this.props.controller.stateEventListener &&
      this.props.controller.stateEventListener(this.eventListener);
  }

  componentWillUnmount() {
    this.props.controller.stateEventListener &&
      this.props.controller.stateEventListener(null);
  }

  render() {
    const controller = this.props.controller;
    return (
      <Modal
        show={controller}
        centered
        backdrop={false}
        dialogClassName="confirm-dialog-box-component"
      >
        {controller && (
          <React.Fragment>
            {this.props.title && <Modal.Title>{this.props.title}</Modal.Title>}
            <Modal.Body>{controller.getChildren()}</Modal.Body>
            <Modal.Footer>
              <Button
                displayElement="Cancel"
                className="secondary-cta"
                onClick={() => {
                  this.props.toggleConfirmDialog();
                }}
              />
              {controller.getFooterConfig().map(header => (
                <Button
                  displayElement={header.title}
                  isDisabled={header.isDisabled}
                  className="primary-cta"
                  onClick={() => {
                    this.props.controller.eventListener(
                      header.actionType,
                      response => {
                        if (response) {
                          this.props.toggleConfirmDialog();
                        }
                      },
                    );
                  }}
                />
              ))}
            </Modal.Footer>
          </React.Fragment>
        )}
      </Modal>
    );
  }

  eventListener = () => {
    this.setState({});
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  toggleConfirmDialog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmDialogBox);
