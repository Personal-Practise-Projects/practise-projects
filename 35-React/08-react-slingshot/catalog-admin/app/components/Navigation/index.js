import React from 'react';
import whiteLogo from '../../images/icon-white.png';
import { getNavMenu } from '../../helpers/user';
import Img from '../Img';
import { getMenuOptions } from "./helpers";

import './Navigation.scss';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classData: ['navigation-expanded', 'navigation-collapsed'],
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.__handleOutsideClick, false);
  }

  render() {
    return (
      <aside className="navigation-component">
        <div className="navigation-wrapper" id="navigation-wrapper">
          <a href="/">
            <Img className="app-logo" src={whiteLogo} />
          </a>
          {this.__createNavigation()}
        </div>
      </aside>
    );
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.__handleOutsideClick, false);
  }

  __createNavigation() {
    const navigationOptions = getNavMenu();
    return navigationOptions.map((item, index) => {
      return getMenuOptions(item, index, this.__toggleDropdown);
    });
  }

  __handleOutsideClick = event => {
    event.stopPropagation();
    if (event.target.classList.contains('navigation-option') || event.target.classList.contains('navigation-icon')) {
      return false;
    }
    this.__closeAllDropdowns(event);
  };

  __toggleDropdown = (event, index) => {
    this.__closeAllDropdowns(event, index);

    const a = this.state.classData[0];
    const b = this.state.classData[1];
    const el =
      event.target.parentElement.classList.contains(a) ||
      event.target.parentElement.classList.contains(b)
        ? event.target.parentElement.classList
        : event.target.classList;
    if (el.contains(a)) {
      el.remove(a);
      el.add(b);
    } else {
      el.remove(b);
      el.add(a);
    }
  };

  __closeAllDropdowns = (event, index = 0) => {
    const a = this.state.classData[0];
    const b = this.state.classData[1];
    const c = index;
    const elementList = document.getElementById('navigation-wrapper')
      .childNodes;
    for (let index = 0; index < elementList.length; index++) {
      const el = elementList[index].classList;
      if (el.contains(a) && index !== c) {
        el.remove(a);
        el.add(b);
      }
    }
  };

}

export default Navigation;
