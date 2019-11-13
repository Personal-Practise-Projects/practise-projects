import React from 'react';
import { StringHelper } from "../../helpers/utils";

import './CheckBoxView.scss';

export default function CheckBoxView(props) {
  const { isDisabled, isChecked, className } = props;
  let classname = className || '';
  classname = isChecked ? StringHelper.format('## ##', classname, 'checked') : classname;
  classname = isDisabled ? StringHelper.format('## ##', classname, 'disabled') : classname;
  const title = props.title || '';
  return (
    <div
      className={StringHelper.format('checkbox-view-component ##', classname)}
      onClick={props.onClickEvent}>
      <div className="checkbox"/>
      {title && <div className="label">{title}</div>}
    </div>
  );
}
