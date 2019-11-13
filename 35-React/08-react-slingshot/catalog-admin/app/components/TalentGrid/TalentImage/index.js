import * as React from 'react';

const TalentImage = (props) => (
  <div className={`image-wrapper ${props.className}`}>
    {
      props.selectedImage &&
      <img className="card-image" src={props.selectedImage} alt=""/>
    }
  </div>

);


export default TalentImage;
