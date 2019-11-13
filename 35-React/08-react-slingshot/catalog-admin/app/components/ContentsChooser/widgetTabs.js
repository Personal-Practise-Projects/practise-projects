import React from "react";

export function WidgetTabs(props) {
  return Object.keys(props.dataInjectors).map((key, index) => {
    const selectedTab = key === props.selectTabId;
    return (
      <button
        id={key}
        key={index}
        className={selectedTab ? 'widget-tab tab-active' : 'widget-tab'}
        onClick={props.onTabSelected}
      >
        {props.dataInjectors[key].config.title}
      </button>
    );
  });
}
