import AxiosBuilder from '../common/axiosBuilder';
import { DONE, FAILED } from '../common/constants';

export const updateProductInfo = (productId, updateData, callback) => {
  const config = {
    data: JSON.stringify(updateData),
  };
  new AxiosBuilder(`products/${productId}/`, config)
    .withAuth()
    .PATCH()
    .then(response => {
      const product = response.data;
      callback(DONE, product);
    })
    .catch(error => {
      callback(FAILED, error.response.data);
    });
};
