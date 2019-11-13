import * as React from 'react';
import Img from '../Img';
import Logo from '../../images/common/catalog-logo-black.svg';

export const PlainHeader = (props) => {
  const className = props.className ? props.className : '';
  return (
    <header className={`${className}`}>
      <Img src={Logo} alt="Catalog" className="header-logo img-fluid"/>
      {props.title}
    </header>
  );
};
