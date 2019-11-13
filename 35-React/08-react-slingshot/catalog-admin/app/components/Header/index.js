import React from 'react';
import NavBar from './NavBar';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
    };
  }

  render() {
    return (
      this.state.userProfile && <NavBar userProfile={this.state.userProfile} />
    );
  }

  componentDidMount() {
    if (localStorage.getItem('user')) {
      this.localStorageUpdated();
    }
  }

  localStorageUpdated() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    this.setState({
      userProfile: {
        name: userInfo.name,
        profile_picture_thumbnail:
          userInfo.profile_picture_thumbnail &&
          userInfo.profile_picture_thumbnail.medium,
        alt: 'User Profile thumbnail',
      },
    });
  }
}

export default Header;
