import React from 'react';
import PropTypes from 'prop-types';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: props.title,
      selectedOption: props.selected,
      list: props.list,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.setTitle();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.id !== this.props.id ||
      prevProps.title !== this.props.title
    ) {
      this.setState({
        list: this.props.list,
        listOpen: false,
        headerTitle: this.props.title,
        selectedOption: this.props.selected,
      });
      this.setTitle();
    }
  }

  setTitle = () => {
    let headerTitle = this.props.title;
    if (this.state.selectedOption) {
      const selectedItem = this.state.list.find(
        data => data.id === this.props.selected.id,
      );
      if (selectedItem) {
        headerTitle = selectedItem.title;
      }
    }
    this.setState({
      headerTitle,
    });
  };

  handleClickOutside = () => {
    this.setState({
      listOpen: false,
    });
  };

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen,
    }));
  }

  onDropDownSelect(item, event) {
    this.toggleList();
    const updatedObject = {
      data_key: this.props.header.data_key,
      value: item.id,
    };
    this.props.updateDetailsOnBlur(updatedObject, event);
    this.setState({ selectedOption: item, headerTitle: item.title });
  }

  render() {
    const { list, listOpen, headerTitle, selectedOption } = this.state;
    return (
      <div
        className={
          listOpen
            ? 'searchable-dropdown expanded-dropdown position-relative'
            : 'searchable-dropdown collapsed-dropdown position-relative'
        }
        onBlur={this.handleClickOutside}
      >
        <button
          type="button"
          className={`dropdown-trigger d-block rubik-semibold
          ${this.props.displayChildClassRenderer &&
            this.props.displayChildClassRenderer()}`}
          onClick={() => this.toggleList()}
        >
          {headerTitle}
        </button>
        <div className="dropdown-drawer">
          {list &&
            list.map((item, index) => (
              <button
                type="button"
                key={index.toString()}
                className={{
                  'active-item':
                    selectedOption && selectedOption.id === item.id,
                }}
                onMouseDown={event => {
                  event.preventDefault();
                  this.onDropDownSelect(item, event);
                }}
              >
                {item.title}
              </button>
            ))}
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  displayChildClassRenderer: PropTypes.func,
  header: PropTypes.object,
  id: PropTypes.any,
  list: PropTypes.array,
  selected: PropTypes.object,
  title: PropTypes.string,
  updateDetailsOnBlur: PropTypes.func,
};
export default DropDown;
