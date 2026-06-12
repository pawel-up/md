import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiSnackbar } from '../../../../src/components/snackbar/ui-snackbar.js'
import sinon from 'sinon'

import '../../../../src/components/snackbar/ui-snackbar.js'

test.group('Snackbar', () => {
  async function basicFixture(): Promise<UiSnackbar> {
    return fixture(html`<ui-snackbar>Test Message</ui-snackbar>`) as Promise<UiSnackbar>
  }

  test('has default property values', async ({ assert }) => {
    const el = await basicFixture()
    assert.isFalse(el.persistent)
    assert.isTrue(el.cancellable)
    assert.equal(el.timeout, 5000)
    assert.isUndefined(el.open)
  }).tags(['@md', '@snackbar'])

  test('automatically closes after timeout when opened', async ({ assert }) => {
    const el = await basicFixture()
    el.timeout = 20
    el.open = true
    await nextFrame()

    // Wait 40ms for the timeout to trigger and close the snackbar
    await new Promise((resolve) => setTimeout(resolve, 40))
    await nextFrame()

    assert.isFalse(el.open)
  }).tags(['@md', '@snackbar'])

  test('does not close after timeout if persistent', async ({ assert }) => {
    const el = await basicFixture()
    el.persistent = true
    el.timeout = 20
    el.open = true
    await nextFrame()

    await new Promise((resolve) => setTimeout(resolve, 40))
    await nextFrame()

    assert.isTrue(el.open)
  }).tags(['@md', '@snackbar'])

  test('dispatches open and dismiss events on transitionend', async ({ assert }) => {
    const el = await basicFixture()
    const openSpy = sinon.spy()
    const dismissSpy = sinon.spy()
    el.addEventListener('open', openSpy)
    el.addEventListener('dismiss', dismissSpy)

    // Simulate transitionend for open
    el.dispatchEvent(new TransitionEvent('transitionend'))
    assert.isTrue(openSpy.calledOnce)

    // Programmatically dismiss
    el.dismiss()
    assert.isFalse(el.open)

    // Simulate transitionend for dismiss
    el.dispatchEvent(new TransitionEvent('transitionend'))
    assert.isTrue(dismissSpy.calledOnce)
  }).tags(['@md', '@snackbar'])

  test('renders action button and dispatches action event on click', async ({ assert }) => {
    const el = (await fixture(html`<ui-snackbar action="Retry">Message</ui-snackbar>`)) as UiSnackbar
    const actionSpy = sinon.spy()
    el.addEventListener('action', actionSpy)

    const btn = el.shadowRoot?.querySelector('ui-button.action') as HTMLElement
    assert.isNotNull(btn)
    assert.equal(btn.textContent?.trim(), 'Retry')

    btn.click()
    await nextFrame()

    assert.isTrue(actionSpy.calledOnce)
    assert.isFalse(el.open)
  }).tags(['@md', '@snackbar'])

  test('renders close button and closes on click', async ({ assert }) => {
    const el = (await fixture(html`<ui-snackbar close>Message</ui-snackbar>`)) as UiSnackbar
    el.open = true
    await nextFrame()

    const closeBtn = el.shadowRoot?.querySelector('ui-icon-button.icon') as HTMLElement
    assert.isNotNull(closeBtn)

    closeBtn.click()
    await nextFrame()

    assert.isFalse(el.open)
  }).tags(['@md', '@snackbar'])

  test('handles swipe touch gestures for dismiss if cancellable', async ({ assert }) => {
    const el = await basicFixture()
    el.open = true
    await nextFrame()

    interface SnackbarWithTouchHandlers {
      touchstartHandler(e: TouchEvent): void
      touchendHandler(e: TouchEvent): void
    }
    const elWithTouch = el as unknown as SnackbarWithTouchHandlers

    // Simulate touchstart
    elWithTouch.touchstartHandler({
      changedTouches: [{ screenX: 100, screenY: 100 } as Touch],
    } as unknown as TouchEvent)

    // Simulate swipe (touchend)
    elWithTouch.touchendHandler({
      changedTouches: [{ screenX: 150, screenY: 100 } as Touch],
    } as unknown as TouchEvent)
    await nextFrame()

    assert.isFalse(el.open)
  }).tags(['@md', '@snackbar'])

  test('does not handle swipe touch gestures if not cancellable', async ({ assert }) => {
    const el = await basicFixture()
    el.cancellable = false
    el.open = true
    await nextFrame()

    interface SnackbarWithTouchHandlers {
      touchstartHandler(e: TouchEvent): void
      touchendHandler(e: TouchEvent): void
    }
    const elWithTouch = el as unknown as SnackbarWithTouchHandlers

    // Simulate touchstart
    elWithTouch.touchstartHandler({
      changedTouches: [{ screenX: 100, screenY: 100 } as Touch],
    } as unknown as TouchEvent)

    // Simulate swipe (touchend)
    elWithTouch.touchendHandler({
      changedTouches: [{ screenX: 150, screenY: 100 } as Touch],
    } as unknown as TouchEvent)
    await nextFrame()

    assert.isTrue(el.open)
  }).tags(['@md', '@snackbar'])
})
