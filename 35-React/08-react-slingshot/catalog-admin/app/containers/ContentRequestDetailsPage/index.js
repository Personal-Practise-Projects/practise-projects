import React from 'react';
import { connect } from 'react-redux';

import ContentRequestPageManager from './pageManager';
import SplitListPage from '../SplitListTitlePage';

import { DETAILS_VIEW_EVENT } from '../../components/ShotDetailsView/constants';
import { CONTENT_REQUEST_DETAILS_TABS } from '../../common/constants';
import { styles } from './ContentRequestDetailsPage.scss';

import { updateShotByPayload } from '../../actions/shotsActions';

class ContentRequestDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.tabManager = new ContentRequestPageManager(this.eventListener);
    this.state = {
      isPanelClosed: false,
      requestIdentifier: '',
    };
  }

  componentDidMount() {
    const params = new URL(document.location).searchParams;
    this.setState({ requestIdentifier: params.get('q') });
  }

  eventListener = args => {
    if (args) {
      switch (args.event) {
        case DETAILS_VIEW_EVENT.OPEN_DETAILS_PANEL:
          this.setState({
            isPanelClosed: false,
          });
          break;
        case DETAILS_VIEW_EVENT.CLOSE_DETAILS_PANEL:
          this.setState({
            isPanelClosed: true,
          });
          break;
        case DETAILS_VIEW_EVENT.UPDATED_SHOT_DETAILS:
          this.props.updateShotByPayload(args.payload);
          break;
      }
    }
  };

  render() {
    return (
      <SplitListPage
        style={styles}
        classes={this.tabManager.getParentStyleClass()}
        headerComponent={this.tabManager.getHeaderComponent(
          this.state.requestIdentifier,
        )}
        listComponent={this.tabManager.getListComponent()}
        detailComponent={this.tabManager.getDetailComponent(
          this.state.isPanelClosed,
        )}
      />
    );
  }

  componentWillUnmount() {
    this.tabManager.setSelectedTab(CONTENT_REQUEST_DETAILS_TABS.SHOT_DETAILS);
  }
}

const mapDispatchToProps = {
  updateShotByPayload,
};

export default connect(
  null,
  mapDispatchToProps,
)(ContentRequestDetailsPage);
