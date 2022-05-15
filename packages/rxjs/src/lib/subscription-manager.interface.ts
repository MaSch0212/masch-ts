import { Subscription } from "rxjs";

/**
 * Represents an object that manages rxjs subscriptions.
 * @export
 * @interface SubscriptionManager
 */
export interface SubscriptionManager {
  /**
   * Adds subscriptions.
   * @abstract
   * @param {...Array<Subscription | undefined | null>} subscriptions The subscriptions to add. `null` or `undefined` values are ignored.
   * @memberof SubscriptionManager
   */
  add(...subscriptions: Array<Subscription | undefined | null>): void;

  /**
   * Adds subscriptions with a specified name.
   * @abstract
   * @param {string | null | undefined} name The name of the subscriptions.
   * @param {...Array<Subscription | undefined | null>} subscriptions The subscriptions to add. `null` or `undefined` values are ignored.
   * @memberof SubscriptionManager
   */
  addWithName(name: string | null | undefined, ...subscriptions: Array<Subscription | undefined | null>): void;

  /**
   * Unsubscribes and removes all subscriptions with a specified name and adds subscriptions with the same name.
   * @abstract
   * @param {string | null | undefined} name The name of the subscriptions.
   * @param {...Array<Subscription | undefined | null>} subscriptions The subscriptions to add. `null` or `undefined` values are ignored.
   * @memberof SubscriptionManager
   */
  set(name: string | null | undefined, ...subscriptions: Array<Subscription | undefined | null>): void;

  /**
   * Removes subscriptions without unsubscribing.
   * @abstract
   * @param {...Array<Subscription | undefined | null>} subscriptions The subscriptions to remove. `null` or `undefined` values are ignored.
   * @memberof SubscriptionManager
   */
  remove(...subscriptions: Array<Subscription | undefined | null>): void;

  /**
   * Removes subscriptions with a sepcified name without unsubscribing.
   * @param {(string | null | undefined)} name The name of the subscriptions.
   * @param {(...Array<Subscription | undefined | null>)} subscriptions The subscriptions to remove. `null` or `undefined` values are ignored.
   * @memberof SubscriptionManager
   */
  removeWithName(name: string | null | undefined, ...subscriptions: Array<Subscription | undefined | null>): void;

  /**
   * Unsubscribes and removes all subscriptions.
   * @abstract
   * @memberof SubscriptionManager
   */
  unsubscribeAll(): void;

  /**
   * Unsubscribes and removes all subscriptions with a specified name.
   * @abstract
   * @param {string | null | undefined} name The name of the subscriptions.
   * @memberof SubscriptionManager
   */
  unsubscribe(name?: string | null | undefined): void;
}
