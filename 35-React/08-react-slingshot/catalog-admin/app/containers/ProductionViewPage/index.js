import React from 'react';
import ProductionViewDetails from './productionPageDetails';
import BasePage from '../BasePage';

export default class ProductionViewPage extends React.Component {
  render() {
    return (
      <BasePage>
        <ProductionViewDetails />
      </BasePage>
    );
  }
}
