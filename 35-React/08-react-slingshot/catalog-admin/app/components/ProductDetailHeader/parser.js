export function productHeaderParser(product) {
  const parsedData = {};
  parsedData.status = {
    id: product.id,
    title: 'Select Status',
    data_key: 'status',
    uid: '#status',
  };
  parsedData.expireOn = {
    title: 'Product Expired on',
    placeholder: 'Select date',
    data_key: 'expire_on',
    uid: '#expireOn',
  };
  return parsedData;
}
