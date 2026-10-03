import { test, fixture, html } from '@pawel-up/lupa/testing'
import { LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
  OverlayController,
  type OverlayHost,
  type BeforeCloseCallback,
} from '../../../src/controllers/OverlayController.js'
import { OverlayStackManager, type OverlayDismissReason } from '../../../src/controllers/OverlayStackManager.js'

@customElement('test-overlay-element')
class TestOverlayElement extends LitElement implements OverlayHost {
  @property({ type: Boolean, reflect: true }) accessor open = false

  @property({ type: Boolean }) accessor closeOnEscape = true

  @property({ type: Boolean }) accessor closeOnOutsideClick = true

  @property({ attribute: false }) accessor beforeClose: BeforeCloseCallback | undefined

  overlayController: OverlayController

  constructor() {
    super()
    this.overlayController = new OverlayController(this)
  }

  override render() {
    return html`<div class="content" style="padding: 20px; background: red;"><slot></slot></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'test-overlay-element': TestOverlayElement
  }
}

test.group('OverlayController & OverlayStackManager', (group) => {
  const manager = OverlayStackManager.getInstance()

  group.each.teardown(() => {
    manager.reset()
  })

  test('registers and unregisters on stack based on open property', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element></test-overlay-element>`)
    assert.equal(manager.size, 0)
    assert.equal(el.overlayController.stackIndex, -1)
    assert.isFalse(el.overlayController.isTop)

    el.open = true
    await el.updateComplete

    assert.equal(manager.size, 1)
    assert.equal(el.overlayController.stackIndex, 0)
    assert.isTrue(el.overlayController.isTop)

    el.open = false
    await el.updateComplete

