import React from 'react';

import { connect } from 'react-redux';
import { FetchActor } from './dataHandler';
import {
  deleteActor,
  resetActorStore,
  updateActorStore,
} from '../../actions/actorActions';

import Loader from '../Loader';
import Table from '../Table';
import { actorListParser } from './parser';
import './ActorList.scss';

class ActorListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: props.searchString,
      actorType: props.actorType,
      shouldResetStore: false,
      isEmptyResult: false,
      showLoader: false,
    };
    this.fetchActor = new FetchActor(
      this.onFetch,
      this.errorCallback,
      props.actorType,
    );
  }

  componentDidMount() {
    this.fetchActor.fetch();
  }

  // TODO Remove as it going to be deprecated.
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.actorType !== this.props.actorType) {
      this.setState(
        {
          actorType: this.props.actorType,
          actors: [],
          shouldResetStore: true,
          isEmptyResult: false,
          showLoader: true,
        },
        () => {
          this.fetchActor = new FetchActor(
            this.onFetch,
            this.errorCallback,
            this.state.actorType,
          );
          this.fetchActor.fetch();
        },
      );
    } else if (prevProps.searchString !== this.props.searchString) {
      this.setState(
        {
          ...this.state,
          searchString: this.props.searchString,
          actors: [],
          shouldResetStore: true,
          isEmptyResult: false,
          showLoader: true,
        },
        () => {
          this.fetchActor = new FetchActor(
            this.onFetch,
            this.errorCallback,
            this.state.actorType,
            this.state.searchString,
          );
          this.fetchActor.fetch();
        },
      );
    }
  }

  componentWillUnmount() {
    this.props.resetActorStore();
  }

  errorCallback = errorResponse => this.setState({ showLoader: false });

  onFetch = (metaInfo, data) => {
    if (this.state.shouldResetStore) {
      this.props.resetActorStore();
    }
    this.props.updateActorStore(metaInfo, data);
    this.setState({ showLoader: false, shouldResetStore: false });
    if (!data.length) {
      this.setState({ isEmptyResult: true });
    }
  };

  onDelete = event => this.props.onDelete(event.target.id);

  onSelect = actorId => this.props.onSelect(this.props.actorDict[actorId]);

  render() {
    const { metaInfo, actors } = this.props;
    const { headers, data } = actorListParser(metaInfo, actors);
    return data.length || this.state.isEmptyResult ? (
      <div className="actor-page position-relative">
        <Table
          customClassName="actor-page-table"
          data={data}
          handleSelectedRow={this.onSelect}
          headers={headers}
          onEndScroll={this.fetchActor.fetch}
          showLoader={this.state.showLoader}
        />
      </div>
    ) : (
      <Loader display />
    );
  }
}

const mapStateToProps = state => ({
  actors: state.actors.data,
  metaInfo: state.actors.meta_info,
  actorDict: state.actors.actorDict,
});

const mapDispatchToProps = {
  updateActorStore,
  onDelete: deleteActor,
  resetActorStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorListView);
