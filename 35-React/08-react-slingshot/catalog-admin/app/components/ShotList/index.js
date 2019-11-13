import React from 'react';
import { connect } from 'react-redux';
import { shotListParser } from './parser';
import {
  deleteShot,
  resetShotsData,
  updateShotsData,
} from '../../actions/shotsActions';
import { hideLoader, showLoader } from '../../actions/commonActions';
import {
  COMMON_ACTIONS,
  CONTENT_REQUEST_DETAILS_LISTS,
  SELECT_ITEMS_TYPE,
} from '../../common/constants';
import { SearchHandler } from '../../containers/ShotsPage/searchHandler';
import { shotListHandler } from './services';

import Table from '../Table';
import Loader from '../Loader';
import { SHOT_LIST_EVENT } from '../ShotDetailsView/constants';
import { ShotListController } from './controller';
import { toggleConfirmDialog } from '../../containers/BasePage/actions';

// Import Component Specific Styles
import './ShotList.scss';

class ShotList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchHandler: new SearchHandler(this.updateShots),
      searchResults: [],
    };
    this.selfCanceled = false;
    this.dataHandler = new ShotListController();
    this.createShotFetchHandler();
  }

  componentDidMount() {
    this.dataHandler.setEventListener(this.shotListEventListener);
    this.fetchShotsHandler.fetch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.contentRequestId !== prevProps.contentRequestId) {
      this.createShotFetchHandler();
      this.fetchShotsHandler.fetch();
    }
    this.state.searchHandler.setData(this.props.shots.data);
    if (prevProps !== this.props) {
      this.props.setSearchHandler(this.state.searchHandler);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.searchHandler && prevState.searchHandler.searchString) {
      prevState.searchHandler.setData(nextProps.shots.data);
      return { searchResults: prevState.searchHandler.searchedData() };
    }
    return { searchResults: nextProps.shots.data };
  }

  shouldComponentUpdate(nextProps, prevState) {
    return (
      nextProps.contentRequestId !== this.props.contentRequestId ||
      nextProps.shots !== this.props.shots ||
      this.state.searchResults !== prevState.searchResults ||
      this.props.isLoading !== nextProps.isLoading
    );
  }

  updateShots = shots => {
    this.setState({
      searchResults: shots,
    });
  };

  render() {
    const { headers, data } = shotListParser(
      this.props.listMetaInfo,
      this.state.searchResults,
    );
    return (
      <div className="shot-list-component shots-page-table">
        {this.props.isLoading ? (
          <Loader />
        ) : (
          <Table
            headers={headers}
            data={data}
            handleSelectedRow={this.handleSelectedShot}
            tableTitle="Shots"
            selectedKey="shotId"
            selectEventType={SELECT_ITEMS_TYPE.SHOT_LIST}
            dataHandler={this.dataHandler}
          />
        )}
      </div>
    );
  }

  componentWillUnmount() {
    this.dataHandler.setEventListener(null);
  }

  handleSelectedShot = shotId =>
    this.props.onSelect({
      id: shotId,
      type: CONTENT_REQUEST_DETAILS_LISTS.SHOTS_TYPE,
    });

  onFetchCallback = response => {
    this.props.updateShotsData(response);
    this.props.hideLoader();
  };

  errorCallback = () => {
    if (!this.selfCanceled) {
      this.props.hideLoader();
    }
    this.selfCanceled = false;
  };

  createShotFetchHandler = () => {
    this.selfCanceled = true;
    this.cancelPreviousRequest();
    this.props.showLoader();
    this.props.resetShotsData();
    this.fetchShotsHandler = shotListHandler(
      this.props.contentRequestId,
      this.onFetchCallback,
      this.errorCallback,
    );
  };

  cancelPreviousRequest = () => {
    this.fetchShotsHandler && this.fetchShotsHandler.cancelExistingRequests();
  };

  shotListEventListener = args => {
    switch (args.event) {
      case COMMON_ACTIONS.TOGGLE_CONFIRM:
        this.props.toggleConfirmDialog(args.data);
        break;
      case SHOT_LIST_EVENT.DELETE_SHOT:
        this.props.deleteShot(args.data);
        break;
    }
  };
}

const mapStateToProps = state => ({
  shots: state.shotsInfo.shots,
  shotDict: state.shotsInfo.shotDict,
  listMetaInfo: state.common.shot.list,
  isLoading: state.common.showLoader,
});

const mapDispatchToProps = {
  updateShotsData,
  showLoader,
  hideLoader,
  resetShotsData,
  deleteShot,
  toggleConfirmDialog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShotList);
