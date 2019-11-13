import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import BottomScrollListener from 'react-bottom-scroll-listener';

import AnchorTag from '../../form-components/AnchorTag';
import DatePicker from './DatePicker';
import ExternalLinkTag from '../../form-components/ExternalLinkTag/index';
import DropDown from '../../form-components/DropDown';
import Img from '../Img';
import InlineEditTextArea from '../InlineEditTextArea';
import InlineEditTextBox from '../InlineEditTextBox';
import Loader from '../Loader';
import Span from '../Span';
import errorPlaceHolder from '../../images/content-widget/profile_picture_thumbnail.svg';

import { AvatarInfo } from '../AvatarInfo';
import { getParameterByName } from '../../helpers/common';
import SelectItem from '../SelectItem';
import { StringHelper } from '../../helpers/utils';

import './Table.scss';
import { Icon } from '../Icon';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.keyCounter = 0;
    this.state = {
      data: props.data || [],
      showLoader: false,
    };
    this.selectedId = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setState(
        {
          ...this.state,
          data: this.props.data,
        },
        () => {
          this.setState({
            ...this.state,
            showLoader: false,
          });
        },
      );
    } else if (!this.props.showLoader && prevState.showLoader) {
      this.setState({ ...this.state, showLoader: this.props.showLoader });
    }
  }

  onEndScroll = () => {
    if (this.props.onEndScroll && this.props.onEndScroll()) {
      this.setState({
        ...this.state,
        showLoader: true,
      });
    }
  };

  getHeaders = () => {
    const headers = [];
    this.props.headers.map(
      ({ title, classes, type /* eslint-disable no-unused-vars */ }, index) => {
        headers.push(
          <div
            key={this.keyCounter++}
            className={classes ? `table-column ${classes}` : `table-column`}
          >
            {this.renderHeaderComponent(type, classes, title)}
          </div>,
        );
      },
    );
    return headers;
  };

  renderHeaderComponent = (param, classes, title) => {
    switch (param) {
      case 'select':
        return this.state.data.length ? (
          <SelectItem
            all
            parent={this.props.selectEventType}
            header={{ type: title }}
            item={this.state.data.filter(item => item.selectableData)}
          />
        ) : null;
      default:
        return title;
    }
  };

  renderComponent = (param, message, dataKey, item) => {
    switch (param) {
      case 'textarea':
        return <InlineEditTextArea message={message} />;
      case 'text':
        return <InlineEditTextBox message={message} />;
      case 'date':
        return <DatePicker selected={message} />;
      case 'dropdown':
        return (
          <DropDown
            title="Please Select"
            list={message.slice(1)}
            selected={message[0]}
            header={{ placeholder: '', title: '', data_key: dataKey }}
            updateDetailsOnBlur={this.props.updateAction}
          />
        );
      case 'image':
        return <Img src={message} alt="image" errSrc={errorPlaceHolder} />;
      case 'anchor':
        return <AnchorTag message={message} />;
      case 'avatarInfo':
        return <AvatarInfo message={message} />;
      case 'external_link':
        return (
          <ExternalLinkTag
            value={message.link}
            header={{ title: message.title }}
          />
        );
      case 'select':
        return (
          <SelectItem
            all={false}
            header={{ type: message }}
            item={item}
            parent={this.props.selectEventType}
          />
        );
      case 'span':
        return (
          <Span message={message.data} className={message.classes || ''} />
        );
      case 'icon':
        return (
          <Icon
            className={message.classes}
            header={message.header}
            dataHandler={this.props.dataHandler}
            extraProps={message.extraProps}
          />
        );
      default:
        return <Span message={message} />;
    }
  };

  onKeyDown = event => {
    if (event.keyCode === 13) {
      this.props.updateAction(null, event);
    }
  };

  handleRowSelection = rowIdentifier => {
    if (this.props.selectedKey !== undefined) {
      this.setState({});
    }
    if (this.props.handleSelectedRow) {
      this.props.handleSelectedRow(rowIdentifier.id);
    }
  };

  getRow = (item, rowIndex) => (
    <div
      className={
        this.selectedId === item.id ? 'table-row active-row' : 'table-row'
      }
      key={rowIndex}
      data-row-identifier={item.id}
      onClick={() => this.handleRowSelection(item)}
    >
      {this.props.headers.map(
        (
          {
            title /* eslint-disable no-unused-vars */,
            classes /* eslint-disable no-unused-vars */,
            type /* eslint-disable no-unused-vars */,
            data_key,
          },
          index,
        ) => (
          <div
            key={this.keyCounter++}
            className={StringHelper.format('table-column ##', classes)}
            data-column-name={data_key}
            data-id={item.id}
            // onBlur={event => this.props.updateAction(null, event)}
            onKeyDown={this.onKeyDown}
            data-value={this.getData(item, data_key) || ''}
          >
            {this.renderComponent(
              type,
              data_key === 'id' ? item.id : this.getData(item, data_key) || '',
              data_key,
              item,
            )}
          </div>
        ),
      )}
    </div>
  );

  getDataFromKey = (item, key) => {
    const keys = key.split('.');
    keys.map(value => {
      item = item[value];
    });
    return item;
  };

  getData = (item, dataKey) =>
    dataKey.indexOf('.') !== -1
      ? this.getDataFromKey(item, dataKey)
      : item[dataKey];

  populateRows = () => {
    const rows = [];
    this.state.data.map((item, index) => {
      rows.push(this.getRow(item, index));
    });
    if (!rows.length) {
      rows.push(
        <div className="table-row empty-row d-flex align-items-center justify-content-center">
          No result
        </div>,
      );
    }
    return rows;
  };

  getQueryParam = () => {
    if (this.props.selectedKey !== undefined) {
      this.selectedId = parseInt(
        getParameterByName(null, this.props.selectedKey),
      );
    }
  };

  render() {
    this.getQueryParam();
    return (
      <div className="table-flexible table-horizontal-scroll">
        <div
          className={StringHelper.format(
            'table ##',
            this.props.customClassName,
          )}
        >
          {this.props.headers && this.props.headers.length ? (
            <React.Fragment>
              <div className="table-header">
                <div className="table-row">{this.getHeaders()}</div>
              </div>

              <BottomScrollListener onBottom={this.onEndScroll.bind(this)}>
                {scrollRef => (
                  <div
                    ref={scrollRef}
                    className="table-body table-vertical-scroll"
                  >
                    {this.state.data && this.populateRows()}
                    <Loader display={this.state.showLoader} />
                  </div>
                )}
              </BottomScrollListener>
            </React.Fragment>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  updateAction: PropTypes.func,
  onEndScroll: PropTypes.func,
  customClassName: PropTypes.string,
};
