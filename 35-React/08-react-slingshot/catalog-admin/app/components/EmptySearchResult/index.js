import React from 'react';

import Img from '../Img';
import NoResultIcon from '../../images/common/no-result-found.svg';

import './EmptySearchResult.scss';

export function EmptySearchResult() {
  return (
    <div className="schedule-drawer-body empty-search d-flex align-items-center justify-content-center">
      <div className="flex-wrapper text-center">
        <Img src={NoResultIcon} alt='No Search Result' className="no-result-logo" />
        <h3 className='empty-header'>Nothing is here</h3>
        <span className='empty-body d-block'>Try modifying your search criteria</span>
      </div>
    </div>
  )
}
