import { StringHelper } from '../helpers/utils';
import { queryParamsFromDict } from '../helpers/common';

export default class UrlBuilder {
  constructor(baseFormat) {
    this.baseFormat = baseFormat;
    this.pathParams = {};
    this.queryParams = {};
  }

  addPathParam = (key, value) => {
    this.pathParams[key] = value;
    return this;
  };

  addPathParams = pathParams => {
    Object.assign(this.pathParams, ...pathParams);
    return this;
  };

  addQueryParam = (key, value) => {
    this.queryParams[key] = value;
    return this;
  };

  addQueryParams = queryParams => {
    if (Object.keys(queryParams).length > 0) {
      Object.assign(this.queryParams, queryParams);
    }
    return this
  };

  /**
   * return {string}
   */
  buildUrl = () => {
    return StringHelper.format(
      '##?##',
      StringHelper.formatKeyArguments(this.baseFormat, this.pathParams),
      queryParamsFromDict(this.queryParams),
    );
  };
}
