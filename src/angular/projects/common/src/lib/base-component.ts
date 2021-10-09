import { OnDestroy, Component } from '@angular/core';
import { SubscriptionManager } from '@masch212/rxjs';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected readonly subscriptionManager: SubscriptionManager;

  constructor() {
    this.subscriptionManager = new SubscriptionManager();
  }

  public ngOnDestroy(): void {
    this.subscriptionManager.unsubscribeAll();
  }
}
