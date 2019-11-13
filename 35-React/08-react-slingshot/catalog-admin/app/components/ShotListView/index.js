import React from 'react';
import { connect } from 'react-redux';

import ShotList from '../ShotList';
import { getCategoryList } from '../../helpers/services';
import { addShot } from '../../actions/shotsActions';
import { CONTENT_REQUEST_DETAILS_LISTS, } from '../../common/constants';
import ShotListSubHeader from '../ShotListSubHeader';

import './ShotListView.scss';

class ShotListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      searchHandler: null,
    };
  }

  setSearchHandler = searchHandler => {
    this.setState({
      searchHandler,
    });
  };

  componentDidMount() {
    this.onFetchCategoryList();
  }

  onFetchCategoryList = () => {
    getCategoryList(parsedData => {
      this.setState({ categoryList: parsedData });
    });
  };

  onAddAction = data => {
    const params = new URL(document.location).searchParams;
    const requestIdentifier = params.get('q');

    this.props.addShot(requestIdentifier, data, response => {
      this.props.onSelect({
        shot: response,
        type: CONTENT_REQUEST_DETAILS_LISTS.SHOTS_TYPE,
      });
    });
  };

  render() {
    return (
      <div className="shot-list-view-component">
        <div className="header">
          <div className="header-left" />
          <div className="header-right">
            <ShotListSubHeader
              categoryList={this.state.categoryList}
              searchHandler={this.state.searchHandler}
              shotSubHeaderEventListener={this.shotSubHeaderEventListener}
            />
          </div>
        </div>
        <ShotList
          onSelect={data =>
            this.createShotDetailsInfo(this.getSelectedShotData(data.id))
          }
          contentRequestId={this.props.contentRequestId}
          setSearchHandler={this.setSearchHandler}
        />
      </div>
    );
  }

  createShotDetailsInfo = shotData => {
    this.props.onSelect({ shot: shotData });
  };

  getSelectedShotData = shotIdentifier =>
    this.props.shots.data.find(shot => shot.id === shotIdentifier);

  shotSubHeaderEventListener = args => {
    this.onAddAction(args);
  };
}

const mapStateToProps = state => ({
  shots: state.shotsInfo.shots,
  listMetaInfo: state.common.shot.list,
  selectedItems: state.selectedItems,
});

const mapDispatchToProps = {
  addShot,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShotListView);
