import React from 'react';

import './InputInline.scss';
import ComponentRenderFactory from '../ComponentFactory';

export default function InputInline(props) {
  return (
    <div className="input-wrapper-multiple">
      <h1>{props.header.title}</h1>
      <div className="row">
        {props.header.data.map((header, index) => (
          <div className="col-12 col-sm-6" key={index}>
            {ComponentRenderFactory.component(header, index, props.dataHandler)}
          </div>
        ))}
      </div>
    </div>
  );
}
