import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PUBLIC_LOADABLE_ROUTES } from '../../containers/App/Loadable';

const PublicPage = () => (
  <React.Fragment>
    <Switch>
      {PUBLIC_LOADABLE_ROUTES.map((route, index) => (
        <Route
          key={index}
          exact
          path={route.path}
          render={() => <route.component />}
        />
      ))}
    </Switch>
  </React.Fragment>
);

export default PublicPage;
