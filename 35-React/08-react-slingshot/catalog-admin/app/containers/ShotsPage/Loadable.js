import loadable from 'loadable-components';

import LoadingIndicator from '../../components/LoadingIndicator';

export const DetailView = loadable(
  () => import('../../components/ShotDetailsView'),
  {
    LoadingComponent: LoadingIndicator,
  }
);

export const DropDown = loadable(
  () => import('../../form-components/DropDown'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

export const Table = loadable(() => import('../../components/Table'), {
  LoadingComponent: LoadingIndicator,
  delay: 200,
});
