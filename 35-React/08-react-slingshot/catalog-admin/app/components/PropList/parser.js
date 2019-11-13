import { selectedPropImages } from '../PropDetail/dataHandler';

const DEFAULT_PROP_IMAGE =
  'https://voldemort-prod-catalog.s3.amazonaws.com/static/images/prop/default_prop.svg';

export function propListParser(propList) {
  const parsedData = [];
  propList.map(prop => {
    const parsedProp = Object.assign({}, prop);
    const selectedImages = selectedPropImages(parsedProp.images);
    parsedProp.images = selectedImages.length
      ? selectedImages[0].url
      : DEFAULT_PROP_IMAGE;
    parsedData.push(parsedProp);
  });
  return parsedData;
}
