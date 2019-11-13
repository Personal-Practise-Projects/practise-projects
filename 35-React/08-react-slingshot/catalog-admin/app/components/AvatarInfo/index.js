import React from 'react';
import errorPlaceHolder from '../../images/common/default_profile_thumbnail.svg';
import Img from '../Img';
import Span from '../Span';
import styles from './AvatarInfo.scss';
import { StringHelper } from '../../helpers/utils';

export function AvatarInfo(props) {
  return (
    <div
      className={StringHelper.format(
        'avatar-wrapper ##',
        props.className || '',
      )}
      style={styles}
    >
      <Img
        src={props.message.profileImage}
        alt="image"
        className="avatar-image"
        title={props.message.title}
        errSrc={errorPlaceHolder}
      />
      <div className="avatar-info">
        {props.message.fieldTitle && (
          <Span message={props.message.fieldTitle} className="avatar-title" />
        )}
        {props.message.userName && (
          <Span message={props.message.userName} className="avatar-text" />
        )}
      </div>
    </div>
  );
}
