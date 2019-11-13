import React from 'react';
import Chips from 'react-chips';
import ShipProductStep from '../../../images/steps/illustration-step1.svg';
import './style.scss';
import { catalogAddress } from '../../../constant';

class ShipProductsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productInfo: [{ productName: [], trackingNumber: '' }],
    };
  }

  addClick = () => {
    this.setState(prevState => ({
      productInfo: [
        ...prevState.productInfo,
        { productName: [], trackingNumber: '' },
      ],
    }));
  };

  createUI = () =>
    // map all the elements/items
    this.state.productInfo.map((item, index) => (
      <div className="form-description" key={item}>
        <div className="product-section">
          <div className="text-field-label">
            Product:
            <span
              className="remove-actions"
              onClick={this.removeClick.bind(this)}
              role="button"
              value="remove"
              tabIndex={0}
            >
              -
            </span>
          </div>
          <Chips
            className="chip-input-field"
            createChipKeys={['Enter', 'Tab']} // only allow Enter and Tab key to work not ','
            onChange={chips => this.handleChips(chips, index)}
            placeholder="Enter product name"
            type="text"
            value={item.productName}
          />
        </div>
        <div className="tracking-section">
          <div className="text-field-label">Tracking #: </div>
          <input
            className="trackingNumber"
            maxLength="50"
            onChange={event => this.handleChange(event, index)}
            placeholder="Enter the parcel tracking #"
            type="text"
            value={item.trackingNumber}
          />
        </div>
      </div>
    ));

  handleChips = (chips, index) => {
    const { productInfo } = this.state;
    productInfo[index].productName = chips;
    this.setState({ productInfo });
  };

  handleChange = (event, index) => {
    const { productInfo } = this.state;
    productInfo[index].trackingNumber = event.target.value;
    this.setState({ productInfo });
  };

  handleSubmit = event => {
    // check if both input fields have been filled out
    if (
      this.state.productInfo.every(
        product => product.productName.length && product.trackingNumber !== '',
      )
    ) {
      // TODO: replace alert with actual submitting functionality
      // eslint-disable-next-line no-alert
      alert('You have successfully submitted the form');
      event.preventDefault();
    } else {
      // TODO: replace alert with actual error message or don't enable submit button
      // eslint-disable-next-line no-alert
      alert('Please fill in all the fields');
    }
  };

  removeClick = index => {
    const { productInfo } = this.state;
    productInfo.splice(index, 1);
    this.setState({
      productInfo,
    });
  };

  render() {
    return (
      <div className="ship-product-component-page">
        <div className="component-page">
          <div className="component-image">
            <img alt="" className="step-image" src={ShipProductStep} />
          </div>
          <div className="component-text">
            <div className="component-title">
              <span className="description-line">Ship the products to</span>
              <span className="address-line">{catalogAddress}</span>
            </div>
            <form className="component-form">
              <div className="component-body">
                <div className="input-fields">
                  <div className="form-input-field">{this.createUI()}</div>
                </div>
                <div className="extra-component-body">
                  <span
                    className="details-actions"
                    onClick={this.addClick}
                    role="button"
                    tabIndex={0}
                  >
                    + Add more
                  </span>
                  <button
                    className="submit-button"
                    type="button"
                    onClick={this.handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ShipProductsView;
