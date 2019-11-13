import React from 'react';
import PropTypes from 'prop-types';

import { buildLightBoxFeatures } from '../helpers';
import { StringHelper } from '../../../../helpers/utils';
import EditedImagesVersion from './editedImagesVersion';
import AddVersionCta from './versionButton';
import { DownloadImageView } from '../../common/downloadImageView';
import ExpandableCommentSection from '../../../ExpandableCommentSection';

import './EditContentVariant.scss';

export default class EditContentVariant extends React.Component {
  constructor(props) {
    super(props);
    this.injector = props.injector;
    this.props.data.features = buildLightBoxFeatures(this.props.data.url);
  }

  render() {
    return (
      <div className="edit-content-variant-component">
        <div className="original-image">
          <DownloadImageView
            dataRef={this.props.data}
            refId={this.props.data.refId}
            imageThumb={this.props.data.thumbUrl}
            imageUrl={this.props.data.url}
            callbackRef={this.editedImagesEmpty() ? this.onDeleteVariant : null}
          />
        </div>
        <div className="edited-versions">
          {this.props.data.editedImages.map((editedImage, index) => (
            <div key={editedImage.uid} className="edited-version">
              <section className="photo-version-empty d-flex align-items-center justify-content-start position-relative">
                <EditedImagesVersion
                  key={StringHelper.format('emv_##', editedImage.id)}
                  id={StringHelper.format('emv_##', editedImage.id)}
                  injector={this.injector}
                  content={editedImage}
                />
              </section>
              <div className="comments-section">
                <ExpandableCommentSection
                  key={editedImage.extraConfig.versionUid}
                  editedImage={editedImage}
                  updateParentComponent={() => this.setState({})}
                />
              </div>
            </div>
          ))}
          <AddVersionCta
            rawImage={this.props.data}
            editedImage={
              this.props.data.editedImages[
                this.props.data.editedImages.length - 1
              ]
            }
            callbackRef={this.__addEmptyVersion}
          />
        </div>
      </div>
    );
  }

  onDeleteVariant = () => {
    this.props.injector.onDeleteVariantImage(this.props.data);
  };

  editedImagesEmpty = () => {
    const editedImages = this.props.data.editedImages;
    return editedImages.length == 1 && editedImages[0].isEmpty;
  };

  __addEmptyVersion = () => {
    this.injector.addVersion(this.props.data, () => this.setState({}));
  };
}

EditContentVariant.propTypes = {
  data: PropTypes.object.isRequired,
  injector: PropTypes.object.isRequired,
};
