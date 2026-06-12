import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiRippleElement } from '../../../../src/components/ripple/ui-ripple.js'

import '../../../../src/components/ripple/ui-ripple.js'

test.group('Ripple', () => {
  async function basicFixture(): Promise<UiRippleElement> {
    return fixture(html`<ui-ripple></ui-ripple>`)
  }

  test('has default property values', async ({ assert }) => {
    const ripple = await basicFixture()
    assert.isFalse(ripple.unbounded)
    assert.isFalse(ripple.disabled)
  }).tags(['@md', '@ripple'])

  test('sets states on hover methods', async ({ assert }) => {
    const ripple = await basicFixture()
    const surface = ripple.shadowRoot!.querySelector('.surface')!

    ripple.beginHover()
    await nextFrame()
    assert.isTrue(surface.classList.contains('hovered'))

    ripple.endHover()
    await nextFrame()
    assert.isFalse(surface.classList.contains('hovered'))
  }).tags(['@md', '@ripple'])

  test('sets states on focus methods', async ({ assert }) => {
    const ripple = await basicFixture()
    const surface = ripple.shadowRoot!.querySelector('.surface')!

    ripple.beginFocus()
    await nextFrame()
    assert.isTrue(surface.classList.contains('focused'))

    ripple.endFocus()
    await nextFrame()
    assert.isFalse(surface.classList.contains('focused'))
  }).tags(['@md', '@ripple'])

  test('does not activate states when disabled', async ({ assert }) => {
    const ripple = await basicFixture()
    const surface = ripple.shadowRoot!.querySelector('.surface')!

    ripple.disabled = true
    ripple.beginHover()
    ripple.beginFocus()
    ripple.beginPress()
    await nextFrame()

    assert.isFalse(surface.classList.contains('hovered'))
    assert.isFalse(surface.classList.contains('focused'))
    assert.isFalse(surface.classList.contains('pressed'))
  }).tags(['@md', '@ripple'])
})
