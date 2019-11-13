import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import '../../components/AddRow/AddRow.scss';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';
import SubHeader from '../../components/SubHeader';
import SplitListPage from '../SplitListTitlePage';
import ShotList from '../../components/ShotList';
import {
  addShot,
  resetShotsData,
  updateShotByPayload,
} from '../../actions/shotsActions';
import { queryParamsFromDict } from '../../helpers/common';
import { getCategoryList } from '../../helpers/services';
import { DetailView } from './Loadable';
import ShotListSubHeader from '../../components/ShotListSubHeader';

import './styles/ShotsPage.scss';

class ShotsPage extends React.Component {
  constructor(props) {
    super(props);
    const params = new URL(document.location).searchParams;
    let paramShotId = params.get('shotId') && parseInt(params.get('shotId'));
    paramShotId = props.shotDict[paramShotId] ? paramShotId : undefined;
    this.state = {
      contentRequestId: params.get('q'),
      categoryList: [],
      selectedShotId: paramShotId,
      searchHandler: null,
    };
  }

  setSearchHandler = searchHandler => {
    this.setState({
      searchHandler,
    });
  };

  componentDidMount() {
    this.onFetchCategory();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const params = new URL(document.location).searchParams;
    let paramShotId = params.get('shotId') && parseInt(params.get('shotId'));
    paramShotId = nextProps.shotDict[paramShotId] ? paramShotId : undefined;
    if (
      prevState.contentRequestId !== params.get('q') ||
      prevState.selectedShotId !== paramShotId
    ) {
      return {
        contentRequestId: params.get('q'),
        selectedShotId: paramShotId,
      };
    }
    return {};
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.state.contentRequestId !== nextState.contentRequestId ||
      this.state.selectedShotId !== nextState.selectedShotId ||
      this.state.searchHandler !== nextState.searchHandler ||
      this.state.categoryList !== nextState.categoryList
    );
  }

  render() {
    return (
      <SplitListPage
        id="shot-page"
        classes=""
        headerComponent={this.getHeaderComponent()}
        listComponent={this.getListingComponent()}
        detailComponent={this.getDetailComponent()}
      />
    );
  }

  componentWillUnmount() {
    this.props.resetShotsData();
  }

  onFetchCategory = () => {
    getCategoryList(parsedData => {
      this.setState({
        categoryList: parsedData,
      });
    });
  };

  getListingComponent = () => (
    <ShotList
      onSelect={this.onShotSelected}
      contentRequestId={this.state.contentRequestId}
      setSearchHandler={this.setSearchHandler}
    />
  );

  getDetailComponent = () => {
    const selectedShot = this.props.shotDict[this.state.selectedShotId];
    return (
      selectedShot && (
        <div className="splitpage-drawer animated slideInRight">
          <DetailView
            shot={selectedShot}
            eventListener={this.shotDetailsEventListener}
          />
        </div>
      )
    );
  };

  getHeaderComponent = () => {
    const leftChildren = [];
    const rightChildren = [
      <ShotListSubHeader
        categoryList={this.state.categoryList}
        searchHandler={this.state.searchHandler}
        shotSubHeaderEventListener={this.shotSubHeaderEventListener}
      />,
    ];

    return (
      <SubHeader
        data={{ title: `CR_${this.state.contentRequestId}` }}
        leftChildren={leftChildren}
        rightChildren={rightChildren}
      />
    );
  };

  onAddAction = data => {
    this.props.addShot(this.state.contentRequestId, data, response => {
      this.onShotSelected(response);
    });
  };

  onShotSelected = shot => {
    this.props.history.push({
      search: queryParamsFromDict({
        q: this.state.contentRequestId,
        shotId: shot ? shot.id : null,
      }),
    });
    this.setState({});
  };

  shotDetailsEventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS:
        this.props.updateShotByPayload(args.payload);
        break;
      case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
        this.onShotSelected();
        break;
    }
  };

  shotSubHeaderEventListener = args => {
    this.onAddAction(args);
  };
}

const mapStateToProps = state => ({
  shotDict: state.shotsInfo.shotDict,
  refreshState: state.base.showNotificationList,
  selectedItems: state.selectedItems,
});

const mapDispatchToProps = {
  addShot,
  updateShotByPayload,
  resetShotsData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ShotsPage));
