/**
 * A wrapper for data/observable subscriptions, allowing simple subscribing and unsubscribing to data/observable changes
 * without direct references to the market, the original observables, or the callback to be (un)registered.
 *
 * @template T
 * @template K
 */
export interface ISubscription {
  /**
   * Subscribe to changes of the data in the Catalog
   * If this subscription has been previously renewed (w/o being cancelled) no changes occur
   * a.k.a. renewing an active subscription is a no-op
   *
   * @memberof ISubscription
   */
  renew(): void;

  /**
   * Unsubscribe from change of the data in the Catalog
   * If this subscription has been previously cancelled (w/o being renewed) no changes occur
   * a.k.a. cancelling a cancelled subscription is a no-op
   *
   * @memberof ISubscription
   */
  cancel(): void;
}
