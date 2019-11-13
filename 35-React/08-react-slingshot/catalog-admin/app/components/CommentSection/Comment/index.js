import React from 'react';
import InputTrigger from 'react-input-trigger';
import { searchObject } from '../../../helpers/common';
import InputChipSelectOption from '../../InputChipSelectOption/index';

// Import Component Specific Styling
import './Comment.scss';
import { DOWN_ARROW, ENTER, UP_ARROW } from '../../../common/constants';

const TRIGGER_HOOK_TYPE = {
  START: 'start',
  CANCEL: 'cancel',
};

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mentionStart: null,
      currentFocusedIndex: 0,
      canShowOptions: false,
      searchData: props.users,
      searchText: null,
      value: '',
      noOptionFoundCount: 0,
      trigger: {
        keyCode: 50,
        shiftKey: true,
      },
    };
  }

  onDropDownSelect = option => {
    const { mentionStart } = this.state;
    let { value } = this.state;
    const { searchText } = this.state;
    const user = option;
    value = searchText
      ? value.substr(0, mentionStart) +
        value.substr(mentionStart + searchText.length)
      : value;
    const newValue = `${value.slice(0, mentionStart - 1)}[~${
      user.name
    }]${' '}${value.slice(mentionStart)}`;

    this.resetSearchState();
    this.endHandler();
    this.onChangeValue(newValue);
  };

  onTrigger = event => {
    const { hookType, cursor } = event;

    switch (hookType) {
      case TRIGGER_HOOK_TYPE.START:
        this.setState({
          mentionStart: cursor.selectionStart,
          canShowOptions: true,
          searchData: this.props.users,
        });
        break;
      default:
        this.resetSearchState();
        break;
    }
  };

  onType = event => {
    const startPosition = this.state.mentionStart;
    const endPosition = event.cursor.selectionStart;
    const searchText = event.text.substr(0, endPosition - startPosition);
    this.setState({
      searchText,
    });
    this.getSearchedOptions();
  };

  getSearchedOptions = () => {
    const searchData = searchObject(this.props.users, this.state.searchText, [
      'name',
    ]);
    if (
      this.state.searchText &&
      this.state.searchText.endsWith(' ') &&
      !searchData.length
    ) {
      const noOptionFoundCount = this.state.noOptionFoundCount + 1;
      if (noOptionFoundCount > 1) {
        this.resetSearchState();
        this.endHandler();
      } else {
        this.setState({
          noOptionFoundCount,
        });
      }
    }
    this.setState({
      searchData,
    });
  };

  onChangeValue = value => {
    this.setState({
      value,
    });

    this.props.updateData(value);
  };

  resetSearchState = () => {
    this.setState({
      mentionStart: null,
      canShowOptions: false,
      searchText: null,
      noOptionFoundCount: 0,
    });
  };

  handleKeyDown = event => {
    if (this.state.canShowOptions) {
      const { which } = event;
      const { currentFocusedIndex, searchData } = this.state;

      if (which === DOWN_ARROW) {
        // key code of the down arrow
        event.preventDefault();

        this.setState({
          currentFocusedIndex: (currentFocusedIndex + 1) % searchData.length,
        });
      } else if (which === UP_ARROW) {
        // key code for the up arrow
        event.preventDefault();

        if (currentFocusedIndex > 0)
          this.setState({
            currentFocusedIndex: (currentFocusedIndex - 1) % searchData.length,
          });
      } else if (which === ENTER) {
        // key code for enter
        event.preventDefault();

        let { value } = this.state;
        const { mentionStart } = this.state;
        const user = searchData[currentFocusedIndex];
        const { searchText } = this.state;
        value = searchText
          ? value.substr(0, mentionStart) +
            value.substr(mentionStart + searchText.length)
          : value;

        const newValue = `${value.slice(0, mentionStart - 1)}[~${
          user.name
        }]${' '}${value.slice(mentionStart)}`;

        this.resetSearchState();
        this.endHandler();
        this.onChangeValue(newValue);
      }
    }
  };

  onBlur = () => {
    this.resetSearchState();
    this.endHandler();
  };

  render() {
    return (
      <div
        className="hotspot-wrapper position-relative"
        onKeyDown={this.handleKeyDown}
        onBlur={this.onBlur}
      >
        <InputTrigger
          trigger={this.state.trigger}
          onStart={metaData => {
            this.onTrigger(metaData);
          }}
          onCancel={metaData => {
            this.onTrigger(metaData);
          }}
          onType={metaData => {
            this.onType(metaData);
          }}
          endTrigger={endHandler => {
            this.endHandler = endHandler;
          }}
        >
          {/* Input-Trigger Plugin Requires a textarea or input to be a direct child of the Plugin selector */}
          <textarea
            placeholder={this.props.placeholder}
            className="add-comment-textarea input-field d-block"
            onChange={event => this.onChangeValue(event.target.value)}
            onFocus={() => this.props.onFocus()}
            onBlur={() => this.props.onBlur()}
            value={this.state.value}
            autoFocus={this.props.autoFocus}
          />
        </InputTrigger>
        {/* Enable Mention Results based on Conditions */}
        {this.state.canShowOptions && (
          <div className="search-options">
            <InputChipSelectOption
              options={this.state.searchData}
              isSearching={false}
              currentFocusedIndex={this.state.currentFocusedIndex}
              optionSelected={() => false}
              onDropDownSelect={this.onDropDownSelect}
            />
          </div>
        )}
      </div>
    );
  }
}
export default Comment;
