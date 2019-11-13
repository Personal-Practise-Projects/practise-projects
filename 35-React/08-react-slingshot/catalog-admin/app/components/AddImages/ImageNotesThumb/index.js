import React from 'react';
import PropTypes from 'prop-types';

import TextNotes from './textNotes';
import LightBoxImage from '../../LightBoxImage';
import AttachedFiles from '../AttachedFiles';
import { buildLightBoxFeatures } from './helper';
// Import Component Specific Styling
import './ImageNotes.scss';

class ImageNotesThumbView extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ value: this.props.value });
    }
  }

  render() {
    const children = this.getChildren();
    return (
      <div className="reference-area d-flex align-items-center justify-content-between">
        {children}
      </div>
    );
  }

  getChildren() {
    const children = [];
    this.props.header.data.map((data, index) => {
      switch (data.type) {
        case 'image':
          children.push(
            <div key={index} className="input-thumbnail">
              <LightBoxImage
                featureReference={buildLightBoxFeatures}
                url={this.props.value.url}
                downloadUrl={this.props.value.url}
                compressUrl={this.props.value.compress_url}
                thumbnail={
                  this.props.value.thumbnails &&
                  this.props.value.thumbnails.small
                }
                alt="image_notes"
              />
            </div>,
          );
          break;
        case 'textarea':
          children.push(
            <TextNotes
              key={index}
              name={name}
              readonly={this.props.readonly}
              header={data}
              value={this.props.value.notes || ''}
              updateDetailsOnBlur={this.updateDetailsOnBlur}
            />,
          );
          break;
        case 'file':
          children.push(
            <AttachedFiles key={index} url={this.props.value.url} />,
          );
          break;
      }
    });
    return children;
  }

  updateDetailsOnBlur = objectData => {
    const updatedData = this.props.value;
    updatedData.data_key = this.props.header.uid;
    updatedData.notes = objectData.value;
    const header = {
      index: this.props.id,
      uid: `${this.props.header.uid}_notes`,
      data_key: this.props.header.data_key,
    };
    this.props.dataHandler.onUpdate(header, updatedData, () => {});
  };
}

ImageNotesThumbView.propTypes = {
  value: PropTypes.object,
};

export default ImageNotesThumbView;
