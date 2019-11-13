import AvatarGroupFeatureController from '../../components/AvatarGroup/controller';

export const buildFeatureReference = data => ({
  features: [
    {
      type: 'TALENT_FEATURE',
      handler: new AvatarGroupFeatureController(data),
    },
  ],
});
