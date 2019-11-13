import React from 'react';
import TextArea from '../TextArea';

export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.header = props.dataHandler.getHeader();
  }

  render() {
    return (
      <TextArea dataHandler={this.props.dataHandler} header={this.header} />
    );
  }
}
