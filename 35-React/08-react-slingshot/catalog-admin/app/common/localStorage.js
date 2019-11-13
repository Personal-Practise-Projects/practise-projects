import { getCurrentSelectedTenant } from "../helpers/user";
import { StringHelper } from "../helpers/utils";

const DEFAULT_STORAGE_TIMEOUT = 24 * 60 * 60 * 1000;
let extractStorageKey = function (key, global) {
  if (global) {
    return key.toString();
  } else {
    let currentTenant = getCurrentSelectedTenant();
    return StringHelper.format('##.##', currentTenant, key.toString());
  }

};
const ttlLocalStorage = {
  setItem: function (key, value, ttl_ms = DEFAULT_STORAGE_TIMEOUT, globalData = true) {
    const storageKey = extractStorageKey(key, globalData);
    let data = { value: value, expiresAt: new Date().getTime() + ttl_ms };
    localStorage.setItem(storageKey, JSON.stringify(data));
  },
  getItem: function (key, globalData = true) {
    const storageKey = extractStorageKey(key, globalData);
    let data = JSON.parse(localStorage.getItem(storageKey));
    if (data) {
      if (data.expiresAt !== null && data.expiresAt < new Date().getTime()) {
        localStorage.removeItem(storageKey);
      } else {
        return data.value;
      }
    }
    return null;
  }
};

export default ttlLocalStorage;
