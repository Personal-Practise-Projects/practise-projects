import React from 'react';
import { Redirect } from 'react-router-dom';
import SplitListPage from '../SplitListTitlePage';
import { getDefaultMenu } from '../../helpers/user';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirection: null,
    };
  }

  render() {
    if (this.state.redirection) {
      return <Redirect to={{ pathname: this.state.redirection }} />;
    }
    this.checkRedirection();
    return <SplitListPage isLoading />;
  }

  checkRedirection = () => {
    const defaultMenu = getDefaultMenu();
    if (defaultMenu) {
      this.setState({ redirection: defaultMenu.link });
    } else {
      setTimeout(this.checkRedirection, 5000);
    }
  };
}
