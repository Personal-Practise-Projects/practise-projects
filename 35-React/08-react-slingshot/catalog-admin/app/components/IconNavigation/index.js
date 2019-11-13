import React from 'react';

import './IconNavigation.scss';

//TODO need to be render based on server config and keys
export default function IconNavigation() {
  return (
    <div className="icon-navigation-component">
      <a
        href="#collaborators"
        className="icon-navigation-item d-flex align-items-center justify-content-center"
      >
        <i className="icon-collaborators" />
      </a>
      <a
        href="#references"
        className="icon-navigation-item d-flex align-items-center justify-content-center"
      >
        <i className="icon-reference" />
      </a>
      <a
        href="#shotdetails"
        className="icon-navigation-item d-flex align-items-center justify-content-center"
      >
        <i className="icon-compose" />
      </a>
      <a
        href="#talent"
        className="icon-navigation-item d-flex align-items-center justify-content-center"
      >
        <i className="icon-crown" />
      </a>
      <a
        href="#schedule"
        className="icon-navigation-item d-flex align-items-center justify-content-center"
      >
        <i className="icon-schedule" />
      </a>
      <a
        href="#comments"
        className="icon-navigation-item d-flex align-items-center justify-content-center"
      >
        <i className="icon-comment" />
      </a>
    </div>
  );
}
