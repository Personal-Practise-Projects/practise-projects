import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BasePage from '../BasePage';
import ProductionBoard from '../../components/ProductionBoard';
import ShotDetailView from '../../components/ShotDetailsView';
import Search from '../../components/Search';
import SubHeader from '../../components/SubHeader';
import Filter from '../../components/Filter';
import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';
import { GLOBAL_EVENT_TYPE } from '../../common/constants';
import { getPageTitle } from './helpers';
import { storeActiveScreen } from '../../components/Filter/action';
import {
  onCollaboratorSelect,
  onSwimlaneSearch,
} from '../../components/ShotSwimlane/actions';
import { SearchHandler } from './searchHandler';
import { unSelectAllEvent } from '../../components/SelectItem/actions';
import { BaseFilterController } from '../../components/Filter/controllers/base';
import { fetchProductionBoardCollaborator } from './services';
import ShotCollaboratorController from './controller';

// Import Page Specific Styles
import './ProductionBoardPage.scss';

class ProductionBoardPage extends React.Component {
  constructor(props) {
    super(props);
    this.filterController = new BaseFilterController();
    this.state = {
      drawerOpen: false,
    };
    this.searchHandler = new SearchHandler(this.onSearch);
    this.props.storeActiveScreen(this.props.metaInfo.stage); // Store active screen in redux - For Filters
    this.dataHandler = new ShotCollaboratorController(
      this.props.metaInfo.stage,
    );
  }

  onSearch = searchString => {
    this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
    this.props.onSwimlaneSearch(searchString);
  };

  componentDidMount() {
    this.props.fetchProductionBoardCollaborator(this.props.metaInfo.stage);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.collaborators !== this.props.collaborators) {
      const shots = Object.values(this.props.collaborators)
        .map(shot => shot.shots)
        .flat();
      this.props.unSelectAllEvent(GLOBAL_EVENT_TYPE.SHOT);
      this.props.onCollaboratorSelect(shots);
    }
    if (prevProps.shots !== this.props.shots) {
      this.props.fetchProductionBoardCollaborator(this.props.metaInfo.stage);
    }
  }

  render() {
    const searchPlaceholder = 'Search by Brand, CR ID & Category';
    return (
      <main id="production-board-page">
        <BasePage>
          <SubHeader
            data={{ title: getPageTitle(this.props.metaInfo.stage) }}
            bulkAction={{
              type: GLOBAL_EVENT_TYPE.SHOT,
              pageType: this.props.metaInfo.stage,
            }}
            dataHandler={this.dataHandler}
            rightChildren={[
              <Search
                key="production-board-search"
                placeholder={searchPlaceholder}
                handler={this.searchHandler}
                width={420}
              />,
              <Filter
                key="production-board-filter"
                filterType={GLOBAL_EVENT_TYPE.SHOT}
                controller={this.filterController}
              />,
            ]}
          />
          <main
            className={
              this.state.drawerOpen
                ? 'splitpage-wrapper splitpage-expanded kanban-expanded position-relative'
                : 'splitpage-wrapper splitpage-collapsed kanban-collapsed position-relative'
            }
          >
            <div className="splitpage-board">
              <div className="splitpage-content splitpage-heightened position-relative">
                <div className="production-board">
                  <ProductionBoard
                    extraInfo={this.props.metaInfo}
                    eventListener={this.shotDetailsEventListener}
                  />
                </div>
              </div>
            </div>
            {this.state.drawerOpen && this.state.shotDetailsProps && (
              <div className="splitpage-drawer animated slideInRight">
                <ShotDetailView
                  shot={this.state.shotDetailsProps.selectedShotId}
                  eventListener={
                    this.state.shotDetailsProps.shotDetailsEventListener
                  }
                />
              </div>
            )}
          </main>
        </BasePage>
      </main>
    );
  }

  shotDetailsEventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.OPEN_SHOT_DETAIL:
        this.setState({
          drawerOpen: true,
          shotDetailsProps: args.shotDetailsProps,
        });
        break;
      case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
        this.setState({ drawerOpen: false });
        break;
      default:
        break;
    }
  };
}

ProductionBoardPage.propTypes = {
  shots: PropTypes.object,
  collaborators: PropTypes.object,
  fetchProductionBoardCollaborator: PropTypes.func,
  metaInfo: PropTypes.object.isRequired,
  onCollaboratorSelect: PropTypes.func,
  onSwimlaneSearch: PropTypes.func.isRequired,
  storeActiveScreen: PropTypes.func.isRequired,
  unSelectAllEvent: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  shots: state.swimlane.shots,
  collaborators:
    ownProps.metaInfo && state.avatar[ownProps.metaInfo.stage].selectedAvatars,
});
const mapDispatchToProps = {
  storeActiveScreen,
  onSwimlaneSearch,
  unSelectAllEvent,
  fetchProductionBoardCollaborator,
  onCollaboratorSelect,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductionBoardPage);
