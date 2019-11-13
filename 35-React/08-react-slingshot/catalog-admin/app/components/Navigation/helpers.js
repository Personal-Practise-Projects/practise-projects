import React from "react";

import MenuItem from "./MenuItem";
import MenuItemStatic from "./MenuItemStatic";
import SubMenuItem from "./SubMenuItem";
import SubMenuItemStatic from "./SubMenuItemStatic";

export function getMenuOptions(item, index, callbackFn) {
  switch (item.type) {
    case 'routerLink':
      return <MenuItem key={index} item={item}/>;
    case 'staticLink':
      return <MenuItemStatic key={index} item={item}/>;
    case 'navBarMenuList':
      return (
        <div
          key={index}
          className="navigation-option navigation-collapsed d-flex align-items-center justify-content-center position-relative"
          onClick={(event) => callbackFn && callbackFn(event, index)}
        >
          <i className={`navigation-icon ${item.icon}`} title={item.title}/>
          <div className="navigation-submenu text-center">
            {item.data.map((item, index) =>
              getSubMenuOptions(item, index),
            )}
          </div>
        </div>
      );
    default:
      return <></>;
  }
}


export function getSubMenuOptions(item, index) {
  switch (item.type) {
    case 'routerLink':
      return <SubMenuItem key={index} item={item}/>;
    case 'staticLink':
      return <SubMenuItemStatic key={index} item={item}/>;
    default:
      return <></>;
  }
}
