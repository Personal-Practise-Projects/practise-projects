import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatePicker from '../../form-components/DatePicker';
import Loader from '../../components/Loader';
import { EmptyState } from './components/EmptyState';
import CustomAccordion from '../../components/CustomAccordion';
import ProductionViewAccordionBody from './components/productionViewAccordionBody';
import ProductionViewAccordionHeader from './components/productionViewAccordionHeader';
import SubHeader from '../../components/SubHeader';
import ProductionViewController from './controller';
import Filter from '../../components/Filter';
import { filterList, StringHelper } from '../../helpers/utils';
import {
  fetchProductionViewCards,
  fetchProductionViewCollaborators,
  getFilterData,
} from './services';
import { datePickerConfig } from './config';
import {
  AVATAR_STAGE,
  GLOBAL_EVENT_TYPE,
  LOADER,
  PRODUCTION_BOARD_STATE,
} from '../../common/constants';
import SelectItem from '../../components/SelectItem';
import { resetAvatarList } from '../../actions/avatarWrapperActions';
import { unSelectAllEvent } from '../../components/SelectItem/actions';
import { BaseFilterController } from '../../components/Filter/controllers/base';
import { storeActiveScreen } from '../../components/Filter/action';
import { filterShots, updateTimestamp } from './actions';

// Import Page Specific Styles
import './styles/ProductionViewPage.scss';

class ProductionViewDetails extends React.Component {
  constructor(props) {
    super(props);
    this.filterController = new BaseFilterController();
    this.state = {
      showLoader: true,
    };
    this.dataController = new ProductionViewController(
      props,
      {},
      this.eventListener,
    );
    this.props.storeActiveScreen(PRODUCTION_BOARD_STATE.SPRINT);
  }

  render() {
    this.buildDisplayShots();
    return (
      <main id="production-view-page">
        {this.getProductionViewHeader()}
        {this.getProductionViewBody()}
      </main>
    );
  }

  componentDidMount() {
    this.props.fetchProductionViewCards(
      this.props.selectedTimestamp,
      this.eventListener,
    );
    this.props.fetchProductionViewCollaborators(this.props.selectedTimestamp);
    // Filters data (i.e. Brands, Categories, Setups etc)
    this.props.getFilterData(
      this.props.activeScreen,
      this.props.filtersConfig,
      this.props.shots,
    );
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedTimestamp !== this.props.selectedTimestamp) {
      this.dataController.setProps(this.props);
    }
    if (
      prevProps.collaborators !== this.props.collaborators ||
      prevProps.selectedFilters !== this.props.selectedFilters
    ) {
      const shotIdsArray = Object.values(this.props.collaborators)
        .map(shot => shot.shots)
        .flat();
      this.props.filterShots({
        shotIdsArray,
        selectedFilters: this.props.selectedFilters,
      });
    }
    // Filters data (i.e. Brands, Categories, Setups etc)
    if (
      prevProps.filtersConfig !== this.props.filtersConfig ||
      prevProps.shots !== this.props.shots
    ) {
      this.props.getFilterData(
        this.props.activeScreen,
        this.props.filtersConfig,
        this.props.shots,
      );
    }
  }

  componentWillUnmount() {
    this.props.resetAvatarList(AVATAR_STAGE.PRODUCTION_VIEW);
  }

  buildDisplayShots = () => {
    this.shots = filterList(
      this.props.filteredShots,
      this.dataController.displayShotFilter,
    );
  };

  getProductionViewHeader = () => {
    const rightChildren = [
      <Filter
        key="production-view-filter"
        filterType={GLOBAL_EVENT_TYPE.SHOT}
        controller={this.filterController}
      />,
      <DatePicker
        key="production-view-datepicker"
        dataHandler={this.dataController}
        {...datePickerConfig}
      />,
    ];

    const subtitle = {
      subtitle: StringHelper.format(
        '## shot(s) scheduled for ##',
        this.shots ? this.shots.length : 0,
        this.dataController.getDisplayDate(),
      ),
    };

    return (
      <SubHeader
        data={{
          title: 'Production view',
          ...subtitle,
        }}
        startChildren={this.getStartChild()}
        bulkAction={{
          type: GLOBAL_EVENT_TYPE.SHOT,
          pageType: PRODUCTION_BOARD_STATE.SPRINT,
        }}
        rightChildren={rightChildren}
        dataHandler={this.dataController}
      />
    );
  };

  getStartChild() {
    const selectItem = [
      <SelectItem
        all
        key="production-view-select-item"
        header={{ type: GLOBAL_EVENT_TYPE.SHOT }}
        item={this.props.selectableShots}
        parent={PRODUCTION_BOARD_STATE.SPRINT}
        showTitle
      />,
    ];
    return this.props.allowBulk ? selectItem : [];
  }

  getProductionViewBody = () =>
    this.state.showLoader ? <Loader /> : this.getShots();

  getShots() {
    return this.shots.length ? (
      <div
        className={`custom-accordion-wrapper ${
          this.props.inBulkUpdateState ? 'bulk-action' : ''
        }`}
      >
        <CustomAccordion
          items={this.shots}
          preExpanded={[0]}
          allowZeroExpanded
          allowBulk={this.props.allowBulk}
          AccordianHeader={ProductionViewAccordionHeader}
          AccordianBody={ProductionViewAccordionBody}
        />
      </div>
    ) : (
      <EmptyState />
    );
  }

  eventListener = args => {
    switch (args.event) {
      case LOADER:
        this.setState({
          showLoader: args.data,
        });
        break;
      default:
        break;
    }
  };
}

ProductionViewDetails.propTypes = {
  allowBulk: PropTypes.bool,
  shots: PropTypes.array,
  selectableShots: PropTypes.array,
  updateTimestamp: PropTypes.func,
};

const mapStateToProps = state => {
  const filters = state.filters[state.filters.activeScreen]
    ? state.filters[state.filters.activeScreen].selectedFilters
    : {};
  return {
    selectedTimestamp: state.productionView.selectedTimestamp,
    selectedFilters: filters,
    activeScreen: state.filters.activeScreen,
    filtersConfig: state.common.shot.filters[state.filters.activeScreen],
    shots: state.productionView.shots,
    filteredShots: state.productionView.filteredShots,
    selectableShots: state.productionView.selectableShots,
    allowBulk:
      (
        state.common[GLOBAL_EVENT_TYPE.SHOT].bulkMeta[
          PRODUCTION_BOARD_STATE.SPRINT
        ] || []
      ).length > 0,
    metaInfo: state.common.shot.productionView,
    collaborators: state.avatar[AVATAR_STAGE.PRODUCTION_VIEW].selectedAvatars,
    inBulkUpdateState: state.selectedItems[GLOBAL_EVENT_TYPE.SHOT].count > 0,
  };
};

const mapDispatchToProps = {
  storeActiveScreen,
  fetchProductionViewCards,
  unSelectAllEvent,
  fetchProductionViewCollaborators,
  resetAvatarList,
  filterShots,
  getFilterData,
  updateTimestamp,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductionViewDetails);
