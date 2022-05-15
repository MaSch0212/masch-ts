import { DefaultSubscriptionManager } from './subscription-manager';
import { Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'moq.ts';

describe('Subscription Manager', () => {

  let subscriptionManager: DefaultSubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new DefaultSubscriptionManager();
  });

  describe('add', () => {

    it.each`
      subscription
      ${null}
      ${undefined}
    `('should not add $subscription subscriptions', (x: {subscription: null | undefined}) => {
      subscriptionManager.add(x.subscription);
      expectSubscriptions([[undefined, []]]);
    });

    it('should add subscriptions', () => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.add(subscription);
      expectSubscriptions([[undefined, [subscription]]]);
    });

    it('should ignore any null and undefined values when adding multiple subscriptions', () => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.add(null, undefined, subscription, undefined, null);
      expectSubscriptions([[undefined, [subscription]]]);
    });

  });

  describe('addWithName', () => {

    it.each`
      subscription
      ${null}
      ${undefined}
    `('should not add $value subscriptions', (x: {subscription: null | undefined}) => {
      subscriptionManager.addWithName('dummy', x.subscription);
      expectSubscriptions([['dummy', []]]);
    });

    it('should add subscriptions', () => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.addWithName('dummy', subscription);
      expectSubscriptions([['dummy', [subscription]]]);
    });

    it('should ignore any null and undefined values when adding multiple subscriptions', () => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.addWithName('dummy', null, undefined, subscription, undefined, null);
      expectSubscriptions([['dummy', [subscription]]]);
    });

  });

  describe('set', () => {

    it.each`
      displayName                                   | name         | subscription
      ${'name=undefined, with subscription object'} | ${undefined} | ${getSubscriptionMock().object()}
      ${'name=null, with subscription object'}      | ${null}      | ${getSubscriptionMock().object()}
      ${'name=dummy, with subscription object'}     | ${'dummy'}   | ${getSubscriptionMock().object()}
      ${'name=dummy, subscription=undefined'}       | ${'dummy'}   | ${getSubscriptionMock().object()}
      ${'name=dummy, subscription=null'}            | ${'dummy'}   | ${getSubscriptionMock().object()}
    `('should add group if it did not exist before (name=$displayName)', (value: { name: string | undefined | null, subscription: Subscription | undefined | null }) => {
      subscriptionManager.set(value.name, value.subscription);
      expectSubscriptions([[value.name || undefined, value.subscription ? [value.subscription] : []]]);
    });

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should unsubscribe old subscriptions and replace existing group (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      const oldSubscriptionMock = getSubscriptionMock();
      const newSubscriptionMock = getSubscriptionMock();
      subscriptionManager.addWithName(x.subscriptionName, oldSubscriptionMock.object());

      subscriptionManager.set(x.subscriptionName, newSubscriptionMock.object());

      expectSubscriptions([[x.subscriptionName || undefined, [newSubscriptionMock.object()]]]);
      oldSubscriptionMock.verify(x => x.unsubscribe(), Times.Once());
      newSubscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });
  });

  describe('remove', () => {

    it('should remove subscription without unsubscribing', () => {
      const subscriptionMock = getSubscriptionMock();
      subscriptionManager.add(subscriptionMock.object());
      subscriptionManager.remove(subscriptionMock.object());
      expectSubscriptions([[undefined, []]]);
      subscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });

    it('should not throw error if undefined subscription group does not exist', () => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.remove(subscription);
      expectSubscriptions([]);
    });

    it('should not throw error for subscriptions that do not exist in subscriptions', () => {
      const existingSubscriptionMock = getSubscriptionMock();
      const subscription = getSubscriptionMock().object();
      subscriptionManager.add(existingSubscriptionMock.object());
      subscriptionManager.remove(subscription);
      expectSubscriptions([[undefined, [existingSubscriptionMock.object()]]]);
      existingSubscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });

    it.each`
      subscription
      ${undefined}
      ${null}
    `('should not throw error for $subscription subscription', (x: {subscription: undefined | null}) => {
      subscriptionManager.remove(x.subscription);
    });

  });

  describe('removeWithName', () => {

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should remove subscription without unsubscribing (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      const subscriptionMock = getSubscriptionMock();
      subscriptionManager.addWithName(x.subscriptionName, subscriptionMock.object());
      subscriptionManager.removeWithName(x.subscriptionName, subscriptionMock.object());
      expectSubscriptions([[x.subscriptionName || undefined, []]]);
      subscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should not throw error if subscription group does not exist (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.removeWithName(x.subscriptionName, subscription);
      expectSubscriptions([]);
    });

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should not throw error for subscriptions that do not exist in subscriptions (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      const existingSubscriptionMock = getSubscriptionMock();
      const subscription = getSubscriptionMock().object();
      subscriptionManager.addWithName(x.subscriptionName, existingSubscriptionMock.object());
      subscriptionManager.removeWithName(x.subscriptionName, subscription);
      expectSubscriptions([[x.subscriptionName || undefined, [existingSubscriptionMock.object()]]]);
      existingSubscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });

    it.each`
      subscription
      ${undefined}
      ${null}
    `('should not throw error for $subscription subscription', (x: {subscription: undefined | null}) => {
      subscriptionManager.removeWithName('dummy', x.subscription);
    });

  });

  describe('unsubscribeAll', () => {

    it('should unsubscribe all subscriptions in all groups', () => {
      const sub1Mock = getSubscriptionMock();
      const sub2Mock = getSubscriptionMock();
      const sub3Mock = getSubscriptionMock();
      subscriptionManager.add(sub1Mock.object());
      subscriptionManager.add(sub2Mock.object());
      subscriptionManager.addWithName('dummy', sub3Mock.object());

      subscriptionManager.unsubscribeAll();

      expectSubscriptions([]);
      sub1Mock.verify(x => x.unsubscribe(), Times.Once());
      sub2Mock.verify(x => x.unsubscribe(), Times.Once());
      sub3Mock.verify(x => x.unsubscribe(), Times.Once());
    })

  });

  describe('unsubscribe', () => {

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should remove und unsubscribe subscriptions (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      const sub1Mock = getSubscriptionMock();
      const sub2Mock = getSubscriptionMock();
      const sub3Mock = getSubscriptionMock();
      subscriptionManager.addWithName(x.subscriptionName, sub1Mock.object());
      subscriptionManager.addWithName(x.subscriptionName, sub3Mock.object());
      subscriptionManager.addWithName('persistant', sub2Mock.object());

      subscriptionManager.unsubscribe(x.subscriptionName);
      expectSubscriptions([['persistant', [sub2Mock.object()]]]);
      sub1Mock.verify(x => x.unsubscribe(), Times.Once());
      sub2Mock.verify(x => x.unsubscribe(), Times.Never());
      sub3Mock.verify(x => x.unsubscribe(), Times.Once());
    });

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should remove und unsubscribe subscriptions (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      const subscriptionMock = getSubscriptionMock();
      subscriptionManager.addWithName(x.subscriptionName, subscriptionMock.object());
      subscriptionManager.unsubscribe(x.subscriptionName);
      expectSubscriptions([]);
      subscriptionMock.verify(x => x.unsubscribe(), Times.Once());
    });

    it.each`
      subscriptionName
      ${undefined}
      ${null}
      ${'dummy'}
    `('should not throw error if subscription group does not exist (name=$subscriptionName)', (x: {subscriptionName: string | undefined | null}) => {
      subscriptionManager.unsubscribe(x.subscriptionName);
      expectSubscriptions([]);
    });

  });

  function getSubscriptions(): [string | undefined, Subscription[]][] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subs = ((subscriptionManager as any)._subscriptions) as Map<string | undefined, Array<Subscription>>;
    return Array.from(subs.entries());
  }

  function expectSubscriptions(expected: [string | undefined, Subscription[]][]): void {
    expect(getSubscriptions()).toEqual(expected);
  }

  function getSubscriptionMock(): IMock<Subscription> {
    return new Mock<Subscription>()
      .setup(x => x.unsubscribe())
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .callback(() => {});
  }
});
