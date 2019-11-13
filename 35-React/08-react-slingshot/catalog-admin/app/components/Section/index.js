import React from 'react';
import ComponentRenderFactory from '../ComponentFactory';

import './Section.scss';

export default class SectionView extends React.Component {
  render() {
    return (
      <section
        className="section-view-component"
        id={createSectionIdentifier(this.props.header.title)}
        title={this.props.header.help_text}
      >
        <h4 className="section-title">{this.props.header.title}</h4>
        {this.props.header.data.map((header, index) =>
          ComponentRenderFactory.component(
            header,
            header.id || index,
            this.props.dataHandler,
          ),
        )}
      </section>
    );
  }
}

function createSectionIdentifier(currentTitle) {
  return currentTitle && currentTitle.replace(/\s+/g, '').toLowerCase();
}
