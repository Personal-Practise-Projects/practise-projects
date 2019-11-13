import React from 'react';

import { CHOICE_FIELDS } from '../../common/constants';
import ImageSelect from '../ImageSelect';
import ReadOnlyComponent from '../ReadOnlyComponent';
import { FIELDS_UID } from './common/constants';

export function displaySubtitle(header) {
  const nameList = [];
  if (Array.isArray(header.subtitle)) {
    header.subtitle.forEach(subtitle => {
      nameList.push(subtitle.name);
    });
    return nameList.join(', ');
  }
  return header.subtitle || '--';
}

export function getComponent(header) {
  switch (header.uid) {
    case CHOICE_FIELDS.CAMERA_ANGLE:
    case CHOICE_FIELDS.LIGHTING:
    case CHOICE_FIELDS.CROPPING:
    case CHOICE_FIELDS.SHADOWS:
      if (header.data && header.data.constructor === Object) {
        header.data.selected = false;
        return (
          <div className="image-select-wrapper">
            <h4 className="title">{header.title}</h4>
            <ImageSelect item={header.data} />
          </div>
        );
      }
      return (
        <div className="input-wrapper">
          <label className="input-label d-block">{header.title}</label>
          <span>{displaySubtitle(header)}</span>
        </div>
      );
    case FIELDS_UID.COLLABORATORS:
      return (
        <div className="input-wrapper">
          <label className="secondary-subtitle d-block">{header.title}</label>
          {header.choices.map(choice => {
            return (
              <ReadOnlyComponent
                title={choice.title}
                subtitle={choice.selectedData ? choice.selectedData.name : '--'}
              />
            );
          })}
        </div>
      );
    default:
      return (
        <div className="input-wrapper">
          <label className="input-label d-block">{header.title}</label>
          <span>{displaySubtitle(header)}</span>
        </div>
      );
  }
}
