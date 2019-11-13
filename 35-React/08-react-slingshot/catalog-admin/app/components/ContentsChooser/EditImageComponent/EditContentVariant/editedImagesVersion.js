import React from 'react';
import PropTypes from 'prop-types';
import SingleUploadComponent from '../SingleUploadComponent';
import { STATUS_DONE } from '../../../../actions/types';
import {
  EDIT_CONTENT_FILE_SUPPORTED_FORMAT,
  EDIT_CONTENT_TYPES,
  EDITED_CONTENT_ACTIONS,
} from '../../common/constants';
import { EditedContentStatusChoices, STATUS_MAPPING } from '../helpers';

function getPublicContentFromProps(props) {
  return props.content.images
    ? props.content.images[EDIT_CONTENT_TYPES.PUBLIC] || {}
    : {};
}

export default class EditedImagesVersion extends React.Component {
  constructor(props) {
    super(props);
    this.notesDataHandler = props.injector.getExistingData({
      editedImage: props.content,
    });
  }

  render() {
    return (
      <React.Fragment>
        <SingleUploadComponent
          supportedFormat={
            EDIT_CONTENT_FILE_SUPPORTED_FORMAT[EDIT_CONTENT_TYPES.ROW]
          }
          content={this.props.content.images[EDIT_CONTENT_TYPES.ROW]}
          onCanceledFile={this.onCanceledFile}
          uploadingFileHandler={this.props.injector.uploadingFileHandler}
        />
        <SingleUploadComponent
          supportedFormat={
            EDIT_CONTENT_FILE_SUPPORTED_FORMAT[EDIT_CONTENT_TYPES.PUBLIC]
          }
          content={this.props.content.images[EDIT_CONTENT_TYPES.PUBLIC]}
          onCanceledFile={this.onCanceledFile}
          uploadingFileHandler={this.props.injector.uploadingFileHandler}
        />
        <EditedContentStatusChoices
          file={getPublicContentFromProps(this.props)}
          statusChangeListener={this.onStatusChange}
        />
      </React.Fragment>
    );
  }

  onStatusChange = (event, publicFile) => {
    publicFile.contentStatus = Object.keys(STATUS_MAPPING).find(key => STATUS_MAPPING[key] === event);
    const config = {
      data: JSON.stringify({ status: publicFile.contentStatus }),
    };
    this.props.injector.performAction(
      EDITED_CONTENT_ACTIONS.UPDATE_CONTENT_STATUS,
      publicFile,
      config,
      (status, result) => {
        if (status === STATUS_DONE) {
          Object.assign(this.props.content, result);
        }
        this.setState({});
      },
    );
  };

  onCanceledFile = file => {
    this.props.injector.onCanceledFile(file, () => {
      this.setState({});
    });
  }

}

EditedImagesVersion.propTypes = {
  injector: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
};
