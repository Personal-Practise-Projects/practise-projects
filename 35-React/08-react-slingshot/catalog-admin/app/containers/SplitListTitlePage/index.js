import React from 'react';
import PropTypes from 'prop-types';
import BasePage from '../BasePage';
import Loader from '../../components/Loader';
import '../../styles/SidePanel.scss';

export default class SplitListPage extends React.Component {
  render() {
    const drawerClass = this.props.detailComponent
      ? `splitpage-wrapper splitpage-expanded ${
        this.props.classes
        } position-relative`
      : `splitpage-wrapper splitpage-collapsed ${
        this.props.classes
        } position-relative`;
    return (
      <BasePage>
        <Loader display={this.props.isLoading || false} />
        <main id={this.props.id ? this.props.id : ''}>
          {this.props.headerComponent}
          <section className={drawerClass}>
            <div className="splitpage-board">
              <div className={`${this.props.listClass} ${this.props.classes}`}>
                {this.props.listComponent}
              </div>
            </div>
            {this.props.detailComponent}
          </section>
        </main>
      </BasePage>
    );
  }
}

SplitListPage.defaultProps = {
  classes: 'splitpage-noicons',
  listClass: 'splitpage-content position-relative',
};

SplitListPage.propTypes = {
  headerComponent: PropTypes.any,
  listComponent: PropTypes.any,
  detailComponent: PropTypes.any,
};
