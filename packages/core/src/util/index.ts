/**
 * Core utilities required/shared between the Monitor and Observable.
 */

import { DeepPartial } from "../types";

/**
 * Returns true if the supplied property is one of the reserved Observable keys that we do not want to intercept
 * @param prop
 */
export const ignoredKey = (prop: string): boolean => {
  return prop === 'propertyObservers' ||
    prop === 'changeObservers' ||
    prop === 'isObservable' ||
    prop === 'childChangeFunctions' ||
    prop === 'isObservableProxy' ||
    prop === 'diffRoot' ||
    prop === 'elementChangedHandlers' ||
    prop === 'knownKeysMap' ||
    prop === 'knownKeysList' ||
    prop === 'isVector3' ||
    prop === 'onPropertyChanged' ||
    prop === 'removeOnPropertyChanged' ||
    prop === 'onChanged' ||
    prop === 'target';
};

/**
 * Returns a deep copy object with any internal observable related keys removed.
 * @param {number} obj
 * @param {number} ancestors Internal list to keep track of circular references
 */
export const deepCopy = (obj: any, ancestors: any = []): any => {
  // deep copy of undefined is undefined
  if (obj === undefined) {
    return undefined;
  }
  // Avoid circular references by looking at ancestors nodes
  if (obj in ancestors) {
    return {};
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  // explicitly handle this case because typeof null === 'object'
  if (obj === null) {
    return null;
  }
  if (obj.deepCopy) {
    return obj.deepCopy();
  }
  if (typeof obj === 'object') {
    const output: any = Array.isArray(obj) || ArrayBuffer.isView(obj) ? [] :
                        {};
    for (const key in obj) {
      if (ignoredKey(key)) {
        continue;
      }
      const v = obj[key];
      if (v instanceof Date) {
        output[key] = new Date(v);
      }
      else if (typeof v !== 'function') {
        output[key] = (typeof v === 'object') ? deepCopy(v, ancestors.concat(obj)) : v;
      }
    }
    return output;
  }
  else {
    return obj;
  }
};

/**
 * Merge object B, into object A, adding new properties, or updating existing properties as needed.
 * Note: Ignores Observable specific properties listed in ignoredKey()
 */
export const merge = (a: any, b: any): void => {
  for (const key in b) {
    if (typeof b[key] === 'function') {
      continue;
    }
    if (ignoredKey(key) && !a.hasOwnProperty(key)) {
      continue;
    }
    const bVal = b[key];
    if (a.hasOwnProperty(key)) {
      const aVal = a[key];
      const aType = aVal === null ? null : typeof aVal;
      const bType = bVal === null ? null : typeof bVal;
      if (aType !== bType) {
        a[key] = deepCopy(bVal);
      }
      else if (typeof aVal === 'object') {
        if (aVal instanceof Date) {
          a[key] = new Date(bVal);
        }
        else {
          merge(aVal, bVal);
        }
      }
      else {
        a[key] = bVal;
      }
    }
    else {
      a[key] = deepCopy(bVal);
    }
  }
};

/**
 * Return a "diff object", a partial object which contains any NEW key/value pairs
 * in the "newer" param tree
 */
export const diffObject = <T>(original: DeepPartial<T>, newer: DeepPartial<T>) => {
  const out: any = {};
  for (const key in original) {
    const originalValue = original[key];
    const newerValue = newer[key];
    if (deepDiffers(originalValue, newerValue)) {
      if (originalValue === undefined || newerValue === undefined) {
        out[key] = newerValue;
      }
      else if (typeof originalValue !== typeof newerValue) {
        out[key] = newerValue;
      }
      else if (typeof originalValue !== 'object') {
        out[key] = newerValue;
      }
      else if (Array.isArray(newerValue)) {
        if (deepDiffers(originalValue, newerValue)) {
          out[key] = newerValue;
        }
      }
      else {
        out[key] = diffObject(originalValue as any, newerValue as any);
      }
    }
  }
  for (const key in newer) {
    if (!(key in original)) {
      out[key] = newer[key];
    }
  }
  return out;
};

/**
 * Using deep comparison, returns true if a difference is found between two variables or their nested values.
 */
export const deepDiffers = (a: any, b: any): boolean => {
  if (typeof a === 'object') {
    if (!b) return true;

    for (const key in b) if (!(key in a)) return true;
    for (const key in a) {
      if (deepDiffers(a[key], b[key])) return true;
    }
  } else {
    return a !== b;
  }
  return false;
};

export function isNumber(x: any): x is number {
  return typeof x === 'number';
}
