import React from 'react';
// Import Component Specific Styling
import './ShotOptionsDropDown.scss';

class ShotOptionsDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
    };
  }

  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside = e => {
    if (!this.node || this.node.contains(e.target)) {
      return;
    }
    this.setState({
      listOpen: false,
    });
  };

  toggleList() {
    const currentState = this.state.listOpen;
    this.setState({
      listOpen: !currentState,
    });
  }

  onDropDownSelect() {
    this.toggleList();
  }

  render() {
    const { listOpen } = this.state;
    return (
      <div
        className={
          listOpen
            ? 'searchable-dropdown expanded-dropdown position-relative'
            : 'searchable-dropdown collapsed-dropdown position-relative'
        }
        ref={node => {
          this.node = node;
        }}
      >
        <button
          type="button"
          className="dropdown-trigger rubik-semibold d-block"
          onClick={() => this.toggleList()}
        >
          <i className="icon-vertical-hamburger" />
        </button>
        <div className="dropdown-drawer">
          <div className="listing-area source-san-semi position-relative">
            <button
              type="button"
              className="listing-area-item d-flex align-items-center justify-content-start"
              onClick={() => this.onDropDownSelect()}
            >
              Remove from production calendar
            </button>
            <button
              type="button"
              className="listing-area-item d-flex align-items-center justify-content-start"
              onClick={() => this.onDropDownSelect()}
            >
              Clone
            </button>
            <button
              type="button"
              className="listing-area-item d-flex align-items-center justify-content-start"
              onClick={() => this.onDropDownSelect()}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ShotOptionsDropDown;
