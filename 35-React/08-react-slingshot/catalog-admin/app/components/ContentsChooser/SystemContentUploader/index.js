import React from 'react';
import PropTypes from 'prop-types';
import { generateUniqueId } from '../../../helpers/common';
import { WAITING } from '../../../common/constants';
import DragArea from '../DragDrop/dragArea';
import ImageGridComponent from '../ImageGrid';
import { buildConditionalString } from "../../../common/helpers";
// Import Component Specific Styling
import './SystemContentUploader.scss';

export const WIDGET_TYPE = {
  WITHOUT_UPLOAD: 'WITHOUT_UPLOAD',
  DEFAULT: 'DEFAULT',
};

class SystemContentUploader extends React.Component {
  constructor(props) {
    super(props);
    this.dataInjector = this.props.injector;
    this.state = {
      selectedFiles: [],
      widgetType: props.widgetType || WIDGET_TYPE.DEFAULT,
    };
  }

  render() {
    // const thumbs = this.getUploadingFilesThumbs();
    const defaultWidget = this.state.widgetType === WIDGET_TYPE.DEFAULT;
    return (
      <div className="upload-area area-collapsed">
        {defaultWidget && (
          <DragArea
            onDrop={this.onFileSelected}
            accept={this.dataInjector.config.supportedFormat}
            displayMessage={this.dataInjector.dragAreaMessage()}
          />
        )}
        <div
          className={buildConditionalString(
            'content-overscroll ', '', defaultWidget, 'mapping-overscroll'
          )}
        >
          <ImageGridComponent
            key={`igc_${this.dataInjector.config.pickerType}_${
              this.dataInjector.uniqueComponentKey
            }`}
            injector={this.dataInjector}
            contentsCallback={this.props.contentsCallback}
            version={this.props.version}
          />
        </div>
      </div>
    );
  }

  onFileSelected = files => {
    const selectedFiles = [];
    files.forEach(file => {
      const uid = generateUniqueId();
      const uploadingFile = {
        preview: URL.createObjectURL(file),
        key: uid,
        status: WAITING,
        uid: this.dataInjector.getFileUID(uid),
        shotTitle: this.dataInjector.getTitle(),
        extraConfig: {},
        localFile: file,
      };
      selectedFiles.push(uploadingFile);
      //Create upload handler for the file
      this.dataInjector.uploadingFileHandler(uploadingFile);
    });

    this.setState({ selectedFiles: selectedFiles });
  };
}

SystemContentUploader.propTypes = {
  injector: PropTypes.object.isRequired,
  contentsCallback: PropTypes.func.isRequired,
  widgetType: PropTypes.string,
  hasContent: PropTypes.bool,
};

export default SystemContentUploader;
