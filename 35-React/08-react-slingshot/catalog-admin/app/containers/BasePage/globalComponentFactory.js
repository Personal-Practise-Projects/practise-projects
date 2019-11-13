import React from 'react';
import BulkUpdate from 'app/components/ShotsBulkOperationView';
import NotificationList from '../../components/Notifications';
import LightBox from '../../components/LightBox';

// TODO need to change everywhere to use this instead of direct component inflation
export const GLOBAL_COMPONENT_TYPE = {
  NOTIFICATION: 'notification',
  LIGHT_BOX: 'lightBox',
  BULK_UPDATE_CONTAINER: 'bulkUpdateContainer',
};
const COMPONENTS_MAP = {
  [GLOBAL_COMPONENT_TYPE.BULK_UPDATE_CONTAINER]: BulkUpdate,
  [GLOBAL_COMPONENT_TYPE.LIGHT_BOX]: LightBox,
  [GLOBAL_COMPONENT_TYPE.NOTIFICATION]: NotificationList,
};

export default class GlobalComponentRenderFactory {
  static component(type, args) {
    const component = COMPONENTS_MAP[type];
    const Component = component || '';

    return Component && <Component {...args} />;
  }
}
