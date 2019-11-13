import React from "react";

import './ReadOnly.scss'

export default function ReadOnlyComponent(props) {
  return (
    <div className="readonly-wrapper">
      <label className="readonly-title d-block">{props.title}</label>
      <span className="readonly-subtitle">{props.subtitle}</span>
    </div>
  )
}
