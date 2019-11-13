import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './style.scss';
import {
  fetchContents,
  setContent,
  setTimelineStatus,
} from '../../../../actions/contentLibraryActions';
import { formatDateToString } from '../../../../helpers/common';

class ContentRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
    this.contentNode = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  calculateDate = timestamp => formatDateToString(timestamp);

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
    if (this.props.selectedBrand.id !== 0) {
      this.props.fetchContents(this.props.selectedBrand.id);
    }
  }

  // need this update so it would update timeline and items/photos in CRID
  componentDidUpdate(prevProps) {
    // if brand changed then reset the content to default and get new CRID list
    if (this.props.selectedBrand.id !== prevProps.selectedBrand.id) {
      if (this.state.menuOpen) {
        this.toggleMenu();
      }
      this.props.fetchContents(this.props.selectedBrand.id);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  cridDisplayName = (crid, date) => `CRID ${crid} - ${date}`;

  handleClick = event => {
    if (this.contentNode.contains(event.target)) {
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
    // have to use parseInt because event.target.dataset.data would give the timestamp in String
    const dateInInteger = parseInt(event.target.dataset.date, 10);
    const currentDate = this.calculateDate(dateInInteger);
    const crid = parseInt(event.target.value, 10);
    const eventStatus = event.target.dataset.status;

    this.props.setContent({
      id: crid,
      name: this.cridDisplayName(crid, currentDate),
    });
    this.props.setTimelineStatus(eventStatus);
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
        className="content-request-component"
        ref={contentNode => {
          this.contentNode = contentNode;
        }}
        onBlur={this.handleClick}
      >
        {this.props.contentList.length > 0 && ( // if there aren't any CRIDs then don't display CRID dropdown
          <div>
            <div className="content-section">
              <button
                className="content-button"
                type="button"
                onClick={this.toggleMenu}
              >
                {this.props.selectedContent.name}
                <i className="arrow-down" />
              </button>
            </div>
            {this.state.menuOpen && (
              <div className="content-drop">
                <div className="popup">
                  {this.props.contentList.map(content => (
                    <button
                      type="button"
                      className="content-list-button"
                      value={content.id}
                      data-status={content.status}
                      data-date={content.date}
                      onClick={this.onSelect}
                      key={content.id}
                    >
                      {content.name}
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

ContentRequest.propTypes = {
  contentList: PropTypes.array,
  fetchContents: PropTypes.func,
  selectedBrand: PropTypes.object,
  selectedContent: PropTypes.object,
  setContent: PropTypes.func,
  setTimelineStatus: PropTypes.func,
};

const mapStateToProps = state => ({
  contentList: state.contentLibrary.contentList,
  selectedBrand: state.contentLibrary.brand,
  selectedContent: state.contentLibrary.content,
});

const mapDispatchToProps = {
  fetchContents,
  setContent,
  setTimelineStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentRequest);
