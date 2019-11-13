import React from 'react';
import ReadMoreAndLess from 'react-read-more-less';

import { readMoreLessConfig } from '../../../../helpers/uiUtils';
import { CHAR_LIMITS } from '../../../../common/constants';

import './Notes.scss';

export default function Notes({ title, description }) {
  return (
    <div className="notes-component">
      <h2 className="heading">{title}</h2>
      {description && (
        <ReadMoreAndLess {...readMoreLessConfig(CHAR_LIMITS.EQUAL_TO_200)}>
          {description}
        </ReadMoreAndLess>
      )}
    </div>
  );
}
