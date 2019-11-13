import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EditContentVariant from './EditContentVariant';
import { EmptyEditState } from './EmptyEditState';
import { EVENT_ACTION } from '../common/constants';

import { CALLBACK_EVENTS } from '../DataHandler/base';
import Logger from '../../../logging/logger';

import './EditImageComponent.scss';

const logger = Logger.createLogger();

class EditImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.injector = this.props.injector;
    this.state = { editedData: [] };
  }

  componentDidMount() {
    this.injector.setCallbackReceiver(this.onCallbackReceived);
    this.injector.getRecent();
  }

  componentWillUnmount() {
    this.injector.setCallbackReceiver(null);
  }

  render() {
    return (
      <div className="edit-photos">
        {this.state.editedData && this.state.editedData.length ? (
          <React.Fragment>
            <div className="edit-photos-header d-flex align-items-center">
              <div className="edit-photos-title">
                <b>Original</b> - CR2, RAW
              </div>
              <div className="edit-photos-title">
                <b>Edited</b> - PSD or TIFF with layers
              </div>
              <div className="edit-photos-title">
                <b>Edited</b> - JPG, PNG
              </div>
              <div className="edit-photos-title">
                <b>Editing notes</b>
              </div>
            </div>
            <div className="edit-photos-content">
              {this.state.editedData.map((data, index) => (
                <EditContentVariant
                  key={data.id}
                  index={index}
                  data={data}
                  injector={this.injector}
                />
              ))}
            </div>
          </React.Fragment>
        ) : (
          <EmptyEditState />
        )}
      </div>
    );
  }

  onCallbackReceived = (eventType, data) => {
    switch (eventType) {
      case CALLBACK_EVENTS.DATA_RECEIVED:
        this.setState({ editedData: data });
        break;
      case EVENT_ACTION.ORIGINAL_IMAGE_REMOVED:
        const editedData = this.state.editedData.filter(
          ShotData => ShotData.id !== data,
        );
        this.setState({ editedData });
        break;
      default:
        logger.log(`Not implemented event: ${eventType}`);
        break;
    }
  };
}

EditImageComponent.propTypes = {
  injector: PropTypes.object.isRequired,
};

export default connect()(EditImageComponent);
