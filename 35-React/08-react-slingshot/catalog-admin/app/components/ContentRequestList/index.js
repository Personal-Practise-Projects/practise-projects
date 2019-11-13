import React from 'react';
import { connect } from 'react-redux';

import Loader from '../Loader';
import Table from '../Table';

import { contentRequestListParser } from './parser';
import {
  resetContentRequestsData,
  updateContentRequestsConfig,
  updateContentRequestsData,
} from '../../actions/contentRequestActions';
import {
  contentRequestListHandler,
  fetchContentRequestsConfig,
} from './services';
import { ContentRequestListController } from './controller';
import {
  updateAvatarList,
  resetAvatarList,
} from '../../actions/avatarWrapperActions';
import { ACTIVE_SCREEN } from '../../common/constants';
import {
  CONTENT_REQUEST_FILTER_API_MAP,
  CONTENT_REQUEST_FILTER_MAP,
  getContentRequestFilters,
} from './helper';

class ContentRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchString: props.searchString, showLoader: true };
    this.createContentRequestFetchHandler();
  }

  componentDidMount() {
    this.dataHandler = new ContentRequestListController(this.eventListener);
    fetchContentRequestsConfig(this.props.updateContentRequestsConfig);
    this.fetchContentRequestData.fetch();
  }

  componentWillUnmount() {
    this.dataHandler.resetEventListener();
    this.props.resetAvatarList();
    this.props.resetContentRequestsData();
    this.cancelPreviousRequest();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.searchString !== nextProps.searchString) {
      return { searchString: nextProps.searchString, showLoader: true };
    }
    return {};
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.searchString !== this.props.searchString ||
      prevProps.selectedBrandId !== this.props.selectedBrandId ||
      prevProps.selectedAvatarCount !== this.props.selectedAvatarCount
    ) {
      this.createContentRequestFetchHandler();
      this.fetchContentRequestData.fetch();
    }
  }

  render() {
    const { metaInfo, contentRequests } = this.props;
    const { headers, data } = contentRequestListParser(
      metaInfo,
      contentRequests,
    );
    return this.state.showLoader ? (
      <Loader />
    ) : (
      <div className="content-requests-table position-relative">
        <Table
          data={data}
          handleSelectedRow={this.onSelect}
          headers={headers}
          onEndScroll={this.fetchContentRequestData.fetch}
          showLoader={this.state.showLoader}
        />
      </div>
    );
  }

  onSelect = contentRequestId => {
    this.props.onSelect(this.props.dataDict[contentRequestId]);
  };

  onFetchContentRequests = data => {
    this.props.updateContentRequestsData(data);
    this.setState({ showLoader: false });
  };

  errorCallback = errorResponse => this.setState({ showLoader: false });

  createContentRequestFetchHandler = () => {
    this.cancelPreviousRequest();
    this.props.resetContentRequestsData();
    this.fetchContentRequestData = contentRequestListHandler(
      this.onFetchContentRequests,
      this.errorCallback,
      this.state.searchString,
      this.createContentRequestFilterData(),
      this.props.selectedBrandId,
    );
  };

  createContentRequestFilterData = () => {
    const filters = {};
    const availableFilters = getContentRequestFilters();
    availableFilters.forEach(filter => {
      const result = CONTENT_REQUEST_FILTER_MAP[filter](this.props[filter]);
      if (result) filters[CONTENT_REQUEST_FILTER_API_MAP[filter]] = result;
    });
    return filters;
  };

  cancelPreviousRequest = () => {
    this.fetchContentRequestData &&
      this.fetchContentRequestData.cancelExistingRequests();
  };

  eventListener = ({ type, data }) => {
    switch (type) {
      case ACTIVE_SCREEN.CONTENT_REQUEST:
        this.props.updateAvatarList({
          type: ACTIVE_SCREEN.CONTENT_REQUEST,
          data,
        });
        break;
    }
  };
}

const mapStateToProps = state => ({
  contentRequests: state.contentRequest.data,
  metaInfo: state.contentRequest.metaInfo,
  dataDict: state.contentRequest.dataDict,
  accountManager: state.avatar[ACTIVE_SCREEN.CONTENT_REQUEST].selectedAvatars,
  selectedAvatarCount:
    state.avatar[ACTIVE_SCREEN.CONTENT_REQUEST].selectedCount,
});

const mapDispatchToProps = {
  updateContentRequestsData,
  updateContentRequestsConfig,
  resetContentRequestsData,
  updateAvatarList,
  resetAvatarList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentRequestList);
