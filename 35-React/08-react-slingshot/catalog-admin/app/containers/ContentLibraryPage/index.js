import React from 'react';
import ContentLibraryPageDetails from './ContentLibraryPage';
import BasePage from '../BasePage';

export default class ContentLibraryPage extends React.Component {
  render() {
    return (
      <BasePage>
        <ContentLibraryPageDetails />
      </BasePage>
    );
  }
}
