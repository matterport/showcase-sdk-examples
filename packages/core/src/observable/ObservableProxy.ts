import { Observable, ChangeObserver } from './Observable';
import { ObservableValue, createObservableValue } from './ObservableValue';
import { ISubscription } from '../subscription/ISubscription';
import { deepCopy } from '../util/index';
import { copyAllProperties } from './util';
import { Dict } from '../types';

interface ObservableProxyInternal<T> {
  onPropertyChanged<K extends keyof T>(property: K, callback: ChangeObserver<T[K]>): ISubscription;
  removeOnPropertyChanged<K extends keyof T>(property: K, callback: ChangeObserver<T[K]>): void;
}
/**
 * ObservableProxy makes an object and all its properties an Observable,
 * while still acting as much as possible like the original object.
 *
 * Ways to observe:
 * - The normal Observable onChange(),
 * - The ObservableProxy specific onPropertyChanged() which allows you to listen to one prop only
 *
 * Any changes to Observable property values in an ObservableProxy bubble up to the ObservableProxy as well.
 *
 * Usage notes:
 *  - All properties of an object being wrapped in an ObservableProxy have to be defined
 *    up front, BEFORE its being wrapped. Otherwise the ObservableProxy does not know about the property.
 *    If you get an error that the proxy cannot be modified, that's why.
 *
 *    In other words, make sure that all members of the wrapped object actually get values in the
 *    constructor, even if those values are `undefined`.
 *
 */
export type ObservableProxy<T> = Observable<T> & ObservableProxyInternal<T> & T;

export const createObservableProxy = <T extends object>(target: T): ObservableProxy<T> => {
  if (!target || Object.keys(target).length === 0) {
    throw new Error('createObservableProxy() only works on objects that has predefined keys. ' +
      'Did you mean createObservableMap or createObservableArray?');
  }
  if ((target as any).isObservableProxy) {
    return target as ObservableProxy<T>;
  }
  const propertyObservables: Dict<ObservableValue<any>> = {};
  const mainObservable = new Observable();
  const proxy = Object.create(target);

  // Add any ObservableProxy specific properties
  Object.defineProperties(proxy, {
    isObservableProxy: {
      value: true,
    },
    onPropertyChanged: {
      value(property: string, callback: ChangeObserver<T>) {
        return propertyObservables[property].onChanged(callback);
      },
    },
    removeOnPropertyChanged: {
      value(property: string, callback: ChangeObserver<T>) {
        return propertyObservables[property].removeOnChanged(callback);
      },
    },
    deepCopy: {
      value() {
        return deepCopy(target);
      },
    },
  });
  // Really what we want here is multiple inheritance:
  // `proxy extends target & Observable`
  // But since we can't easily do that, we copy all the Observable properties over
  // We could also just hardcode it in the defineProperties further up
  copyAllProperties(proxy, mainObservable);

  // Add a ObservableValue for each property in the object,
  // link it to the main observable, and then define a getter/
  // setter for each property that points to the target's value
  // AND updates the ObservableValue on a set
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      const observable = createObservableValue(target[key]);
      propertyObservables[key] = observable;
      proxy.addChildObservable(observable);
      Object.defineProperty(proxy, key, {
        get: () => target[key],
        set: (value) => {
          target[key] = value;
          propertyObservables[key].value = value;
        },
        enumerable: true,
      });
    }
  }
  // Seal the object so we get an error if something else modified the object later,
  // as modifying the proxy *after* here would likely create bugs.
  Object.seal(proxy);
  return proxy;
};
