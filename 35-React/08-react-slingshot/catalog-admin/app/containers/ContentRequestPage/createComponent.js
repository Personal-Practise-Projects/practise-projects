import React from 'react';

import DropDown from '../../components/DropDown';

export default function DropDownCreateComponent(props) {
  if (props.options && props.options.length > 1) {
    return <DropDown header={props.header} dataHandler={props.dataHandler} />;
  } else if (props.options && props.options.length === 1) {
    return (
      <button
        onClick={() =>
          props.dataHandler.onUpdate(props.header, props.options[0].id)
        }
        className="secondary-cta"
      >
        <i className="icon-circle-plus" /> Create new
      </button>
    );
  }
  return <div />;
}
