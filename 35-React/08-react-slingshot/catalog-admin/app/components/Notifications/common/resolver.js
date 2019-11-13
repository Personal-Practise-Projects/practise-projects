import Logger from '../../../logging/logger';
import { NOTIFICATION_FEATURES_MAP } from './constants';
import { extractNavigationStack } from './helpers';

const logger = Logger.createLogger('NotificationResolver');

export function handleNotificationRedirection(callbackFn) {
  if (this) {
    const requiredFeatures = NOTIFICATION_FEATURES_MAP[this.notification_type];
    if (requiredFeatures) {
      const navigationStack = extractNavigationStack(
        this.notification_type,
        this.payload,
        requiredFeatures,
        this.permissions,
      );
      if (callbackFn) callbackFn(navigationStack);
    } else {
      logger.warn(`Notification type not supported ${this.notification_type}`);
    }
  }
}
