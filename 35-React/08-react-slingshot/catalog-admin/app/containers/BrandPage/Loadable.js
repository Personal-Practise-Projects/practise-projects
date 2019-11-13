/**
 * Asynchronously loads the component for HomePage
 */
import loadable from 'loadable-components';

import LoadingIndicator from '../../components/LoadingIndicator';

export const Table = loadable(() => import('../../components/Table'), {
  LoadingComponent: LoadingIndicator,
  delay: 200,
});

export const AddRow = loadable(() => import('../../components/AddRow'), {
  LoadingComponent: LoadingIndicator,
});
