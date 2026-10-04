import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiIconButtonElement } from '../../../../src/components/icon-button/ui-icon-button.js'
import type { MdButtonSize } from '../../../../src/components/button/internals/base.js'

import '../../../../src/components/icon-button/ui-icon-button.js'

test.group('IconButton', () => {
  async function basicFixture(): Promise<UiIconButtonElement> {
    return fixture(html`<ui-icon-button></ui-icon-button>`) as Promise<UiIconButtonElement>
  }

  test('has default property values and sizing', async ({ assert }) => {
    const btn = await basicFixture()
    assert.equal(btn.color, 'standard')
    assert.equal(btn.width, 'default')
    assert.equal(btn.size, 's')
    assert.equal(btn.shape, 'round')
    assert.isFalse(btn.disabled)

    const cs = window.getComputedStyle(btn)
    assert.equal(cs.height, '40px')
    assert.equal(cs.borderTopLeftRadius, '20px')
  }).tags(['@md', '@icon-button'])

  test('respects color and width attributes', async ({ assert }) => {
    const btn = (await fixture(
      html`<ui-icon-button color="filled" width="wide"></ui-icon-button>`
    )) as UiIconButtonElement
    assert.equal(btn.color, 'filled')
    assert.equal(btn.width, 'wide')
  }).tags(['@md', '@icon-button'])

  test('implements elevated color variant', async ({ assert }) => {
    const btn = (await fixture(html`<ui-icon-button color="elevated"></ui-icon-button>`)) as UiIconButtonElement
    assert.equal(btn.color, 'elevated')

    const cs = window.getComputedStyle(btn)
    assert.notEqual(cs.boxShadow, 'none')
  }).tags(['@md', '@icon-button'])

  test('updates aria-disabled and tabindex when disabled', async ({ assert }) => {
    const btn = await basicFixture()
    assert.equal(btn.getAttribute('tabindex'), '0')

    btn.disabled = true
    await nextFrame()
    assert.isFalse(btn.hasAttribute('tabindex'))
    assert.equal(btn.getAttribute('aria-disabled'), 'true')

    const cs = window.getComputedStyle(btn)
    assert.equal(cs.pointerEvents, 'none')
    assert.equal(cs.cursor, 'not-allowed')

    btn.disabled = false
    await nextFrame()
    assert.equal(btn.getAttribute('tabindex'), '0')
    assert.isFalse(btn.hasAttribute('aria-disabled'))
  }).tags(['@md', '@icon-button'])

  test('toggles selection when toggle is enabled', async ({ assert }) => {
    const btn = (await fixture(html`<ui-icon-button toggle></ui-icon-button>`)) as UiIconButtonElement
    assert.isFalse(btn.selected)

    btn.click()
    await nextFrame()
    assert.isTrue(btn.selected)

    btn.click()
    await nextFrame()
    assert.isFalse(btn.selected)
  }).tags(['@md', '@icon-button'])

  test('morphs round toggle button to square when selected', async ({ assert }) => {
    const unselectedBtn = (await fixture(
      html`<ui-icon-button toggle size="s"></ui-icon-button>`
    )) as UiIconButtonElement
    assert.equal(window.getComputedStyle(unselectedBtn).borderTopLeftRadius, '20px')

    const selectedBtn = (await fixture(
      html`<ui-icon-button toggle selected size="s"></ui-icon-button>`
    )) as UiIconButtonElement
    // S square radius is 12px
    assert.equal(window.getComputedStyle(selectedBtn).borderTopLeftRadius, '12px')

    // Also verify dynamically when transition is completed
    unselectedBtn.style.transition = 'none'
    unselectedBtn.selected = true
    await nextFrame()
    assert.equal(window.getComputedStyle(unselectedBtn).borderTopLeftRadius, '12px')
  }).tags(['@md', '@icon-button'])

  test('morphs square toggle button to round when selected', async ({ assert }) => {
    const unselectedBtn = (await fixture(
      html`<ui-icon-button toggle shape="square" size="s"></ui-icon-button>`
    )) as UiIconButtonElement
    assert.equal(window.getComputedStyle(unselectedBtn).borderTopLeftRadius, '12px')

    const selectedBtn = (await fixture(
      html`<ui-icon-button toggle shape="square" selected size="s"></ui-icon-button>`
    )) as UiIconButtonElement
    assert.equal(window.getComputedStyle(selectedBtn).borderTopLeftRadius, '20px')

    unselectedBtn.style.transition = 'none'
    unselectedBtn.selected = true
    await nextFrame()
    assert.equal(window.getComputedStyle(unselectedBtn).borderTopLeftRadius, '20px')
  }).tags(['@md', '@icon-button'])

  test('morphs shapes correctly across all sizes when selected', async ({ assert }) => {
    const sizes: { size: MdButtonSize; round: string; square: string }[] = [
      { size: 'xs', round: '16px', square: '12px' },
      { size: 's', round: '20px', square: '12px' },
      { size: 'm', round: '28px', square: '16px' },
      { size: 'l', round: '48px', square: '28px' },
      { size: 'xl', round: '68px', square: '28px' },
    ]

    for (const { size, round, square } of sizes) {
      // Round toggle button (unselected vs selected)
      const roundBtn = (await fixture(
        html`<ui-icon-button toggle size="${size}"></ui-icon-button>`
      )) as UiIconButtonElement
      assert.equal(window.getComputedStyle(roundBtn).borderTopLeftRadius, round)

      const roundSelectedBtn = (await fixture(
        html`<ui-icon-button toggle selected size="${size}"></ui-icon-button>`
      )) as UiIconButtonElement
      assert.equal(window.getComputedStyle(roundSelectedBtn).borderTopLeftRadius, square)

      // Square toggle button (unselected vs selected)
      const squareBtn = (await fixture(
        html`<ui-icon-button toggle shape="square" size="${size}"></ui-icon-button>`
      )) as UiIconButtonElement
      assert.equal(window.getComputedStyle(squareBtn).borderTopLeftRadius, square)

      const squareSelectedBtn = (await fixture(
        html`<ui-icon-button toggle shape="square" selected size="${size}"></ui-icon-button>`
      )) as UiIconButtonElement
      assert.equal(window.getComputedStyle(squareSelectedBtn).borderTopLeftRadius, round)
    }
  }).tags(['@md', '@icon-button'])

  test('applies correct pressed shapes', async ({ assert }) => {
    const cases: { size: MdButtonSize; expected: string }[] = [
      { size: 'xs', expected: '8px' },
      { size: 's', expected: '8px' },
      { size: 'm', expected: '12px' },
      { size: 'l', expected: '16px' },
      { size: 'xl', expected: '16px' },
    ]

    for (const { size, expected } of cases) {
      const btn = (await fixture(html`<ui-icon-button size="${size}"></ui-icon-button>`)) as UiIconButtonElement
      btn.style.transition = 'none'
      btn.classList.add('pressed')
      await nextFrame()
      assert.equal(window.getComputedStyle(btn).borderTopLeftRadius, expected)
    }
  }).tags(['@md', '@icon-button'])

  test('applies correct outline widths for outlined color', async ({ assert }) => {
    const cases: { size: MdButtonSize; expected: string }[] = [
      { size: 'xs', expected: '1px' },
      { size: 's', expected: '1px' },
      { size: 'm', expected: '1px' },
      { size: 'l', expected: '2px' },
      { size: 'xl', expected: '3px' },
    ]

    for (const { size, expected } of cases) {
      const btn = (await fixture(
        html`<ui-icon-button color="outlined" size="${size}"></ui-icon-button>`
      )) as UiIconButtonElement
      assert.equal(window.getComputedStyle(btn).borderTopWidth, expected)
    }

    // Toggle selected outlined button removes border
    const selectedBtn = (await fixture(
      html`<ui-icon-button color="outlined" toggle selected></ui-icon-button>`
    )) as UiIconButtonElement
    assert.equal(window.getComputedStyle(selectedBtn).borderTopWidth, '0px')
  }).tags(['@md', '@icon-button'])

  test('supports slot="selected" for custom selected icons', async ({ assert }) => {
    const btn = (await fixture(html`
      <ui-icon-button toggle>
        <span class="unselected-icon">unselected</span>
        <span slot="selected" class="selected-icon">selected</span>
      </ui-icon-button>
    `)) as UiIconButtonElement

    const selectedSlot = btn.shadowRoot?.querySelector('slot[name="selected"]') as HTMLSlotElement
    const defaultSlot = btn.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement

    assert.isTrue(selectedSlot.hasAttribute('hidden'))
    assert.isFalse(defaultSlot.hasAttribute('hidden'))

    btn.selected = true
    await nextFrame()

    assert.isFalse(selectedSlot.hasAttribute('hidden'))
    assert.isTrue(defaultSlot.hasAttribute('hidden'))
  }).tags(['@md', '@icon-button'])
})
