import loadable from 'loadable-components';
import LoadingIndicator from '../../components/LoadingIndicator';
import TalentPage from '../TalentPage';
import { PRODUCTION_BOARD_STATE } from '../../common/constants';

export const HomePage = loadable(() => import('../HomePage'), {
  LoadingComponent: LoadingIndicator,
});

export const ActorPage = loadable(() => import('../ActorPage'), {
  LoadingComponent: LoadingIndicator,
});

export const BrandPage = loadable(() => import('../BrandPage'), {
  LoadingComponent: LoadingIndicator,
});

export const ShotsPage = loadable(() => import('../ShotsPage'), {
  LoadingComponent: LoadingIndicator,
});

export const PropPage = loadable(() => import('../PropPage'), {
  LoadingComponent: LoadingIndicator,
});

export const LocationPage = loadable(() => import('../LocationPage'), {
  LoadingComponent: LoadingIndicator,
});

export const LoginPage = loadable(() => import('../LoginPage'), {
  LoadingComponent: LoadingIndicator,
});

export const SchedulePage = loadable(() => import('../SchedulePage'), {
  LoadingComponent: LoadingIndicator,
});

export const ProductPage = loadable(() => import('../ProductPage'), {
  LoadingComponent: LoadingIndicator,
});

export const ContentChooserWidget = loadable(
  () => import('../../components/ContentsChooser/index'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

export const ProductionBoardPage = loadable(
  () => import('../ProductionBoardPage'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

export const ContentRequestPage = loadable(
  () => import('../ContentRequestPage'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

export const ContentRequestDetailsPage = loadable(
  () => import('../ContentRequestDetailsPage'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

export const ProductionViewPage = loadable(
  () => import('../ProductionViewPage'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

export const ContentLibraryPage = loadable(
  () => import('../ContentLibraryPage'),
  {
    LoadingComponent: LoadingIndicator,
  },
);

const __ALL_LOADABLE_ROUTES = [
  { path: '/home', component: HomePage },
  { path: '/actors', component: ActorPage },
  { path: '/brands', component: BrandPage },
  { path: '/shots', component: ShotsPage },
  { path: '/props', component: PropPage },
  { path: '/locations', component: LocationPage },
  { path: '/content-picker', component: ContentChooserWidget },
  { path: '/', component: ContentRequestPage },
  { path: '/production-calendar', component: SchedulePage },
  {
    path: '/pre-production-board',
    metaInfo: { stage: PRODUCTION_BOARD_STATE.PRE },
    component: ProductionBoardPage,
  },
  {
    path: '/post-production-board',
    metaInfo: { stage: PRODUCTION_BOARD_STATE.POST },
    component: ProductionBoardPage,
  },
  { path: '/content-requests', component: ContentRequestPage },
  { path: '/content-request-details', component: ContentRequestDetailsPage },
  { path: '/products', component: ProductPage },
  { path: '/production-view', component: ProductionViewPage },
  { path: '/content-library', component: ContentLibraryPage },
];

export function buildRedirectionRoutes() {
  // TODO should be build on the basic of available navigation options
  return __ALL_LOADABLE_ROUTES;
}
export const PUBLIC_LOADABLE_ROUTES = [
  { path: '/public/view-model-profiles', component: TalentPage },
];
