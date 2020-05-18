import { Observable } from './Observable';
import { ChangeObserver } from './Observable';
import { deepCopy } from '../util/index';

/**
 * An ObservableValue lets you listen to a single value
 *
 * *  Ways to observe:
 * - The normal Observable onChange()
 *
 * If the value in the ObservableValue is also Observable, any changes to the value
 * will also bubble up to the ObservableValue
 */
export class ObservableValue<T> extends Observable<T> {
  private _value: T;

  constructor(intialValue: T) {
    super();
    this.value = intialValue;
  }

  protected notifyObserver = (observer: ChangeObserver<T>): void => {
    observer(this.value);
  }

  public get value(): T {
    return this._value;
  }

  public set value(newVal: T) {
    if (this._value !== newVal) {
      this.removeChildObservables(this._value);
      this.addChildObservable(newVal);
      this._value = newVal;
      this.setDirty();
    }
  }

  public deepCopy() {
    return deepCopy(this._value);
  }
}

export const createObservableValue = <T = any>(value: T) => {
  return new ObservableValue<T>(value);
};
