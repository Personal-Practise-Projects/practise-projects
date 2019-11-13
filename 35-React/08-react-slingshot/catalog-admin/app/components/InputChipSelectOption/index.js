import React from 'react';
import PropTypes from 'prop-types';
import Img from '../Img';
import Loader from '../../images/common/loader-blue.svg';

import './InputChipSelectOption.scss';

/** *
 * Options should contains array of objects with following key values
 * {
 *  id: {id of options if any },
 *  name: {display name mandatory},
 *  thumbnail: {display image}
 * }
 */
export default class InputChipSelectOption extends React.Component {
  getImage = imageUrl => {
    if (imageUrl) {
      return {
        background: `url(${imageUrl}) center no-repeat`,
        'background-size': 'cover',
      };
    }
    return '';
  };

  render() {
    const { options, isSearching, currentFocusedIndex } = this.props;
    return isSearching ? (
      <div className="option-loading d-flex align-items-center justify-content-center">
        <div className="flex-wrapper text-center">
          <Img src={Loader} alt="Loading" className="no-result-logo" />
          <span className="empty-body d-block">Data is loading</span>
        </div>
      </div>
    ) : options && options.length > 0 ? (
      <div className="dropdown-options">
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={getOptionClass(option, index, currentFocusedIndex)}
            disabled={this.props.optionSelected(option)}
            onMouseDown={event => {
              event.preventDefault();
              this.props.onDropDownSelect(option);
            }}
          >
            {option.thumbnail && (
              <span
                style={this.getImage(option.thumbnail)}
                className="option-image"
              />
            )}
            <div className="option-detail text-left">
              <span className="param-name">
                {option.name}
                {option.id === 0 ? ` (Add new)` : ''}
              </span>
            </div>
          </button>
        ))}
      </div>
    ) : (
      <div className="dropdown-options">
        <button
          type="button"
          className="option-wrapper option-switched d-flex position-relative"
          disabled
        >
          No matches found
        </button>
      </div>
    );
  }


}

function getOptionClass(option, index, currentFocusedIndex) {
  return `option-wrapper d-flex position-relative ${
    !option.thumbnail ? 'option-switched' : ''
    } ${index === currentFocusedIndex ? 'active-item' : ''}`;
}

InputChipSelectOption.propTypes = {
  options: PropTypes.array.isRequired,
};
