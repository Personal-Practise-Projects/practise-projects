import AxiosBuilder from "../../../common/axiosBuilder";
import { StringHelper } from "../../../helpers/utils";
import { DONE, FAILED } from "../../../common/constants";
import { parseCategory } from "../../../helpers/content_request";

export const CONTENT_REQUEST_ITEMS_ENDPOINT = 'content-request/##/requested-items/';
export const CONTENT_REQUEST_ITEM_UPDATE_DELETE_ENDPOINT = 'content-request/##/requested-items/##/';

export function getRequestedItems(crId, callback) {
  new AxiosBuilder(StringHelper.format(CONTENT_REQUEST_ITEMS_ENDPOINT, crId))
    .withAuth()
    .fetch()
    .then(response => {
      response.data.forEach(requestedItem => {
        requestedItem.contentCategory = parseCategory(requestedItem.content_category);
        delete requestedItem.content_category;
      });
      callback(DONE, response.data)
    })
    .catch(error => callback(FAILED, error));
}

export function createRequestedItems(crId, data, callback) {
  const config = {
    data: JSON.stringify(data)
  };
  new AxiosBuilder(StringHelper.format(CONTENT_REQUEST_ITEMS_ENDPOINT, crId), config)
    .withAuth()
    .POST()
    .then(response => {
      let requestedItem = response.data;
      requestedItem.contentCategory = parseCategory(requestedItem.content_category);
      delete requestedItem.content_category;
      callback(DONE, requestedItem)
    })
    .catch(error => callback(FAILED, error));
}

export function updateRequestedItems(crId, itemId, data, callback) {
  const config = {
    data: JSON.stringify(data)
  };
  new AxiosBuilder(StringHelper.format(CONTENT_REQUEST_ITEM_UPDATE_DELETE_ENDPOINT, crId, itemId), config)
    .withAuth()
    .PATCH()
    .then(response => {
      response.data.contentCategory = parseCategory(requestedItem.content_category);
      delete requestedItem.content_category;
      callback(DONE, response.data)
    })
    .catch(error => callback(FAILED, error));
}

export function deleteRequestedItems(crId, itemId, callback) {
  new AxiosBuilder(StringHelper.format(CONTENT_REQUEST_ITEM_UPDATE_DELETE_ENDPOINT, crId, itemId))
    .withAuth()
    .DELETE()
    .then(response => callback(DONE, response.data))
    .catch(error => callback(FAILED, error));
}


