import moment from 'moment';
import AxiosBuilder from '../common/axiosBuilder';
import {
  CALENDAR_WEEKLY_START_DATE_FORMAT,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DAY,
  DAYS,
  WEEK,
} from '../common/constants';
import { SHOT_STATUS } from '../common/shot/constants';

export function getParameterByName(url, paramName, defaultValue = null) {
  if (!url) url = window.location.href;
  paramName = paramName.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${paramName}(=([^&#]*)|&|#|$)`);

  const results = regex.exec(url);
  if (!results) return defaultValue;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function generateUniqueId() {
  return `_${((Date.now() + Math.random()) * 10000).toString(
    Math.floor(Math.random() * (32 - 10 + 1) + 10),
  )}_`;
}

export function buildPayLoad(payLoad) {
  const deFlattenedObject = {};
  Object.keys(payLoad).map((key, _) => {
    if (key.indexOf('.') === -1) {
      deFlattenedObject[key] = payLoad[key];
    } else {
      const fields = key.split('.');
      const newObject = {};
      deFlattenedObject[fields[0]] = newObject;
      _buildJsonObject(newObject, fields.slice(1), payLoad[key]);
    }
  });
  return deFlattenedObject;
}

function _buildJsonObject(object, fields, value) {
  if (!fields.length) {
    return true;
  }
  if (fields.length === 1) {
    object[fields[0]] = value;
  } else {
    const newObject = {};
    object[fields[0]] = newObject;
    _buildJsonObject(newObject, fields.slice(1), value);
  }
}

export function getDateTimeInLocalTimeZone(value) {
  return value ? moment.utc(new Date(Number(value))).toDate() : '';
}

export function getDateTimeInUTC(dateTime) {
  return dateTime ? moment.utc(dateTime).unix() * 1000 : '';
}

export function compareDate(date1, date2 = new Date()) {
  /** *
   * Function can return 3 types of value -1,0 or 1
   * -1: if date1's date is less than date2
   * 0 if date1's date is equal to date2
   * 1 if date1's date is greater than date2
   */
  const d1 = new Date(date1).setHours(0, 0, 0, 0);
  const d2 = new Date(date2).setHours(0, 0, 0, 0);
  return d1 === d2 ? 0 : d1 >= d2 ? 1 : -1;
}

export function getValueByKeyFromObject(key, shot) {
  let value = shot;

  if (key.startsWith('[')) return [shot[key.slice(1, -1)]];
  if (key.indexOf('.') === -1) return shot[key];

  const parts = key.split('.');
  parts.map(data => {
    value = value && value[data];
  });
  return value;
}

export function getFirstLetterCapitalized(string) {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : '';
}

export function getFirstLetterCapitalizedWithoutUnderscore(string) {
  const value = string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : '';
  return value.replace(/_/g, ' ');
}

export function searchObject(arr, searchString, searchFields) {
  return arr.filter(data =>
    searchByField(searchFields, data, searchString.toString().toLowerCase()),
  );
}

function searchByField(searchFields, data, searchString) {
  // TODO need to look for solution why regular expression with search function is breaking here
  // with special characters value.toString().search(new RegExp(searchString, 'i')) !== -1
  let isPresent = false;
  for (const field of searchFields) {
    if (field.constructor === String) {
      const value = getValueByKeyFromObject(field, data);
      isPresent =
        isPresent ||
        (value &&
          value
            .toString()
            .toLowerCase()
            .indexOf(searchString) !== -1);
    } else {
      const searchKey = Object.keys(field)[0];
      const searchLabels = Object.values(field);
      const searchList = getValueByKeyFromObject(searchKey, data);
      isPresent =
        isPresent ||
        searchByLabelsInList(searchList, searchString, searchLabels);
    }
  }
  return isPresent;
}

function searchByLabelsInList(searchList, searchString, searchLabels) {
  return (
    searchList &&
    searchList.some(data =>
      searchLabels.some(
        label =>
          data[label] &&
          data[label]
            .toString()
            .toLowerCase()
            .indexOf(searchString) !== -1,
      ),
    )
  );
}

export function objectKeyFromValue(object, value) {
  let mappedKey = '';
  Object.keys(object).forEach(key => {
    if (object[key] === value) {
      mappedKey = key;
    }
  });
  return mappedKey;
}

export function formatDateToString(date, format = DATE_FORMAT) {
  if (!date) {
    return null;
  }
  const momentDate = moment(date);
  return momentDate.format(format);
}

export function dateToServerTimestamp(date) {
  return date / 1000;
}

export function getShotColorFromStatus(shotStatus) {
  switch (shotStatus) {
    case SHOT_STATUS.BACKLOG:
      return 'status-backlog';
    case SHOT_STATUS.PRODUCT_PENDING:
      return 'status-product-pending';
    case SHOT_STATUS.CREATIVE:
      return 'status-creative';
    case SHOT_STATUS.CREATIVE_REVIEW:
      return 'status-creative-review';
    case SHOT_STATUS.BUNDLING:
      return 'status-bundling';
    case SHOT_STATUS.SPILLED:
      return 'status-spilled';
    case SHOT_STATUS.SCHEDULED:
      return 'status-scheduled';
    case SHOT_STATUS.PHOTOSHOOT:
      return 'status-photoshoot';
    case SHOT_STATUS.CAPTURED:
      return 'status-captured';
    case SHOT_STATUS.EDITING:
      return 'status-editing';
    case SHOT_STATUS.REVIEW:
      return 'status-review';
    case SHOT_STATUS.DONE:
      return 'status-done';
    default:
      return 'status-default';
  }
}

export function addProduct(productName, brandId, successCallback) {
  const requestPayload = {
    data: JSON.stringify({
      name: productName,
      brand: brandId,
    }),
  };
  new AxiosBuilder(`/products/`, requestPayload)
    .withAuth()
    .POST()
    .then(response => {
      successCallback(response.data);
    });
}

export function insertBefore(entityList, insertBefore, toInsert, identifier) {
  /**
   * This function inserts entity with toInsertId before entity with
   * insertBeforeId in the entitlist and return the newlist.
   * @params identifier: is the unique id for which searching is to be implemented
   * ex: for backlog rearrange 'id' is the identifier
   */
  const newEntityList = [];

  entityList.map((currentEntity, index) => {
    if (currentEntity[identifier] === insertBefore.id) {
      newEntityList.push(toInsert);
      newEntityList.push(currentEntity);
    } else if (currentEntity[identifier] !== toInsert.id) {
      newEntityList.push(currentEntity);
    }
  });
  return newEntityList;
}

export function getEntityFromEntityList(
  entityList,
  toSearchIdentifier,
  identifier,
) {
  return entityList.find(entity => entity[identifier] === toSearchIdentifier);
}

export function removeEntityFromEntityList(
  entitlist,
  toRemoveIdentifier,
  identifier,
) {
  return entitlist.filter(el => el[identifier] !== toRemoveIdentifier);
}

export function removeEntityFromEntityObject(
  entitlist,
  toRemoveIdentifier,
  identifier,
) {
  Object.keys(entitlist).map(key => {
    entitlist[key] = removeEntityFromEntityList(
      entitlist[key],
      toRemoveIdentifier,
      identifier,
    );
  });
  return entitlist;
}

export function buildScheduleOn(timeSlot, timeStamp) {
  const currentLocaleDate = new Date(timeStamp * 1000).toDateString();
  return `${currentLocaleDate} ${timeSlot}:00:00`;
}

export function parseStringToHtml(text) {
  if (text) {
    const output = text.replace(
      /\[\s*~([^\][]+)\s*]+/g,
      (a, b) => `<span className="tag">${b.split('<')[0].trim()}</span>`,
    );
    return output;
  }
  return '';
}

const getOnlyDate = function(today) {
  const date = new Date(today);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

export function getDisplayDate(forDate) {
  const today = getOnlyDate(new Date());
  const forDateOnly = getOnlyDate(forDate);
  const diff = today.getTime() - forDate.getTime();
  if (forDateOnly.getTime() === today.getTime()) {
    return `Today${moment(forDate).format(' HH:mm')}`;
  }
  if (diff <= 24 * 60 * 60 * 1000) {
    return `Yesterday${moment(forDate).format(' HH:mm')}`;
  }
  return moment(forDate).format(DATE_TIME_FORMAT);
}

export function queryParamsFromDict(queryParams) {
  let queryString = '';
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key]) {
      if (queryString.length > 0) {
        queryString += '&';
      }
      queryString += `${key}=${encodeURIComponent(queryParams[key])}`;
    }
  });
  return queryString;
}

export function addDaysInTimestamp(timestamp, days = 1) {
  return moment(timestamp).add(days, 'days');
}

export function lessDaysInTimestamp(timestamp, days = 1) {
  return moment(timestamp).subtract(days, 'days');
}

export function formatDate(timestamp, format = DATE_FORMAT) {
  if (!format) {
    format = DATE_FORMAT;
  }
  return timestamp.format(format);
}

// selectedTimeStamp in milliseconds
export function getDateRangeDetails(selectedTimeStamp) {
  const selectedDate = new Date(selectedTimeStamp);
  const dayOfWeek = selectedDate.getDay();
  const diff = selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startDate = formatDateToString(
    new Date(selectedDate.setDate(diff)),
    CALENDAR_WEEKLY_START_DATE_FORMAT,
  );
  const endDate = formatDateToString(
    new Date(selectedDate.setDate(diff + 6)),
    DATE_FORMAT,
  );
  return `${startDate} - ${endDate}`;
}

export function getStartDateOfWeek(selectedTimeStamp) {
  const selectedDate = new Date(selectedTimeStamp * 1000);
  const day = selectedDate.getDay();
  const diff = selectedDate.getDate() - day + (day === 0 ? -6 : 1);
  return getDateTimeInUTC(new Date(selectedDate.setDate(diff))) / 1000;
}

export function getMinDateForDayView(selectedTimeStamp) {
  let selectedDate = new Date(selectedTimeStamp * 1000);
  selectedDate =
    compareDate(selectedDate) > 0
      ? selectedDate
      : new Date(new Date().toDateString());
  return getDateTimeInUTC(selectedDate) / 1000;
}

export function getCalendarButtonGroup() {
  return [
    {
      id: DAY,
      label: 'Day',
      range: 1,
    },
    {
      id: WEEK,
      label: 'Week',
      range: 7,
    },
  ];
}

export function getXYCoordinates(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return {
    x,
    y,
  };
}

export function getResponsiveXYCoordinates(markUp, element, lightBoxObj) {
  const rect = element.getBoundingClientRect();
  const coordinate_x =
    (lightBoxObj.imageWidth / rect.width) * markUp.coordinate_x;
  const coordinate_y =
    (lightBoxObj.imageHeight / rect.height) * markUp.coordinate_y;
  return {
    coordinate_x,
    coordinate_y,
  };
}

export function getResponsiveXYCoordinatesToRender(markUp, rect, lightBoxObj) {
  const coordinate_x =
    (rect.width / lightBoxObj.imageWidth) * markUp.coordinate_x;
  const coordinate_y =
    (rect.height / lightBoxObj.imageHeight) * markUp.coordinate_y;
  return {
    coordinate_x,
    coordinate_y,
  };
}

export function getImageDimensions(url, callback) {
  const client = new XMLHttpRequest();
  client.onreadystatechange = function() {
    if (this.readyState === this.HEADERS_RECEIVED) {
      const header = client.getResponseHeader('x-amz-meta-dimensions');
      let dimensions = {};
      if (header) {
        dimensions = header.split('x');
        dimensions = { width: dimensions[0], height: dimensions[1] };
      }
      callback && callback(dimensions);
    }
  };
  client.open('GET', url, true);
  client.send();
}

export const removeParamFromRoute = key => {
  const url = new URL(document.location);
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(key);
  window.history.pushState(
    {},
    null,
    `${url.pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`,
  );
};

/**
 * @param object dictionary object
 * @param keys (.) sperated string for nested object
 * @returns {*} the object value from string dot(.) notations
 */
export const getValueFromDict = (object, keys) =>
  keys.split('.').reduce((o, k) => (o || {})[k], object);

export function getShotCounterInfo(shot) {
  const lastUpdated =
    shot.shot_info.counter_info &&
    shot.shot_info.counter_info.last_updated.timestamp;
  if (lastUpdated) {
    const lastUpdateObject = moment(lastUpdated);
    const currentObject = moment.utc();
    const diff = currentObject.diff(lastUpdateObject, DAYS);
    return diff > 0 ? diff : null;
  }
  return null;
}
