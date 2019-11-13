import React from 'react';
import PropTypes from 'prop-types';
import TabRendererComponent from './TabRenderer';
import { generateUniqueId } from '../../helpers/common';
import { WIDGET_ACTIONS } from './common/constants';
import { getMinimizedBoxIcon } from './minimized';
import Loader from '../Loader';
import CopyToClipboard from '../CopyToClipboard';
import { WidgetTabs } from './widgetTabs';
import { StringHelper } from '../../helpers/utils';

export const ON_DONE_WIDGET_STATE = {
  DEFAULT: 'DEFAULT',
  NON_CLOSABLE: 'NON_CLOSABLE',
};

class ContentChooserWidget extends React.Component {
  constructor(props) {
    super(props);
    this.type = this.props.type || ON_DONE_WIDGET_STATE.DEFAULT;
    this.dataInjectors = this.props.injectors;
    this.uniqueId = generateUniqueId();
    const selectedTab =
      this.props.selectedTab || Object.keys(this.dataInjectors)[0];
    this.state = {
      // if selected tab id is not provided then make first tab as selected
      selectTabId: selectedTab,
      disabled: false,
    };
  }

  render() {
    // Make tabs based on provided data Injectors key values
    const widgetTitle = this.dataInjectors[this.state.selectTabId].getTitle();
    return (
      <div className="content-widget">
        <div className="widget-header">
          {widgetTitle && (
            <h4 className="d-flex align-items-center">
              {widgetTitle}
              <CopyToClipboard value={widgetTitle} />
            </h4>
          )}
          <div className="widget-wrapper-actions d-flex align-items-center">
            {this.dataInjectors[this.state.selectTabId].getHeaders()}
            {getMinimizedBoxIcon(WIDGET_ACTIONS.CLOSE, this.actionCallback)}
          </div>
        </div>
        <div id={this.uniqueId} className="widget-wrapper position-relative">
          <div className="widget-wrapper-options d-flex align-items-center justify-content-start">
            <WidgetTabs
              dataInjectors={this.dataInjectors}
              selectTabId={this.state.selectTabId}
              onTabSelected={this.onTabSelected}
            />
          </div>
          <TabRendererComponent
            key={StringHelper.format(
              'trc_##_##',
              this.state.selectTabId,
              this.dataInjectors.uniqueComponentKey,
            )}
            injector={this.dataInjectors[this.state.selectTabId]}
            actionCallback={this.actionCallback}
          />
        </div>
        {this.state.disabled && <Loader />}
      </div>
    );
  }

  onTabSelected = event => {
    if (event.target.id !== this.state.selectTabId) {
      this.setState({ selectTabId: event.target.id });
    }
  };

  actionCallback = (actionType, args) => {
    switch (actionType) {
      case WIDGET_ACTIONS.CLOSE:
        // On widget closing make sure to cancel all the uploading references and release the state
        this.onWidgetClose();
        break;
      case WIDGET_ACTIONS.CLOSE_WHITE:
        // On widget closing make sure to cancel all the uploading references and release the state
        this.onWidgetClose();
        break;
      case WIDGET_ACTIONS.SELECT:
        this.setState({ disabled: true });
        break;
      case WIDGET_ACTIONS.SELECT_DONE:
        this.setState({ disabled: false });
        if (this.type === ON_DONE_WIDGET_STATE.DEFAULT) {
          this.onWidgetClose();
        }
        break;
      case WIDGET_ACTIONS.MAXIMIZE:
        this.setState({ minimized: false });
        break;
    }
  };

  onWidgetClose = () => {
    Object.keys(this.dataInjectors).map(injectorKey => {
      this.dataInjectors[injectorKey].widgetDidUnmount();
    });
    const widgetListener = this.dataInjectors[this.state.selectTabId]
      .widgetListener;
    widgetListener && widgetListener(WIDGET_ACTIONS.CLOSE, {});
  };
}

ContentChooserWidget.propTypes = {
  injectors: PropTypes.object.isRequired,
};

export default ContentChooserWidget;
