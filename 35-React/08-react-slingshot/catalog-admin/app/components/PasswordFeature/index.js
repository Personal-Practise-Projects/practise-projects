import React from 'react';

import Input from '../Input';

export default class PasswordFeature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
    };
  }

  render() {
    const { header } = this.state;
    return (
      <React.Fragment>
        <Input header={header} dataHandler={this.props.dataHandler} />
        {header.showPassword && (
          <i
            className="icon icon-review"
            onClick={() => this.toggleEyeICon()}
          />
        )}
      </React.Fragment>
    );
  }

  toggleEyeICon = () => {
    const header = this.state.header;
    header.type = header.type === 'text' ? 'password' : 'text';
    this.setState({
      header: header,
    });
  };
}
