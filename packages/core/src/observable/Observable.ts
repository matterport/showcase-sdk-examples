import { ISubscription } from '../subscription/ISubscription';

export type ChangeObserver<T = never> = (newValue: T) => void;

/**
 * Observable: Let something subscribe to changes to something else
 *
 * Abstract base class for all the other Observable* classes. Implements
 * the basic onChange(), notification and dirty concepts.
 */
export class Observable<T> {
  public readonly isObservable: boolean = true;

  /**
   * Does this Observable have gossip to share with its observers?
   */
  public _dirtyObservable: boolean = false;

  /**
   * If an Observable is active, it will immediately notify any listeners
   * about its changes. It can be useful to set this to false while doing many changes together
   */
  private _activeObservable: boolean = true;

  /**
   * Callbacks for when any property or element of this instance of Observable change
   */
  private _changeObservers = new Set<ChangeObserver<T>>();

  /**
   * Observables which this Observable will propagate its changes to
   */
  private _parentObservables: Set<Observable<any>> = new Set();
  private _childObservables: Set<Observable<any>> = new Set();

  constructor() { }

  /**
   * Register a callback to be called whenever any kind of change occurs with this object.
   * It is up to the deriving classes to determine what a "change" is.
   *
   * @param {ChangeObserver<T>} [observer]
   * @memberof Observable
   */
  public onChanged (observer: ChangeObserver<T>): ISubscription {
    if (this._changeObservers.has(observer)) {
      throw new Error('This observer function is already observing this Observable, ' +
                      'and double subscriptions are not supported.');
    }
    const renew = () => this._changeObservers.add(observer);
    const cancel = () => this.removeOnChanged(observer);
    renew();
    return {
      renew,
      cancel,
    } as ISubscription;
  }

  /**
   * Remove a specific callback registered to respond to any change event.
   *
   * @param {ChangeObserver} [observer]
   * @memberof Observable
   */
  public removeOnChanged (observer: ChangeObserver<T>): void {
    this._changeObservers.delete(observer);
  }

  /**
   * Call the "anything changed" callbacks associated with 'observable'.
   * Also calls it for any ancestors, then finally clears the dirty flag.
   */
  protected notifyObservers () {
    if (this._activeObservable && this._dirtyObservable) {
      for (const changeObserver of this._changeObservers) {
        this.notifyObserver(changeObserver);
      }
      for (const parent of this._parentObservables) {
        parent.notifyObservers();
      }
      this._dirtyObservable = false;
    }
  }

  protected notifyObserver (observer: ChangeObserver<T>): void {
    // The basic onChange() has no arguments (because an Observable itself has no value),
    // but any subclass will likely override this
    observer(undefined as never);
  }

  /**
   * Set this object and all Observable ancestors as dirty,
   * then notify all observers. Generally used internally by the Observable* implementations,
   * but can also be triggered manually if needed
   */
  public setDirty () {
    // We dirty the tree first BEFORE notifying,
    // because notifying will stop propagating if the observable is inactive
    this.setDirtyRecursive();
    this.notifyObservers();
  }

  private setDirtyRecursive () {
    this._dirtyObservable = true;
    for (const parent of this._parentObservables) {
      parent.setDirtyRecursive();
    }
  }

  /**
   * Add an Observable as a child to this one (if it's Observable)
   * This is what ensures onChange() notifications bubble up correctly
   * and setActive() flows down correctly
   */
  protected addChildObservable (obj: T | Observable<any>): void {
    if (Observable.isObservable(obj)) {
      this._childObservables.add(obj);
      obj._parentObservables.add(this);
    }
  }

  /**
   * Remove an Observable as a child to this one (if it's Observable)
   * This is what ensures onChange() notifications bubble up correctly,
   * and setActive() flows down correctly
   */
  protected removeChildObservables (obj: T | Observable<any>): void {
    if (Observable.isObservable(obj)) {
      this._childObservables.delete(obj);
      obj._parentObservables.delete(this);
    }
  }

  /**
   * Run a function *atomically*, meaning that even if you
   * mutate lots of parts of the Observable dozens of times,
   * listeners will only be notified once
   * @param func to fun
   */
  public atomic (func: () => void) {
    // If we are already inactive (aka in an atomic block),
    // we don't have to do anything, the outer atomic will handle this
    if (!this._activeObservable) {
      return func();
    }
    try {
      this.setActive(false);
      func();
    }
    finally {
      this.setActive(true);
    }
  }

  /**
   * Set whether this Observable (and all descendants) should be
   * considered active, aka notifying about changes
   * @param value
   */
  protected setActive (value: boolean) {
    const oldValue = this._activeObservable;
    this._activeObservable = value;
    if (!oldValue && value) {
      this.notifyObservers();
    }
    for (const child of this._childObservables) {
      child.setActive(value);
    }
  }

  /**
   * Return a deep copy of the target object of the observable,
   * without any observable members. See also the deepCopy util function
   */
  public deepCopy (): any {
    throw Error('deepCopy is only implemented in subclasses of Observable');
  }

  /**
   * Convenient static function to type check if object is Observable
   * @param obj
   */
  public static isObservable<T> (obj: any): obj is Observable<T> {
    return obj && obj.isObservable;
  }
}
