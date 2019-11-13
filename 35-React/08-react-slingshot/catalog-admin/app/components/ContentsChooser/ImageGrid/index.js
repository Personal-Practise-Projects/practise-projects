import React from 'react';
import PropTypes from 'prop-types';

import UploadImageComponent from '../../Upload/UploadImageComponent';
import { CALLBACK_EVENTS } from '../DataHandler/base';
import Img from '../../Img';
// Import Component Specific Styling
import './ImageGrid.scss';

const UNLIMITED_SELECTION = -1;

class ImageGridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCount: 0,
      contentFiles: [],
    };
  }

  componentDidMount() {
    this.props.injector.setCallbackReceiver(this.onCallbackReceived);
    if (this.state.contentFiles.length <= 0 && this.props.injector) {
      this.props.injector.getRecent();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.version !== this.props.version) {
      this.props.injector.getRecent();
    }
  }

  render() {
    if (this.props.injector.hasFileData()) {
      return (
        <section className="recent-uploads">
          <div className="reference-message">
            {this.props.injector.getDisplayMessage()}
          </div>
          <div className="d-flex flex-wrap">
            {this.getUploadingFilesThumbs()}
            {this.getUploadedFilesThumbs()}
          </div>
        </section>
      );
    }
    return this.props.injector.emptyWidget();
  }

  componentWillUnmount() {
    this.props.injector.setCallbackReceiver(null);
  }

  getUploadedFilesThumbs() {
    this.state.selectedCount = 0;
    return this.state.contentFiles.map((file, index) => {
      // Update selected item count
      this.state.selectedCount += file.selected ? 1 : 0;
      const className = file.selected
        ? 'content-card content-card-selected d-inline-block position-relative'
        : 'content-card d-inline-block position-relative';
      return (
        <div
          className={className}
          key={file.key}
          onClick={() => this.onImageClicked(index)}
        >
          <Img
            className="content-card-thumbnail"
            src={file.thumbUrl}
            fileKey={file.fileKey}
            alt="Uploaded image"
          />

          {file.displayName && (
            <div className="content-card-filename" title={file.titleName}>
              {file.displayName}
            </div>
          )}
          <div className="content-card-overlay align-items-center justify-content-center">
            <span className="checkmark-selected d-inline-block" />
          </div>
        </div>
      );
    });
  }

  getUploadingFilesThumbs() {
    const uploadingFileHandlers = this.props.injector.fileControllers;
    return Object.keys(uploadingFileHandlers).map((key, index) => (
      <UploadImageComponent
        key={key}
        controller={uploadingFileHandlers[key]}
        position={index}
        onCanceled={this.onCanceledFile}
      />
    ));
  }

  onImageClicked = clickedIndex => {
    const contentFile = this.state.contentFiles[clickedIndex];
    this.canBeSelectedFile(contentFile);
    // Notify parent if any selected content is available so it can toggle map button state
    this.props.contentsCallback(this.state.selectedCount > 0);
    this.setState({ selectedCount: this.state.selectedCount });
  };

  onCallbackReceived = (status, args) => {
    if (status === CALLBACK_EVENTS.DATA_RECEIVED || status === CALLBACK_EVENTS.DATA_UPDATED) {
      if (args.length >= 0) {
        this.setState({ contentFiles: args });
      }
      this.props.contentsCallback(this.props.injector.enableSave);
    } else if (status === CALLBACK_EVENTS.FILE_UPLOADED) {
      this.setState({ contentFiles: args });
    }
  };

  onCanceledFile = fileController => {
    // If progress for file is 100% add it in uploaded file
    this.props.injector.onFileCanceled(fileController.uid);
  };

  canBeSelectedFile(contentFile) {
    const isSelected = !contentFile.selected;
    // Restrict user select maximum number of contents in single time if it is not infinity number of times
    if (
      isSelected &&
      this.props.injector.config.maxAllowed === UNLIMITED_SELECTION
    ) {
      contentFile.selected = isSelected;
      this.state.selectedCount += 1;
    } else if (
      isSelected &&
      this.state.selectedCount < this.props.injector.config.maxAllowed
    ) {
      contentFile.selected = isSelected;
      this.state.selectedCount += 1;
    } else if (!isSelected) {
      contentFile.selected = isSelected;
      this.state.selectedCount -= 1;
    }
  }
}

ImageGridComponent.propTypes = {
  injector: PropTypes.object.isRequired,
  contentsCallback: PropTypes.func.isRequired,
  version: PropTypes.number.isRequired,
};

export default ImageGridComponent;
