import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from '../Header';
import { isUserLoggedIn, isMobile, isIE } from '../../common/helpers';
import Navigation from '../Navigation';
import {
  buildRedirectionRoutes,
  LoginPage,
  HomePage,
} from '../../containers/App/Loadable';
import UnsupportedPage from '../UnsupportedPage';

export default class PrivatePage extends React.Component {
  constructor(props) {
    super(props);
    const url = new URL(document.location);
    this.pathname = url.pathname + url.search;
    this.state = {
      isLoggedIn: isUserLoggedIn(),
      isOnMobile: isMobile(),
      isOnIE: isIE(),
    };
  }

  render() {
    const { isLoggedIn, isOnMobile, isOnIE } = this.state;

    return (
      <React.Fragment>
        {(isOnMobile || isOnIE) && <UnsupportedPage />}
        {!isOnMobile && !isOnIE && (
          <React.Fragment>
            {isLoggedIn && <Header />} {isLoggedIn && <Navigation />}
            <Switch>
              <Route path="/login" component={LoginPage} />
              {this.redirectTo()}
              <Route component={HomePage} />
            </Switch>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  redirectTo = () =>
    buildRedirectionRoutes().map((route, index) => (
      <Route
        key={index}
        exact
        path={route.path}
        render={() =>
          // eslint-disable-next-line no-nested-ternary
          this.state.isLoggedIn ? (
            route.path === '/' ? (
              <Redirect
                to={{
                  pathname: '/home',
                }}
              />
            ) : (
              <route.component metaInfo={route.metaInfo} />
            )
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                search: `?next=${this.pathname.substring(1)}`,
              }}
            />
          )
        }
      />
    ));
}
