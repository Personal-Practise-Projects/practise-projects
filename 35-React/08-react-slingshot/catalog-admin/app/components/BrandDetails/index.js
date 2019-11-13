import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BrandDetailHeader from './brandDetailHeader';
import { DETAILS_VIEW_EVENT } from './constants';
import { updateBrands } from '../../actions/brandActions';
import ComponentRenderFactory from '../ComponentFactory';
import { BrandDetailsInputDataHandler } from './dataHandler';
import { getParamForKeyFromUrl } from '../../helpers/url';
import {
  closeContentWidget,
  openContentWidget,
} from '../../containers/BasePage/actions';

class BrandDetailsView extends React.Component {
  constructor(props) {
    super(props);
    const brand = this.props.brandsDict[getParamForKeyFromUrl('brand')];
    this.brandDetailDataHandler = new BrandDetailsInputDataHandler(
      brand,
      this.props.updateBrands,
      this.eventListener,
    );
    this.dataVersion = this.brandDetailDataHandler.dataVersion;
    this.state = { brand };
  }

  closePanel = () => {
    this.props.closePanel(null);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const brand = nextProps.brandsDict[getParamForKeyFromUrl('brand')];
    if (prevState.brand !== brand) {
      return { brand };
    }
    return {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.brand === nextState.brand &&
      this.dataVersion > this.brandDetailDataHandler.dataVersion
    ) {
      return false;
    }
    this.brandDetailDataHandler.setData(nextState.brand);
    this.dataVersion = this.brandDetailDataHandler.dataVersion;
    return true;
  }

  render() {
    return (
      <div className="splitpage-drawer animated slideInRight">
        <BrandDetailHeader
          name={this.state.brand.name}
          onClick={this.closePanel}
        />
        {this.props.headers && this.props.headers.length > 0 && (
          <div className="splitpage-drawer-body">
            {this.props.headers.map((header, index) =>
              ComponentRenderFactory.component(
                header,
                index,
                this.brandDetailDataHandler,
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  eventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.OPEN_FILE_WIDGET:
        this.props.openContentWidget(args.uploadWidget);
        this.setState({});
        break;
      case DETAILS_VIEW_EVENT.CLOSE_FILE_WIDGET:
        this.props.closeContentWidget();
        this.setState({});
        break;
      default:
        break;
    }
  };
}

BrandDetailsView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  brand: PropTypes.object.isRequired,
  brandsDict: PropTypes.object.isRequired,
  closeContentWidget: PropTypes.func,
  openContentWidget: PropTypes.func,
  updateBrands: PropTypes.func,
};

const mapStateToProps = state => ({
  metaInfo: state.brands.metaInfo,
  brandsDict: state.brands.brandsDict,
  headers: state.brands.metaInfo.detail_meta_info,
});

const mapDispatchToProps = {
  updateBrands,
  openContentWidget,
  closeContentWidget,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrandDetailsView);
