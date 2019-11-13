import React from 'react';

import Avatar from 'react-avatar';

export default function UserInfoComponent(props) {
  return (
    <div className="user-info-component">
      <Avatar initials={props.title} size="32" round="50%" src={props.thumb} />
      <span className="m-2">{props.title}</span>
    </div>
  );
}
