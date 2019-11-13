import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ActorList from '../../components/ActorList';
import ActorDetailView from '../../components/ActorDetailView';
import Search from '../../components/Search';
import SplitListPage from '../SplitListTitlePage';
import SubHeader from '../../components/SubHeader';
import AddRow from '../../components/AddRow';
import { PLACEHOLDER_MAP } from './constants';
import { actorTypes } from './dataHandler';
import { addActor } from '../../actions/actorActions';

import styles from './ActorPage.scss';

class ActorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      selectedActor: '',
      selectedActorType: 'models',
      searchPlaceHolder: PLACEHOLDER_MAP.models,
    };
  }

  onAddActor = event => {
    this.props.addActor(
      this.state.selectedActorType,
      event.target.value,
      actor => {
        this.onSelect(actor);
      },
    );
  };

  onSelect = selectedActor => this.setState({ selectedActor });

  onTalentTypeSelection = event =>
    this.setState({
      selectedActorType: event.target.value,
      searchString: '',
      selectedActor: '',
      searchPlaceHolder: PLACEHOLDER_MAP[event.target.value],
    });

  onSearch = result =>
    this.setState({
      searchString: result,
      selectedActor: '',
    });

  getHeaderComponent = () => {
    // TODO Use Dropdown, Since now dropdown component is build using ID. It should be modified
    // first.
    const leftChildren = [
      <React.Fragment key="talent-type-dropdown">
        <select
          onChange={this.onTalentTypeSelection}
          className="talent-selection"
        >
          {actorTypes.map((item, index) => (
            <option key={index} value={item.value}>
              {item.title}
            </option>
          ))}
        </select>
      </React.Fragment>,
    ];
    const rightChildren = [
      <AddRow
        key="add-actor-cta"
        displayText="Add Actor"
        addAction={this.onAddActor}
        type="DEFAULT"
        placeHolder="Please type actor name."
      />,
      <Search
        key="actor-search-input"
        value={this.state.searchString}
        placeholder={this.state.searchPlaceHolder}
        handler={this.onSearch}
        classes="expanded-search"
      />,
    ];

    return (
      <SubHeader
        data={{ title: 'Talent' }}
        leftChildren={leftChildren}
        rightChildren={rightChildren}
      />
    );
  };

  getListComponent = () => (
    <ActorList
      actorType={this.state.selectedActorType}
      searchString={this.state.searchString}
      onSelect={this.onSelect}
    />
  );

  getDetailComponent = () =>
    this.state.selectedActor && (
      <ActorDetailView
        selectedActor={this.state.selectedActor}
        selectedActorType={this.state.selectedActorType}
        closePanel={this.onSelect}
        onClick={this.onSelect}
      />
    );

  render() {
    return (
      <SplitListPage
        id="actor-page"
        style={styles}
        headerComponent={this.getHeaderComponent()}
        listComponent={this.getListComponent()}
        detailComponent={this.getDetailComponent()}
      />
    );
  }
}

ActorPage.propTypes = {
  addActor: PropTypes.func,
};

const mapDispatchToProps = { addActor };

export default connect(
  null,
  mapDispatchToProps,
)(ActorPage);
