import { SubscriptionManager } from './SubscriptionManager';
import { of, Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'moq.ts';

import * as chai from 'chai';

const itParam = require('mocha-param');
const expect = chai.expect;
describe('Subscription Manager', () => {

  let subscriptionManager: SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManager();
  });

  describe('add', () => {

    itParam('should not add ${value} subscriptions', [null, undefined], (value: any) => {
      subscriptionManager.add(value);
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

    itParam('should not add ${value} subscriptions', [null, undefined], (value: any) => {
      subscriptionManager.addWithName('dummy', value);
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

    itParam('should add group if it did not exist before (name=${value.displayName})', [
      { name: undefined, subscription: getSubscriptionMock().object(), displayName: 'name=undefined, with subscription object' },
      { name: null, subscription: getSubscriptionMock().object(), displayName: 'name=null, with subscription object' },
      { name: 'dummy', subscription: getSubscriptionMock().object(), displayName: 'name=dummy, with subscription object' },
      { name: 'dummy', subscription: undefined, displayName: 'name=dummy, subscription=undefined' },
      { name: 'dummy', subscription: null, displayName: 'name=dummy, subscription=null' }
    ], (value: { name: string | undefined | null, subscription: Subscription | undefined | null }) => {
      subscriptionManager.set(value.name, value.subscription);
      expectSubscriptions([[value.name || undefined, value.subscription ? [value.subscription] : []]]);
    });

    itParam('should unsubscribe old subscriptions and replace existing group (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const oldSubscriptionMock = getSubscriptionMock();
      const newSubscriptionMock = getSubscriptionMock();
      subscriptionManager.addWithName(value, oldSubscriptionMock.object());

      subscriptionManager.set(value, newSubscriptionMock.object());

      expectSubscriptions([[value || undefined, [newSubscriptionMock.object()]]]);
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

    itParam('should not throw error for ${value} subscription', [undefined, null], (value: any) => {
      subscriptionManager.remove(value);
    });

  });

  describe('removeWithName', () => {

    itParam('should remove subscription without unsubscribing (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const subscriptionMock = getSubscriptionMock();
      subscriptionManager.addWithName(value, subscriptionMock.object());
      subscriptionManager.removeWithName(value, subscriptionMock.object());
      expectSubscriptions([[value || undefined, []]]);
      subscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });

    itParam('should not throw error if subscription group does not exist (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.removeWithName(value, subscription);
      expectSubscriptions([]);
    });

    itParam('should not throw error for subscriptions that do not exist in subscriptions (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const existingSubscriptionMock = getSubscriptionMock();
      const subscription = getSubscriptionMock().object();
      subscriptionManager.addWithName(value, existingSubscriptionMock.object());
      subscriptionManager.removeWithName(value, subscription);
      expectSubscriptions([[value || undefined, [existingSubscriptionMock.object()]]]);
      existingSubscriptionMock.verify(x => x.unsubscribe(), Times.Never());
    });

    itParam('should not throw error for ${value} subscription', [undefined, null], (value: any) => {
      subscriptionManager.removeWithName('dummy', value);
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

    itParam('should remove und unsubscribe subscriptions (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const sub1Mock = getSubscriptionMock();
      const sub2Mock = getSubscriptionMock();
      const sub3Mock = getSubscriptionMock();
      subscriptionManager.addWithName(value, sub1Mock.object());
      subscriptionManager.addWithName(value, sub3Mock.object());
      subscriptionManager.addWithName('persistant', sub2Mock.object());

      subscriptionManager.unsubscribe(value);
      expectSubscriptions([['persistant', [sub2Mock.object()]]]);
      sub1Mock.verify(x => x.unsubscribe(), Times.Once());
      sub2Mock.verify(x => x.unsubscribe(), Times.Never());
      sub3Mock.verify(x => x.unsubscribe(), Times.Once());
    });

    itParam('should remove und unsubscribe subscriptions (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const subscriptionMock = getSubscriptionMock();
      subscriptionManager.addWithName(value, subscriptionMock.object());
      subscriptionManager.unsubscribe(value);
      expectSubscriptions([]);
      subscriptionMock.verify(x => x.unsubscribe(), Times.Once());
    });

    itParam('should not throw error if subscription group does not exist (name=${value})', [undefined, null, 'dummy'], (value: any) => {
      const subscription = getSubscriptionMock().object();
      subscriptionManager.unsubscribe(value);
      expectSubscriptions([]);
    });

  });

  function getSubscriptions(): [string | undefined, Subscription[]][] {
    const subs = ((subscriptionManager as any)._subscriptions) as Map<string | undefined, Array<Subscription>>;
    return Array.from(subs.entries());
  }

  function expectSubscriptions(expected: [string | undefined, Subscription[]][]): void {
    expect(getSubscriptions()).to.deep.equal(expected);
  }

  function getSubscriptionMock(): IMock<Subscription> {
    return new Mock<Subscription>()
      .setup(x => x.unsubscribe())
      .callback(() => {});
  }
});
