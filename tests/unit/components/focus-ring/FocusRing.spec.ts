import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiFocusRingElement } from '../../../../src/components/focus-ring/ui-focus-ring.js'
import sinon from 'sinon'

import '../../../../src/components/focus-ring/ui-focus-ring.js'

test.group('FocusRing', () => {
  async function basicFixture(): Promise<UiFocusRingElement> {
    return fixture(html`<ui-focus-ring></ui-focus-ring>`) as Promise<UiFocusRingElement>
  }

  test('has default property values', async ({ assert }) => {
    const el = await basicFixture()
    assert.isFalse(el.inward)
    assert.isFalse(el.visible)
  }).tags(['@md', '@focus-ring'])

  test('can be shown and hidden programmatically', async ({ assert }) => {
    const el = await basicFixture()
    const visibilitySpy = sinon.spy()
    el.addEventListener('visibility-changed', visibilitySpy)

    el.show()
    await nextFrame()
    assert.isTrue(el.visible)
    assert.isTrue(visibilitySpy.calledOnce)
    assert.isTrue(visibilitySpy.firstCall.args[0].detail.visible)

    el.hide()
    await nextFrame()
    assert.isFalse(el.visible)
    assert.isTrue(visibilitySpy.calledTwice)
    assert.isFalse(visibilitySpy.secondCall.args[0].detail.visible)
  }).tags(['@md', '@focus-ring'])

  test('binds to parentElement by default', async ({ assert }) => {
    const container = (await fixture(html`
      <div style="position: relative;">
        <ui-focus-ring></ui-focus-ring>
      </div>
    `)) as HTMLElement

    const ring = container.querySelector('ui-focus-ring') as UiFocusRingElement
    // Let's stub matches on container to return true for :focus-visible
    const originalMatches = container.matches
    Object.defineProperty(container, 'matches', {
      value: (selector: string) => {
        if (selector === ':focus-visible') return true
        return originalMatches.call(container, selector)
      },
      configurable: true,
    })

    // Dispatch focus to container parent
    container.dispatchEvent(new FocusEvent('focus'))
    await nextFrame()
    assert.isTrue(ring.visible)
  }).tags(['@md', '@focus-ring'])

  test('binds to element specified by "for" attribute', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <button id="btn">Btn</button>
        <ui-focus-ring for="btn"></ui-focus-ring>
      </div>
    `)) as HTMLElement

    const ring = container.querySelector('ui-focus-ring') as UiFocusRingElement
    const btn = container.querySelector('#btn') as HTMLButtonElement

    // Stub matches on btn
    const originalMatches = btn.matches
    Object.defineProperty(btn, 'matches', {
      value: (selector: string) => {
        if (selector === ':focus-visible') return true
        return originalMatches.call(btn, selector)
      },
      configurable: true,
    })

    // Focus on button should trigger focus ring
    btn.dispatchEvent(new FocusEvent('focus'))
    await nextFrame()
    assert.isTrue(ring.visible)

    // Blur should hide it
    btn.dispatchEvent(new FocusEvent('blur'))
    await nextFrame()
    assert.isFalse(ring.visible)
  }).tags(['@md', '@focus-ring'])

  test('binds to programmatically set control element', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <button id="btn1">Btn1</button>
        <button id="btn2">Btn2</button>
        <ui-focus-ring></ui-focus-ring>
      </div>
    `)) as HTMLElement

    const ring = container.querySelector('ui-focus-ring') as UiFocusRingElement
    const btn1 = container.querySelector('#btn1') as HTMLButtonElement
    const btn2 = container.querySelector('#btn2') as HTMLButtonElement

    // Stub matches
    Object.defineProperty(btn1, 'matches', {
      value: (selector: string) => selector === ':focus-visible',
      configurable: true,
    })
    Object.defineProperty(btn2, 'matches', {
      value: (selector: string) => selector === ':focus-visible',
      configurable: true,
    })

    // Set control to btn1
    ring.control = btn1
    await nextFrame()

    // Trigger focus on btn1
    btn1.dispatchEvent(new FocusEvent('focus'))
    await nextFrame()
    assert.isTrue(ring.visible)

    // Switch control to btn2
    ring.control = btn2
    await nextFrame()

    // Focus ring should now follow btn2
    // First, focus on btn2
    btn2.dispatchEvent(new FocusEvent('focus'))
    await nextFrame()
    assert.isTrue(ring.visible)

    // Trigger blur on btn1, focus ring should NOT hide because it is bound to btn2
    btn1.dispatchEvent(new FocusEvent('blur'))
    await nextFrame()
    assert.isTrue(ring.visible)

    // Trigger blur on btn2, focus ring should hide
    btn2.dispatchEvent(new FocusEvent('blur'))
    await nextFrame()
    assert.isFalse(ring.visible)
  }).tags(['@md', '@focus-ring'])

  test('hides focus ring on pointerdown', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <button id="btn">Btn</button>
        <ui-focus-ring for="btn"></ui-focus-ring>
      </div>
    `)) as HTMLElement

    const ring = container.querySelector('ui-focus-ring') as UiFocusRingElement
    const btn = container.querySelector('#btn') as HTMLButtonElement

    Object.defineProperty(btn, 'matches', {
      value: (selector: string) => selector === ':focus-visible',
      configurable: true,
    })

    // Focus button
    btn.dispatchEvent(new FocusEvent('focus'))
    await nextFrame()
    assert.isTrue(ring.visible)

    // Pointer down on button should hide focus ring (simulates clicking focus instead of keyboard focus)
    btn.dispatchEvent(new PointerEvent('pointerdown'))
    await nextFrame()
    assert.isFalse(ring.visible)
  }).tags(['@md', '@focus-ring'])

  test('cleans up event listeners on disconnect', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <button id="btn">Btn</button>
        <ui-focus-ring for="btn"></ui-focus-ring>
      </div>
    `)) as HTMLElement

    const ring = container.querySelector('ui-focus-ring') as UiFocusRingElement
    const btn = container.querySelector('#btn') as HTMLButtonElement
    Object.defineProperty(btn, 'matches', {
      value: (selector: string) => selector === ':focus-visible',
      configurable: true,
    })

    // Disconnect focus ring
    ring.remove()
    await nextFrame()

    // Focus button, should not trigger visible since disconnected
    btn.dispatchEvent(new FocusEvent('focus'))
    await nextFrame()
    assert.isFalse(ring.visible)
  }).tags(['@md', '@focus-ring'])
})
