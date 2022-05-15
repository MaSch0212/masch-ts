import { OnDestroy, Component } from '@angular/core';
import { SubscriptionManager, DefaultSubscriptionManager } from '@masch212/rxjs';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected readonly subscriptionManager: SubscriptionManager;

  constructor() {
    this.subscriptionManager = this.createSubscriptionManager();
  }

  public ngOnDestroy(): void {
    this.subscriptionManager.unsubscribeAll();
  }

  protected createSubscriptionManager(): SubscriptionManager {
    return new DefaultSubscriptionManager();
  }
}
