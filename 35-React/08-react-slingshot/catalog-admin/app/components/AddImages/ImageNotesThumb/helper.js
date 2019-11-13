import ImageDownloadFeatureController from '../../ImageDownload/controller';

export const buildLightBoxFeatures = data => ({
  features: [
    {
      type: 'IMAGE_DOWNLOAD_FEATURE',
      handler: new ImageDownloadFeatureController(data),
    },
  ],
});
