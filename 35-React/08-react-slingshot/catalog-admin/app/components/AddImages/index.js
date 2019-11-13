import React from 'react';
import PropTypes from 'prop-types';
import ImageNotesThumbView from './ImageNotesThumb';

import './AddImagesView.scss';

export default class AddImagesView extends React.Component {
  constructor(props) {
    super(props);
    this.existingValue = props.dataHandler.getExistingData(props.header);
    const extraConfig = props.dataHandler.getExtraConfig ? props.dataHandler.getExtraConfig(props.header) : {};
    this.state = {
      ...extraConfig
    };
    this.dataVersion = props.dataHandler.dataVersion;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.dataVersion !== nextProps.dataHandler.dataVersion) {
      this.dataVersion = nextProps.dataHandler.dataVersion;
      return true;
    }
    return false;
  }

  render() {
    this.existingValue = this.props.dataHandler.getExistingData(
      this.props.header,
    );
    const imageThumbChildren = this.getChildren();
    const classname = this.props.header.classes
      ? this.props.header.classes
      : '';
    return (
      <section
        className="add-images-view-component"
        id={
          this.props.header.title &&
          this.props.header.title.replace(/\s+/g, '').toLowerCase()
        }
        title={this.props.header.help_text}
      >
        <h4 className="title">{this.props.header.title}</h4>
        <div className={`input-references ${classname}`}>
          {imageThumbChildren}
          <div className="add-area">
            <button
              type="button"
              disabled={this.state.readonly}
              onClick={() =>
                !this.state.readonly && this.props.dataHandler.onUpdate(this.props.header, {
                  data: this.props,
                })
              }
              className="secondary-cta d-flex align-items-center justify-content-start"
            >
              <i className="icon-circle-plus" /> {this.props.header.sub_title}
            </button>
            <span className="help-text d-block">
              {this.props.header.help_text}
            </span>
          </div>
        </div>
      </section>
    );
  }

  getChildren() {
    return this.existingValue.map((file, index) => (
      <ImageNotesThumbView
        key={index}
        id={index}
        value={file}
        readonly={this.state.readonly}
        header={this.props.header}
        dataHandler={this.props.dataHandler}
      />
    ));
  }
}

AddImagesView.propTypes = {
  dataHandler: PropTypes.object.isRequired,
  headers: PropTypes.object.isRequired,
};
