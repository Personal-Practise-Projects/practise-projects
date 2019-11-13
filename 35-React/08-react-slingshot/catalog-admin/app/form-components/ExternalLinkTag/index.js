import React from 'react';
import PropTypes from 'prop-types';

class ExteranlLinkTag extends React.Component {
  render() {
    const { value } = this.props;
    const { title } = this.props.header;
    return (
      <a
        onMouseDown={event => {
          event.preventDefault();
        }}
        className={this.props.className}
        href={value}
        target="_blank"
      >
        {title}
      </a>
    );
  }
}

ExteranlLinkTag.propTypes = {
  value: PropTypes.string,
  title: PropTypes.string,
};

export default ExteranlLinkTag;
