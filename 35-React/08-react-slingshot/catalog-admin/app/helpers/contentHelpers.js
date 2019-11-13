import MarkupFeature from '../components/MarkUpComment/MarkupFeature';
import { COMMENT_TYPES } from '../common/comments/constants';
import { EDIT_CONTENT_TYPES } from '../components/ContentsChooser/common/constants';
import ImageDownloadFeatureController from '../components/ImageDownload/controller';
import { NOTIFICATION_TYPES } from '../components/Notifications/common/constants';

const downloadFeatures = function(url) {
  return [
    {
      type: 'IMAGE_DOWNLOAD_FEATURE',
      handler: new ImageDownloadFeatureController(url),
    },
  ];
};
export const getPublicContentFeatures = function(contentId, url) {
  return [
    {
      type: 'COMMENT',
      handler: new MarkupFeature({ contentId, url }, COMMENT_TYPES.CONTENTS),
    },
    ...downloadFeatures(url),
  ];
};
export const getContentFeatures = function(contentType, contentId, url) {
  switch (contentType) {
    case EDIT_CONTENT_TYPES.PUBLIC:
      return getPublicContentFeatures(contentId, url);
    case NOTIFICATION_TYPES.MARKUP_COMMENT:
      return getPublicContentFeatures(contentId, url);
    default:
      return downloadFeatures(url);
  }
};
