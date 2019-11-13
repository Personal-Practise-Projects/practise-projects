import React from 'react';

import DateRange from './components/DateRange';
import MultiCheckboxSelect from './components/MultiCheckboxSelect';

const FILTER_COMPONENTS_MAPPING = {
  dateRange: DateRange,
  multipleCheckBoxSelect: MultiCheckboxSelect,
};

export default class ComponentRenderFactory {
  static component(controller) {
    const Component = FILTER_COMPONENTS_MAPPING[controller.filterConfig.type];
    return (
      Component && (
        <Component
          key={`${controller.filterConfig && controller.filterConfig.uid}`}
          controller={controller}
        />
      )
    );
  }
}
