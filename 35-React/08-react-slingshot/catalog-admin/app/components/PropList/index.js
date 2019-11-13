import React from 'react';
import { connect } from 'react-redux';

import Table from '../Table';

import {
  resetPropsData,
  updatePropsConfig,
  updatePropsData,
} from '../../actions/propActions';
import { fetchPropsConfig, propListHandler } from './services';
import { propListParser } from './parser';

import styles from './PropList.scss';

class PropList extends React.Component {
  constructor(props) {
    super(props);
    this.requestMap = {};
    this.state = { searchString: props.searchString, showLoader: true };
    this.createPropFetchHandler();
  }

  componentDidMount() {
    this.props.resetPropsData();
    fetchPropsConfig(this.props.updatePropsConfig);
    this.fetchPropsData.fetch();
  }

  componentWillUnmount() {
    this.cancelPreviousRequest();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchString !== prevState.searchString) {
      return { searchString: nextProps.searchString, showLoader: true };
    }
    return {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchString !== this.props.searchString) {
      this.createPropFetchHandler();
      this.fetchPropsData.fetch();
    }
  }

  render() {
    const { metaInfo, propList } = this.props;
    const parsedPropList = propListParser(propList);
    return (
      <div className="prop-list-component" style={styles}>
        <Table
          data={parsedPropList}
          handleSelectedRow={this.onSelect}
          headers={metaInfo.list_header}
          onEndScroll={this.fetchPropsData.fetch}
          showLoader={this.state.showLoader}
        />
      </div>
    );
  }

  onSelect = propId => {
    this.props.onSelection({
      prop: this.props.propDict[propId],
      headers: this.props.metaInfo.detail_header,
    });
  };

  onFetchProps = data => {
    this.props.updatePropsData(data);
    this.setState({ showLoader: false });
  };

  errorCallback = errorResponse => this.setState({ showLoader: false });

  createPropFetchHandler = () => {
    this.cancelPreviousRequest();
    this.props.resetPropsData();
    this.fetchPropsData = propListHandler(
      this.onFetchProps,
      this.errorCallback,
      this.state.searchString,
      this.props.contentRequestId,
    );
  };

  cancelPreviousRequest = () => {
    this.fetchPropsData && this.fetchPropsData.cancelExistingRequests();
  };
}

const mapStateToProps = state => ({
  propList: state.props.data,
  metaInfo: state.props.metaInfo,
  propDict: state.props.propDict,
});

const mapDispatchToProps = {
  updatePropsData,
  updatePropsConfig,
  resetPropsData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropList);
