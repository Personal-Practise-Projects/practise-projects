import * as React from 'react';
import TalentDetails from '../TalentDetails';
import TalentImage from '../TalentImage';
import styles from './TalentCard.scss';
import LightBoxLauncher from '../../LightBoxLauncher';
import AvatarGroup from '../../AvatarGroup';
import NoTalentImage from '../../../images/common/default_profile_thumbnail.svg';

function getClassname(selectedImage) {
  return selectedImage.type
    ? selectedImage.type === 'NO_IMAGE'
      ? 'no-image'
      : ''
    : '';
}

class TalentCard extends React.Component {
  constructor(props) {
    super(props);
    this.no_image = { url: NoTalentImage, type: 'NO_IMAGE' };
    this.state = {
      selectedImage:
        this.props.talent.actor_data &&
        (this.props.talent.actor_data.images[0]
          ? this.props.talent.actor_data.images[0]
          : this.no_image),
      markerImageArray: this.props.talent.actor_data.images.slice(0, 3),
    };
  }

  switchImage = image => {
    this.setState({
      selectedImage: image.data,
    });
  };

  render() {
    const classname = getClassname(this.state.selectedImage);
    return (
      <div className="card" style={styles}>
        <div className="overlay-wrapper">
          <TalentImage
            className={classname}
            selectedImage={
              this.state.selectedImage && this.state.selectedImage.url
            }
          />
          {this.getTalentImageOverlayData()}
        </div>
        <TalentDetails data={this.props.talent} />
      </div>
    );
  }

  getTalentImageOverlayData = () => (
    <div className="overlay">
      <div className="overlay-metainfo">
        {this.state.selectedImage !== this.no_image && (
          <LightBoxLauncher
            reference={this.props.featureReference(this.state)}
            url={
              this.state.selectedImage && this.state.selectedImage.compress_url
            }
            className="talent-lightbox-launcher"
            metaInfo={{
              heading: this.props.talent.actor_data.name,
            }}
          >
            <i className="icon-zoom-in" />
          </LightBoxLauncher>
        )}

        <div className="overlay-metainfo-talent">
          <h4 className="name">{this.props.talent.actor_data.name}</h4>
          <p className="age">
            <span className="age-title">Age: </span>
            {this.props.talent.age ? this.props.talent.age : 'N/A'}
          </p>
        </div>
        <AvatarGroup
          data={this.state.markerImageArray}
          eventListener={this.switchImage}
        />
      </div>
    </div>
  );
}

export default TalentCard;
