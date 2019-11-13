import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ContentRequestDetail from '../../components/ContentRequestDetail';
import ContentRequestList from '../../components/ContentRequestList';
import Search from '../../components/Search';
import SplitListPage from '../SplitListTitlePage';
import SubHeader from '../../components/SubHeader';
import { queryParamsFromDict } from '../../helpers/common';

import styles from './ContentRequestPage.scss';
import ContentRequestDataHandler from './dataHandler';
import { COMMON_ACTIONS } from '../../common/constants';
import { addContentRequest } from '../../actions/contentRequestActions';
import DropDownCreateComponent from './createComponent';

const SEARCH_PLACEHOLDER = "Search for Brands, CR ID's, Channel";

class ContentRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataHandler = new ContentRequestDataHandler();
    this.dataHandler.setEventListener(this.eventListener);
    this.state = {
      searchString: '',
      selectedContentRequestId: null,
      selectedBrandId: null,
      brands: null,
      createHeader: {
        title: 'Create content request',
        uid: '#brand',
        placeholder: 'Brand name',
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const params = new URL(document.location).searchParams;
    const crId = params.get('crId') && parseInt(params.get('crId'), 10);
    if (
      prevState.selectedBrandId !== params.get('b') ||
      prevState.selectedContentRequestId !== crId
    ) {
      return {
        selectedBrandId: params.get('b'),
        selectedContentRequestId: crId,
      };
    }
    return {};
  }

  componentDidMount() {
    this.dataHandler.getOptionalInfo(this.state.createHeader, response => {
      this.setState({ brands: response });
    });
  }

  render() {
    return (
      <SplitListPage
        id="content-request-page"
        style={styles}
        detailComponent={this.getDetailComponent()}
        headerComponent={this.getHeaderComponent()}
        listComponent={this.getListComponent()}
      />
    );
  }

  getDetailComponent = () => {
    const contentRequest = this.props.contentRequestsDict[
      this.state.selectedContentRequestId
    ];
    return (
      contentRequest && (
        <ContentRequestDetail
          contentRequestId={this.state.selectedContentRequestId}
          closePanel={this.onSelect}
        />
      )
    );
  };

  getListComponent = () => (
    <ContentRequestList
      searchString={this.state.searchString}
      onSelect={this.onSelect}
      selectedBrandId={this.state.selectedBrandId}
    />
  );

  getHeaderComponent = () => (
    <SubHeader
      dataHandler={this.dataHandler}
      data={{ title: 'Content requests' }}
      rightChildren={this.getHeaderRightChildren()}
    />
  );

  getHeaderRightChildren = () => [
    <React.Fragment key="crp-header-container">
      <Search
        key="crp-create-component-search"
        searchString={this.state.searchString}
        placeholder={SEARCH_PLACEHOLDER}
        handler={this.onSearch}
        classes="expanded-search"
        autoFocus
      />
      {this.state.brands && (
        <DropDownCreateComponent
          key="crp-dropdown-create-component"
          options={this.state.brands}
          header={this.state.createHeader}
          dataHandler={this.dataHandler}
        />
      )}
    </React.Fragment>,
  ];

  onAddAction = data => {
    this.props.addContentRequest(data, response => {
      this.onSelect(response);
    });
  };

  onSearch = result => {
    this.setState({ searchString: result, selectedContentRequestId: '' });
  };

  onSelect = selectedContentRequest => {
    this.props.history.push({
      search: queryParamsFromDict({
        b: this.state.selectedBrandId,
        crId: selectedContentRequest ? selectedContentRequest.id : null,
      }),
    });
    this.setState({});
  };

  eventListener = args => {
    switch (args.event) {
      case COMMON_ACTIONS.CREATE_NEW:
        this.onAddAction(args.data);
        break;
      default:
        break;
    }
  };
}

const mapStateToProps = state => ({
  contentRequestsDict: state.contentRequest.dataDict,
  refreshState: state.base.showNotificationList,
});

const mapDispatchToProps = {
  addContentRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ContentRequestPage));

ContentRequestPage.propTypes = {
  contentRequestsDict: PropTypes.object,
  addContentRequest: PropTypes.func,
  history: PropTypes.object,
};
