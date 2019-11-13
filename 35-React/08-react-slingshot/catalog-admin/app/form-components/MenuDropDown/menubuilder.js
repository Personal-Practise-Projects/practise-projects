import React from 'react';

import { Link } from 'react-router-dom';
import ExternalLinkTag from '../ExternalLinkTag/index';

function items(item, index) {
  const classname = item.className ? item.className : '';

  if (item.type === 'external_link') {
    return classname === 'disabled' ? (
      <div className="cursor-not-allowed" title={item.toolTip} key={index}>
        <ExternalLinkTag
          className={`dropdown-item d-block ${classname}`}
          value={item.data}
          header={{ title: item.title }}
        />
      </div>
    ) : (
      <ExternalLinkTag
        className={`dropdown-item d-block ${classname}`}
        key={index}
        value={item.data}
        header={{ title: item.title }}
      />
    );
  }
  if (item.type === 'plain_item') {
    return (
      <React.Fragment key={index}>
        <div
          className={`dropdown-item d-block ${classname}`}
          role="menuitem"
          tabIndex={0}
          onMouseDown={() => item.action()}
        >
          {item.title}
        </div>
      </React.Fragment>
    );
  }

  return (
    <Link
      onMouseDown={event => {
        event.preventDefault();
      }}
      key={index}
      className={`dropdown-item d-block ${classname}`}
      to={item.data}
    >
      {item.title}
    </Link>
  );
}

export default items;
