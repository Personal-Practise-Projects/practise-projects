/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router } from 'react-router-dom';

import PublicPage from '../../components/Public';
import PrivatePage from '../../components/Private';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.currentUrl = window.location.pathname;
  }

  render() {
    return (
      <div className="application-container">
        <Helmet titleTemplate="%s - Catalog Admin" defaultTitle="Catalog Admin">
          <meta
            httpEquiv="Cache-Control"
            content="no-cache, no-store, must-revalidate"
          />
          <meta httpEquiv="Expires" content="0" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta
            name="description"
            content="Catalog platform administrator console"
          />
        </Helmet>
        <Router>
          {this.currentUrl.indexOf('public/') > 0 ? (
            <PublicPage />
          ) : (
            <PrivatePage />
          )}
        </Router>
      </div>
    );
  }
}
