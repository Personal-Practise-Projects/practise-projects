import React from 'react';
import ReadOnlyComponent from "../ReadOnlyComponent";


const COMPONENTS_MAP = {
};

export default class ReadOnlyComponentRenderFactory {
  static component(type, key, title, subtitle) {
    const Component = COMPONENTS_MAP[type] || ReadOnlyComponent;
    return (
      Component && (
        <Component title={title} subtitle={subtitle}/>
      )
    );
  }
}
