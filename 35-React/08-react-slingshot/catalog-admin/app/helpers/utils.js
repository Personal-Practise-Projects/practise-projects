import { getValueFromDict } from './common';

export class StringHelper {
  /** *
   * Class will construct and provide formatted string with replaced value of ## with args in same order
   * @param format format able string
   * @param args args in same order
   */
  static format(format, ...args) {
    args.forEach(arg => {
      format = format.replace('##', arg);
    });
    return format;
  }

  /** *
   * Class will construct and provide formatted string with replaced value of {key} with value received from dict
   * @param format format able string
   * @param argsDict provide dictionary of args with key value key should be formatted in
   * string like this 'hello sample {key} string'
   */
  static formatKeyArguments(format, argsDict) {
    Object.keys(argsDict).forEach(key => {
      format = format.replace(`{${key}}`, argsDict[key]);
    });
    return format;
  }

  /**
   * return capitalize string
   * @param value
   * @returns {string}
   */
  static capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

export class ArrayUtils {
  static intersect(arr1, arr2) {
    return arr1.filter(element => arr2.includes(element));
  }

  /** *
   * Function will return all the element which exists in array1 but not in array2
   * @returns {Array} difference between
   */
  static arrSubtract(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x));
  }

  /** *
   * Function will return all the element which exists in both array1 and array2
   * @returns {Array} intersect between array
   */
  static arrIntersect(arr1, arr2) {
    return arr1.filter(x => arr2.includes(x));
  }

  /** *
   * Function will return all the element which exists in both array1 and array2
   * @returns {Array} inverse intersect between array
   */
  static arrInverseIntersect(arr1, arr2) {
    return [
      ...arr1.filter(x => !arr2.includes(x)),
      ...arr2.filter(x => !arr1.includes(x)),
    ];
  }

  /** *
   * Function will return dictionary for provided array with key as value from field
   * @returns {Array} of values
   */
  static toDict(arr, fieldKey) {
    const dataDict = {};
    return arr.forEach(item => {
      dataDict[item[fieldKey]] = item;
    });
  }

  /** *
   * Function will return all the values as a list from provided dict
   * @returns {Array} of values
   */
  static values(object) {
    return ArrayUtils.keys(object).map(key => object[key]);
  }

  /** *
   * Function will return all the keys from dict objects as a list
   * @returns {Array} of keys
   */
  static keys(object) {
    return Object.keys(object);
  }
}

export function filterList(list, filterList) {
  /**
   * filter the array based on the filter list
   * function does the 'or' operation on the list of filters
   */
  if (!filterList.length) return list;

  const finalList = [];
  list.map(item => {
    filterList.some(filter => {
      const filterKey = Object.keys(filter)[0];
      const filterValue = filter[filterKey];
      if (getValueFromDict(item, filterKey) === filterValue) {
        finalList.push(item);
      }
    });
  });
  return finalList;
}
