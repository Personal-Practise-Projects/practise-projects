import React from 'react';

function getTraits(props, info) {
  return props.data[info.data_key] ? props.data[info.data_key] : 'N/A';
}

export const TalentDetailsMetaInfo = props => (
  <div className="talent-details-body">
    <div className="grid-container">
      {props.info.metaInfo.map((info, index) => (
        <div className="grid-item" key={index}>
          <h4>{info.title}</h4>
          <p>{getTraits(props.info, info)}</p>
        </div>
      ))}
    </div>
  </div>
);
