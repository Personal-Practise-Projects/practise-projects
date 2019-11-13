import React from 'react';

import PropTypes from 'prop-types';

import { STATUS_DONE } from '../../../actions/types';
import { SELECT_WIDGET_CONTENT, WIDGET_ACTIONS, } from '../common/constants';
import Logger from '../../../logging/logger';

const logger = Logger.createLogger('TAB_RENDERER');

class TabRendererComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: 0,
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="widget-wrapper-content">
          {this.props.injector.getRenderingComponent({
            contentsCallback: this.contentsCallback,
            version: this.state.version,
          })}
        </div>
        {this.props.injector.getFooter(this.onAction)}
      </React.Fragment>
    );
  }

  onAction = event => {
    if (this.props.injector.widgetListener) {
      switch (event.target.id) {
        case SELECT_WIDGET_CONTENT:
          this.props.actionCallback(WIDGET_ACTIONS.SELECT);
          this.props.injector.performPositiveAction((status, result) => {
            if (status === STATUS_DONE) {
              this.setState(prevState => ({ version: prevState.version + 1 }));
            } else {
              logger.log(result);
            }
            this.props.actionCallback(WIDGET_ACTIONS.SELECT_DONE);
          });
          break;
        case WIDGET_ACTIONS.CLOSE:
          this.props.actionCallback(WIDGET_ACTIONS.CLOSE);
          break;
      }
    }
  };

  contentsCallback = enableSave => {
    this.props.injector.setSaveEnable(enableSave);
    this.setState({});
  };
}

TabRendererComponent.propTypes = {
  injector: PropTypes.object.isRequired,
  actionCallback: PropTypes.func.isRequired,
};

export default TabRendererComponent;
