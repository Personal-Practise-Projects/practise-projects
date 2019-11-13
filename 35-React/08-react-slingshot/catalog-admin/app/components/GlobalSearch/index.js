import React from 'react';
import Search from '../Search-v2';
import styles from './GlobalSearch.scss';

class GlobalSearch extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/prop-types
    this.searchHandler = props.dataHandler.getSearchHandler();
    this.searchHandler.setTypeEventListener(this.onSearchTypeSelect);
    this.state = {
      searchPlaceholder: this.searchHandler.placeholder,
    };
  }

  render() {
    return (
      <div className="search-global" style={styles}>
        <Search
          placeholder={this.state.searchPlaceholder}
          searchHandler={this.searchHandler}
        />
      </div>
    );
  }

  onSearchTypeSelect = type => {
    this.setState({
      searchPlaceholder: type.placeholder,
    });
  };
}

export default GlobalSearch;
