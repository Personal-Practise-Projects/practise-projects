import React from 'react';
import { connect } from 'react-redux';
import ComponentRenderFactory from '../ComponentFactory';
import ContentRequestDetailHeader from '../ContentRequestDetailHeader';

import Loader from '../Loader';
import { DataHandler } from './dataHandler';

import styles from './ContentRequestDetail.scss';

class ContentRequestDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentRequest: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const olderCRId = prevState.contentRequest && prevState.contentRequest.id;
    if (
      nextProps.contentRequestsDict &&
      nextProps.contentRequestId !== olderCRId
    ) {
      return {
        contentRequest:
          nextProps.contentRequestsDict[nextProps.contentRequestId],
      };
    }
    return {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.contentRequestId !== nextProps.contentRequestId ||
      this.state.contentRequest !== nextState.contentRequest
    );
  }

  render() {
    this.dataHandler = this.state.contentRequest
      ? new DataHandler(this.state.contentRequest, this.props.dispatch)
      : null;
    return (
      <div className="splitpage-drawer animated slideInRight" style={styles}>
        {this.dataHandler ? (
          <React.Fragment>
            <ContentRequestDetailHeader
              contentRequest={this.state.contentRequest}
              onClick={this.closePanel}
              dataHandler={this.dataHandler}
              classes="content-request-header"
            />
            <div className="splitpage-drawer-body">
              {this.props.headers.map((header, index) =>
                ComponentRenderFactory.component(
                  header,
                  index,
                  this.dataHandler,
                ),
              )}
            </div>
          </React.Fragment>
        ) : (
          <Loader />
        )}
      </div>
    );
  }

  closePanel = () => this.props.closePanel(null);
}

const mapStateToProps = state => ({
  contentRequestsDict: state.contentRequest.dataDict,
  headers: state.contentRequest.metaInfo.detail_headers,
});

export default connect(
  mapStateToProps,
  null,
)(ContentRequestDetail);
