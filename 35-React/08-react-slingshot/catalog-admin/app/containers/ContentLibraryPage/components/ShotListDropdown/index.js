import React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchShotList,
  setShot,
} from '../../../../actions/contentLibraryActions';

class ShotDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.shotNode = React.createRef();
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentDidUpdate(prevProps) {
    // reset shot name whenever CRID changes
    if (this.props.selectedContent.id !== prevProps.selectedContent.id) {
      if (this.state.menuOpen) {
        this.toggleMenu();
      }
      this.props.fetchShotList(
        this.props.selectedBrand.id,
        this.props.selectedContent.id,
      );
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = event => {
    if (this.shotNode.contains(event.target)) {
      return;
    }
    this.handleClickOutside();
  };

  handleClickOutside = () => {
    if (this.state.menuOpen) {
      this.toggleMenu();
    }
  };

  onSelect = event => {
    this.props.setShot({
      id: parseInt(event.target.dataset.shotId, 10),
      name: event.target.dataset.shotName,
    });
    this.toggleMenu();
  };

  toggleMenu = () => {
    this.setState(state => ({
      menuOpen: !state.menuOpen,
    }));
  };

  render() {
    return (
      <div
        className="shot-list-dropdown-component"
        ref={shotNode => {
          this.shotNode = shotNode;
        }}
        onBlur={this.handleClick}
      >
        {this.props.shotList.length !== 0 &&
          this.props.selectedContent.id !== 0 && (
            <div>
              <div className="shot-section">
                <button
                  className="shot-button"
                  type="button"
                  onClick={this.toggleMenu}
                >
                  {this.props.selectedShot.name}
                  <i className="arrow-down" />
                </button>
              </div>
              {this.state.menuOpen && (
                <div className="content-drop">
                  <div className="popup">
                    {this.props.shotList.map(shot => (
                      <button
                        key={shot.id}
                        type="button"
                        className="shot-list-button"
                        data-shot-id={shot.id}
                        data-shot-name={shot.name}
                        onClick={this.onSelect}
                      >
                        {shot.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    );
  }
}

ShotDropdown.propTypes = {
  fetchShotList: PropTypes.func,
  shotList: PropTypes.array,
  selectedBrand: PropTypes.object,
  selectedContent: PropTypes.object,
  selectedShot: PropTypes.object,
  setShot: PropTypes.func,
};

const mapStateToProps = state => ({
  selectedBrand: state.contentLibrary.brand,
  selectedContent: state.contentLibrary.content,
  selectedShot: state.contentLibrary.shot,
  shotList: state.contentLibrary.shotList,
});

const mapDispatchToProps = {
  fetchShotList,
  setShot,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShotDropdown);
