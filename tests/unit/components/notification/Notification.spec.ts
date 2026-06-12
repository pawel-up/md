import { nextFrame, test } from '@pawel-up/lupa/testing'
import { SnackNotifications } from '../../../../src/components/notification/SnackNotifications.js'
import sinon from 'sinon'

test.group('SnackNotifications', (group) => {
  group.each.teardown(() => {
    SnackNotifications.clear()
  })

  test('notifies and appends a snackbar to body', async ({ assert }) => {
    const snack = SnackNotifications.notify('Hello notification')
    assert.isNotNull(snack)
    assert.equal(snack.textContent?.trim(), 'Hello notification')
    assert.equal(snack.parentElement, document.body)

    // Wait for the scheduled open
    await nextFrame()
    assert.isTrue(snack.open)
  }).tags(['@md', '@notification'])

  test('queues multiple notifications and processes sequentially', async ({ assert }) => {
    const snack1 = SnackNotifications.notify('First')
    const snack2 = SnackNotifications.notify('Second')

    await nextFrame()
    assert.isTrue(snack1.open)
    assert.isUndefined(snack2.open)

    // Dismiss first snackbar
    snack1.dispatchEvent(new Event('dismiss'))
    await nextFrame()

    // Now second snackbar should be open
    assert.isTrue(snack2.open)
  }).tags(['@md', '@notification'])

  test('applies config options (persistent, cancellable, timeout, close)', async ({ assert }) => {
    const snack = SnackNotifications.notify('Configured', {
      persistent: true,
      cancellable: false,
      timeout: 3000,
      close: true,
    })

    assert.isTrue(snack.persistent)
    assert.isFalse(snack.cancellable)
    assert.equal(snack.timeout, 3000)
    assert.isTrue(snack.close)
  }).tags(['@md', '@notification'])

  test('invokes action callback on action trigger', async ({ assert }) => {
    const callbackSpy = sinon.spy()
    const snack = SnackNotifications.notify('Action Text', {
      actionLabel: 'Click Me',
      actionCallback: callbackSpy,
    })

    await nextFrame()
    assert.equal(snack.action, 'Click Me')

    // Simulate action trigger on the snackbar element
    snack.dispatchEvent(new Event('action'))
    await nextFrame()

    assert.isTrue(callbackSpy.calledOnce)
  }).tags(['@md', '@notification'])

  test('invokes closed callback on open transitions (which notifies closure)', async ({ assert }) => {
    const closedSpy = sinon.spy()
    const snack = SnackNotifications.notify('Callback Text', {
      closed: closedSpy,
    })

    await nextFrame()
    assert.isTrue(snack.open)

    // A closed snackbar will transition and dispatch open while target.open is false/falsy
    snack.open = false
    snack.dispatchEvent(new Event('open'))
    await nextFrame()

    assert.isTrue(closedSpy.calledOnce)
  }).tags(['@md', '@notification'])

  test('cancels active notification', async ({ assert }) => {
    const snack = SnackNotifications.notify('To Cancel')
    await nextFrame()
    assert.isTrue(snack.open)

    SnackNotifications.cancel(snack)
    await nextFrame()

    assert.isFalse(snack.open)
  }).tags(['@md', '@notification'])

  test('cancels queued notification', async ({ assert }) => {
    const snack1 = SnackNotifications.notify('Active')
    const snack2 = SnackNotifications.notify('Queued')
    await nextFrame()

    SnackNotifications.cancel(snack2)
    snack1.dispatchEvent(new Event('dismiss'))
    await nextFrame()

    // Since snack2 was cancelled, it shouldn't open and shouldn't remain in DOM
    assert.isUndefined(snack2.open)
    assert.isNull(snack2.parentElement)
  }).tags(['@md', '@notification'])
})
