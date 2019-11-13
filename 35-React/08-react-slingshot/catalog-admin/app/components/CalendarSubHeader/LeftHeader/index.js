import React from 'react';

import Button from '../../Button';
import GlobalSearch from '../../GlobalSearch';

export default function LeftHeader(props) {
  return (
    <React.Fragment>
      <Button
        key="schedulePage-leftHeader-typeButton"
        className="secondary-cta"
        displayElement="Today"
        onClick={() => props.dataHandler.onUpdate({ uid: '#todayPicker' })}
      />
      <GlobalSearch
        key="schedulePage-leftHeader-search"
        dataHandler={props.dataHandler}
      />
    </React.Fragment>
  );
}
