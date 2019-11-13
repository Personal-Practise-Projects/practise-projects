import { selectedProductImages } from '../ProductDetails/dataHandler';
import {
  formatDateToString,
  getFirstLetterCapitalized,
} from '../../helpers/common';

const DEFAULT_PRODUCT_IMAGE =
  'https://voldemort-prod-catalog.s3.amazonaws.com/static/images/prop/default_prop.svg';

export function productListParser(metaInfo, products) {
  const parsedData = {
    headers: [],
    data: [],
  };

  metaInfo.list_header.map(info => {
    parsedData.headers.push({
      title: info.title,
      classes: info.classes,
      type: info.type,
      data_key: info.data_key,
    });
  });

  products.map(product => {
    let selectedImages = selectedProductImages(product.images);
    selectedImages = selectedImages.length
      ? selectedImages[0].url
      : DEFAULT_PRODUCT_IMAGE;

    parsedData.data.push({
      id: product.id,
      images: selectedImages,
      name: {
        data: product.name,
      },
      brand: {
        data: product.brand && product.brand.name,
      },
      category: {
        data: product.category,
      },
      sub_category: {
        data: product.sub_category,
      },
      expire_on: {
        data: product.expire_on
          ? formatDateToString(product.expire_on.timestamp)
          : '',
      },
      notes: {
        data: product.notes,
      },
      received_on: {
        data: product.received_on
          ? formatDateToString(product.received_on.timestamp)
          : '',
      },
      status: {
        data: getFirstLetterCapitalized(product.status),
      },
    });
  });
  return parsedData;
}
