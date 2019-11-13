import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchBrands,
  setBrand,
} from '../../../../actions/contentLibraryActions';
import { CREATE_BRAND } from '../../constant';
import './style.scss';

class BrandDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      menuOpen: false,
    };
    this.brandNode = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  // need this for closing dropdown when user clicks on the Create New Brand
  closeDropdownBox = () => {
    this.toggleMenu();
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
    this.props.fetchBrands();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleChange(event) {
    const input = event.target.value;
    this.setState({
      searchInput: input,
    });
  }

  handleClick = event => {
    if (this.brandNode.contains(event.target)) {
      return;
    }
    this.handleClickOutside();
  };

  handleClickOutside = () => {
    if (this.state.menuOpen) {
      this.toggleMenu();
    }
  };

  filterNames = event => {
    const input = event.target.value;
    const filter = input.toUpperCase();
    // get all the buttons
    const optionList = document.getElementsByClassName('brand-button-choice');

    // change HTMLCollection to a pure array
    Array.from(optionList).forEach(compareOptionElement => {
      // store the text from the list to a variable in order to compare
      const compareOptionText =
        compareOptionElement.textContent || compareOptionElement.innerText;
      if (compareOptionText.toUpperCase().indexOf(filter) > -1) {
        // if the stored text has any matching words compared to
        // filter text then dont do anything to the display
        compareOptionElement.style.display = '';
      } else {
        // else (meaning it does not have matching text)
        // change the display on that list to none
        compareOptionElement.style.display = 'none';
      }
    });
  };

  onSelect = event => {
    this.props.setBrand({
      id: parseInt(event.target.value, 10),
      name: event.target.name,
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
        className="brand-dropdown-component"
        ref={brandNode => {
          this.brandNode = brandNode;
        }}
        onBlur={this.handleClick}
      >
        <div className="brand-section">
          <button
            className="brand-button"
            onClick={this.toggleMenu}
            type="button"
          >
            {this.props.selectedBrand.name}
            <i className="arrow-down" />
          </button>
        </div>
        {this.state.menuOpen && (
          <div className="content-drop">
            <div className="input-box">
              {/* Add auto-focus */}
              <input
                className="input-field"
                id="brand-input-field"
                onChange={this.handleChange}
                onKeyUp={this.filterNames}
                placeholder="Start typing to search"
                type="text"
                value={this.state.searchInput}
              />
            </div>
            <div className="list-brands">
              {this.props.brandList.map(brand => (
                <button
                  className="brand-button-choice brand-list-button"
                  name={brand.name}
                  onClick={this.onSelect}
                  type="button"
                  value={brand.id}
                  key={brand.id}
                >
                  {brand.name}
                </button>
              ))}
            </div>
            <div className="create-button">
              <button
                className="create-brand-button"
                onClick={this.closeDropdownBox}
                type="button"
              >
                <a href={CREATE_BRAND}>+ Create new brand</a>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

BrandDropdown.propTypes = {
  fetchBrands: PropTypes.func,
  selectedBrand: PropTypes.object,
  brandList: PropTypes.array,
  setBrand: PropTypes.func,
};

const mapStateToProps = state => ({
  selectedBrand: state.contentLibrary.brand,
  brandList: state.contentLibrary.brandList,
});

const mapDispatchToProps = {
  fetchBrands,
  setBrand,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrandDropdown);
