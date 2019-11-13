import React from 'react';
import PropTypes from 'prop-types';
import { DONE, WAITING, } from '../../../../common/constants';
import { generateUniqueId } from '../../../../helpers/common';
import UploadImageComponent from '../../../Upload/UploadImageComponent';
import SingleDropZone from "../../DragDrop/singleDragZone";
import { DownloadImageView } from "../../common/downloadImageView";

import '../EditContentVariant/EditContentVariant.scss';

export default class SingleUploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: props.content, prevContent: props.content };
  }

  render() {
    return this.editedImage(this.state.content);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.content !== prevState.prevContent) {
      return { content: prevState.content, prevContent: prevState.content };
    }
    if (nextProps.content !== prevState.content) {
      return { content: nextProps.content, prevContent: nextProps.content };
    }
    return null;
  }

  editedImage(editedImage) {
    if (editedImage && editedImage.status === DONE) {
      return (
        <DownloadImageView
          dataRef={editedImage}
          refId={editedImage.ref_id}
          imageThumb={editedImage.preview}
          imageUrl={editedImage.url}
          callbackRef={this.onCanceledFile}
        />
      )
    }
    if (editedImage && editedImage.status) {
      return (
        <div className="photo-version-thumb position-relative">
          <UploadImageComponent
            key={editedImage.key}
            controller={this.props.uploadingFileHandler(editedImage)}
            onCanceled={this.onCanceledFile}
          />
        </div>
      );
    }
    return (
      <div className="photo-version-thumb position-relative">
        <SingleDropZone
          refId={editedImage.ref_id || generateUniqueId()}
          onDrop={this.onFileSelect}
          accept={this.props.supportedFormat}
        />
      </div>
    );
  }

  onFileSelect = files => {
    if (files && files.length > 0) {
      const file = files[0];
      const mappedFile = { ...this.props.content };
      mappedFile.extraConfig = this.props.content.extraConfig;
      mappedFile.localFile = file;
      mappedFile.status = WAITING;
      mappedFile.preview = URL.createObjectURL(file);
      this.setState({ ...this.state, content: mappedFile });
    }
  };

  onCanceledFile = () => this.props.onCanceledFile(this.state.content);
}

SingleUploadComponent.propTypes = {
  content: PropTypes.object.isRequired,
  onCanceledFile: PropTypes.func.isRequired,
  uploadingFileHandler: PropTypes.func.isRequired,
};
