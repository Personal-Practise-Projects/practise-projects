import loadable from 'loadable-components';

import LoadingIndicator from '../../components/LoadingIndicator';

export const Table = loadable(() => import('../../components/Table'), {
  LoadingComponent: LoadingIndicator,
  delay: 200,
});