    assert.equal(manager.size, 0)
    assert.equal(el.overlayController.stackIndex, -1)
  })

  test('registers automatically when element is created with open=true', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    assert.equal(manager.size, 1)
    assert.isTrue(el.overlayController.isTop)
  })

  test('unregisters from stack when disconnected from DOM', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete
    assert.equal(manager.size, 1)

    el.remove()
    assert.equal(manager.size, 0)
  })

  test('maintains LIFO order with multiple overlays', async ({ assert }) => {
    const el1 = await fixture<TestOverlayElement>(html`<test-overlay-element id="first"></test-overlay-element>`)
    const el2 = await fixture<TestOverlayElement>(html`<test-overlay-element id="second"></test-overlay-element>`)

    el1.open = true
    await el1.updateComplete
    assert.equal(el1.overlayController.stackIndex, 0)
    assert.isTrue(el1.overlayController.isTop)

    el2.open = true
    await el2.updateComplete
    assert.equal(manager.size, 2)
    assert.equal(el1.overlayController.stackIndex, 0)
    assert.equal(el2.overlayController.stackIndex, 1)
    assert.isFalse(el1.overlayController.isTop)
    assert.isTrue(el2.overlayController.isTop)
  })

  test('dynamically skips closed overlays when determining manager.top', async ({ assert }) => {
    const el1 = await fixture<TestOverlayElement>(html`<test-overlay-element id="first"></test-overlay-element>`)
    const el2 = await fixture<TestOverlayElement>(html`<test-overlay-element id="second"></test-overlay-element>`)

    el1.open = true
    el2.open = true
    await el1.updateComplete
    await el2.updateComplete

    assert.equal(manager.top?.id, el2.overlayController.id)

    // Directly set el2.open = false before Lit updateComplete unregisters it
    el2.open = false
    assert.equal(manager.top?.id, el1.overlayController.id, 'manager.top should immediately fall back to el1')
  })

  test('dismisses only topmost overlay on Escape key', async ({ assert }) => {
    const el1 = await fixture<TestOverlayElement>(html`<test-overlay-element id="first"></test-overlay-element>`)
    const el2 = await fixture<TestOverlayElement>(html`<test-overlay-element id="second"></test-overlay-element>`)

    el1.open = true
    el2.open = true
    await el1.updateComplete
    await el2.updateComplete

    let el1Closed = false
    let el2Closed = false
    el1.addEventListener('close', () => {
      el1Closed = true
    })
    el2.addEventListener('close', () => {
      el2Closed = true
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el2.updateComplete
    await el1.updateComplete

    assert.isTrue(el2Closed, 'topmost overlay el2 should be closed')
    assert.isFalse(el2.open, 'el2.open should be false')
    assert.isFalse(el1Closed, 'underlying overlay el1 should not close yet')
    assert.isTrue(el1.open, 'el1.open should remain true')
    assert.isTrue(el1.overlayController.isTop, 'el1 should now be top of stack')

    // Press Escape a second time
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el1.updateComplete

    assert.isTrue(el1Closed, 'underlying overlay el1 should now be closed')
    assert.isFalse(el1.open, 'el1.open should be false')
    assert.equal(manager.size, 0)
  })

  test('respects closeOnEscape=false on top overlay', async ({ assert }) => {
    const el1 = await fixture<TestOverlayElement>(html`<test-overlay-element></test-overlay-element>`)
    const el2 = await fixture<TestOverlayElement>(html`<test-overlay-element></test-overlay-element>`)

    el1.open = true
    el2.open = true
    el2.closeOnEscape = false
    await el1.updateComplete
    await el2.updateComplete

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el2.updateComplete
    await el1.updateComplete

    assert.isTrue(el2.open, 'el2 should remain open because closeOnEscape is false')
    assert.isTrue(el1.open, 'el1 should remain open because el2 blocked dismissal')
  })

  test('dismisses top overlay when Escape key originates from an element inside the overlay', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    const innerDiv = el.shadowRoot?.querySelector<HTMLElement>('.content')
    innerDiv?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true })
    )
    await el.updateComplete

    assert.isFalse(el.open, 'top overlay should close when Escape is pressed from an inner focused element')
    assert.equal(manager.size, 0)
  })

  test('dismisses top overlay on outside pointerdown', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    let dismissReason: OverlayDismissReason | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: OverlayDismissReason }>
      dismissReason = customEvent.detail.reason
    })

    // Pointer event inside overlay should not dismiss
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete
    assert.isTrue(el.open, 'should remain open on inside click')

    // Pointer event on document.body (outside)
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isFalse(el.open, 'should close on outside click')
    assert.equal(dismissReason, 'outside-click')
  })

  test('respects closeOnOutsideClick=false', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`
      <test-overlay-element open .closeOnOutsideClick=${false}></test-overlay-element>
    `)
    await el.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isTrue(el.open, 'should remain open when closeOnOutsideClick is false')
  })

  test('allows preventing dismissal via cancelable closing event', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    let closingEventFired = false
    el.addEventListener('closing', (e: Event) => {
      closingEventFired = true
      e.preventDefault()
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.isTrue(closingEventFired)
    assert.isTrue(el.open, 'overlay should remain open because closing event was prevented')
    assert.equal(manager.size, 1)
  })

  test('allows preventing dismissal via synchronous beforeClose callback', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    let receivedReason: OverlayDismissReason | undefined
    el.beforeClose = (reason) => {
      receivedReason = reason
      return false
    }

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.equal(receivedReason, 'escape')
    assert.isTrue(el.open, 'overlay should remain open because beforeClose returned false')
    assert.equal(manager.size, 1)
  })

  test('allows preventing dismissal via asynchronous beforeClose callback', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    el.beforeClose = async () => {
      await Promise.resolve()
      return false
    }

    const closed = await el.overlayController.requestClose('programmatic')
    assert.isFalse(closed)
    assert.isTrue(el.open)
    assert.equal(manager.size, 1)
  })

  test('resets isClosing state when asynchronous beforeClose rejects', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    el.beforeClose = async () => {
      throw new Error('Async error during beforeClose')
    }

    let errorThrown = false
    try {
      await el.overlayController.requestClose('programmatic')
    } catch {
      errorThrown = true
    }
    assert.isTrue(errorThrown, 'rejection was propagated')
    assert.isTrue(el.open, 'element remains open')

    // Subsequent close succeeds because isClosing was reset in finally
    el.beforeClose = undefined
    const closed = await el.overlayController.requestClose('programmatic')
    assert.isTrue(closed, 'subsequent close succeeds')
    assert.isFalse(el.open)
    assert.equal(manager.size, 0)
  })

  test('resets isClosing state when synchronous beforeClose throws', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    el.beforeClose = () => {
      throw new Error('Sync error during beforeClose')
    }

    let errorThrown = false
    try {
      el.overlayController.requestClose('programmatic')
    } catch {
      errorThrown = true
    }
    assert.isTrue(errorThrown, 'error was propagated')
    assert.isTrue(el.open, 'element remains open')

    // Subsequent close succeeds because isClosing was reset in catch
    el.beforeClose = undefined
    const closed = await el.overlayController.requestClose('programmatic')
    assert.isTrue(closed, 'subsequent close succeeds')
    assert.isFalse(el.open)
    assert.equal(manager.size, 0)
  })

  test('closes when beforeClose resolves to true', async ({ assert }) => {
    const el = await fixture<TestOverlayElement>(html`<test-overlay-element open></test-overlay-element>`)
    await el.updateComplete

    el.beforeClose = async (reason) => reason === 'escape'

    const closed = await el.overlayController.requestClose('escape')
    assert.isTrue(closed)
    assert.isFalse(el.open)
    assert.equal(manager.size, 0)
  })
})
