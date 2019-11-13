import React from 'react';
import connect from 'react-redux/es/connect/connect';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { showMarkUps } from '../../../containers/BasePage/actions';
import styles from './MarkupView.scss';


class MarkupView extends React.Component {

  tooltipText= () => (
    this.props.show ? 'Preview Mode' : 'Comment Mode'
  );

  render() {
    const activeClass = this.props.show ? 'active' : '';
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{this.tooltipText()}</Tooltip>}>
        <div className="comment-view" style={styles}>
          <button className="comment-button" onClick={() => this.props.showMarkUps()}>
            <span className={`comment-icon ${activeClass}`}/>
          </button>
        </div>
      </OverlayTrigger>
    );
  }
}

const mapDispatchToProps = {
  showMarkUps,
};

const mapStateToProps = state => ({
  show: state.base.showMarkUps,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkupView);
