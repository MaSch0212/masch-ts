import { Subscription } from "rxjs";
import { ISubscriptionManager } from "./ISubscriptionManager";

/**
 * Manages rxjs subscriptions
 * @export
 * @class SubscriptionManager
 * @implements {ISubscriptionManager}
 */
export class SubscriptionManager implements ISubscriptionManager {
  private readonly _subscriptions: Map<string | undefined, Array<Subscription>>;

  constructor() {
    this._subscriptions = new Map<string | undefined, Array<Subscription>>();
  }

  public add(...subscriptions: (Subscription | null | undefined)[]): void {
    this.addImpl(undefined, subscriptions);
  }

  public addWithName(name: string | null | undefined, ...subscriptions: (Subscription | null | undefined)[]): void {
    this.addImpl(name, subscriptions);
  }

  public set(name: string | null | undefined, ...subscriptions: (Subscription | null | undefined)[]): void {
    this.unsubscribe(name);
    this.addImpl(name, subscriptions);
  }

  public remove(...subscriptions: (Subscription | null | undefined)[]): void {
    this.removeImpl(undefined, subscriptions);
  }

  public removeWithName(name: string | null | undefined, ...subscriptions: (Subscription | null | undefined)[]): void {
    this.removeImpl(name, subscriptions);
  }

  public unsubscribeAll(): void {
    for (let group of this._subscriptions) {
      group[1].forEach((s: Subscription) => s.unsubscribe());
      this._subscriptions.delete(group[0]);
    }
  }

  public unsubscribe(name?: string | null | undefined): void {
    const subGroup: Array<Subscription> | undefined = this._subscriptions.get(name || undefined);
    if (subGroup) {
      subGroup.forEach((s: Subscription) => s.unsubscribe());
      this._subscriptions.delete(name || undefined);
    }
  }

  private addImpl(name: string | null | undefined, subscriptions: (Subscription | null | undefined)[]): void {
    const subGroup: Array<Subscription> = this.getOrCreateSubscriptionGroup(name);
    subscriptions?.forEach((s: Subscription | null | undefined) => {
      if (s) {
        subGroup.push(s);
      }
    });
  }

  private removeImpl(name: string | null | undefined, subscriptions: (Subscription | null | undefined)[]): void {
    const subGroup: Array<Subscription> | undefined = this._subscriptions.get(name || undefined);
    if (subGroup) {
      subscriptions.forEach((s: Subscription | undefined | null) => {
        if (!s) {
          return;
        }

        const index = subGroup.indexOf(s);
        if (index < 0) {
          return;
        }

        subGroup.splice(index, 1);
      });
    }
  }

  private getOrCreateSubscriptionGroup(name: string | null | undefined): Array<Subscription> {
    if (name === null) {
      name = undefined;
    }

    let subscriptions: Array<Subscription> | undefined = this._subscriptions.get(name);
    if (!subscriptions) {
      subscriptions = [];
      this._subscriptions.set(name, subscriptions);
    }

    return subscriptions;
  }
}
