import { fixture, html, test } from '@pawel-up/lupa/testing'
import { events } from '@pawel-up/lupa/commands'
import { normalizeColor } from '../../../../src/lib/color.js'
import sinon from 'sinon'
import { UiChipElement } from '../../../../src/components/chip/ui-chip.js'

import '../../../../src/components/chip/ui-chip.js'
import '../../../../src/components/chip/ui-chip-set.js'
import '../../../../src/components/icons/ui-icon.js'

test.group('Assist chip', () => {
  async function basicFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="assist">Enabled</ui-chip>`)
  }

  async function disabledFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="assist" disabled>Disabled</ui-chip>`)
  }

  async function iconFixture(): Promise<UiChipElement> {
    return fixture(
      html`<ui-chip type="assist">
        <ui-icon slot="icon">add</ui-icon>
        With icon
      </ui-chip>`
    )
  }

  async function elevatedFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="assist" elevated>Elevated</ui-chip>`)
  }

  async function disabledElevatedFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="assist" elevated disabled>Elevated</ui-chip>`)
  }

  test('renders border around a regular assist chip', async ({ assert }) => {
    const element = await basicFixture()
    const styles = getComputedStyle(element)
    const m3Color = styles.getPropertyValue('--md-sys-color-outline-variant')
    const borderColor = normalizeColor(styles.borderColor)
    const compareColor = normalizeColor(m3Color)
    assert.equal(borderColor, compareColor, 'has the m3 color')
    assert.equal(styles.borderWidth, '1px', 'has the width')
  }).tags(['@md', '@chip', '@assist-chip'])

  test('dispatches the click event on space press', async ({ assert }) => {
    const element = await basicFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await events(element).keyboard.press('Space')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('dispatches the click event on space enter', async ({ assert }) => {
    const element = await basicFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await events(element).keyboard.press('Enter')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('does not dispatch the click event on disabled chip', async ({ assert }) => {
    const element = await disabledFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await events(element).keyboard.press('Space')
    await events(element).keyboard.press('Enter')
    assert.isFalse(spy.called)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('does not dispatch the select event', async ({ assert }) => {
    const element = await disabledFixture()
    const spy = sinon.spy()
    element.addEventListener('event', spy)
    await events(element).keyboard.press('Space')
    assert.isFalse(spy.called)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('renders suffix icon', async ({ assert }) => {
    const element = await iconFixture()
    const surface = element.shadowRoot!.querySelector<HTMLDivElement>('.surface')!
    assert.isTrue(surface.classList.contains('has-icon'), 'the surface has the has-icon class')
    const contentStyles = getComputedStyle(surface)
    assert.equal(contentStyles.paddingLeft.trim(), '8px', 'the container has the padding')
    const icon = element.querySelector('ui-icon')!
    const iconStyles = getComputedStyle(icon)
    assert.equal(iconStyles.marginRight.trim(), '8px', 'the icon has the margin')
  }).tags(['@md', '@chip', '@assist-chip'])

  test('has elevated styles', async ({ assert }) => {
    const element = await elevatedFixture()
    const surface = element.shadowRoot!.querySelector<HTMLDivElement>('.surface')!
    const containerStyles = getComputedStyle(surface)
    assert.equal(containerStyles.borderWidth, '0px', 'has no border')
    assert.isNotEmpty(containerStyles.boxShadow, 'has a box shadow')
  }).tags(['@md', '@chip', '@assist-chip'])

  test('has no elevated styles when disabled', async ({ assert }) => {
    const element = await disabledElevatedFixture()
    const surface = element.shadowRoot!.querySelector<HTMLDivElement>('.surface')!
    const containerStyles = getComputedStyle(surface)
    assert.equal(containerStyles.boxShadow, 'none', 'has no box shadow')
  }).tags(['@md', '@chip', '@assist-chip'])

  test('is accessible when enabled, disabled, elevated, and with icon', async ({ assert }) => {
    const basic = await basicFixture()
    await assert.isAccessible(basic)

    const disabled = await disabledFixture()
    await assert.isAccessible(disabled)

    const icon = await iconFixture()
    await assert.isAccessible(icon)

    const elevated = await elevatedFixture()
    await assert.isAccessible(elevated)
  }).tags(['@md', '@chip', '@assist-chip', '@a11y'])

  test('suggestion chip and chip set are accessible', async ({ assert }) => {
    const chipSet = await fixture(html`
      <ui-chip-set aria-label="Suggestions">
        <ui-chip type="suggestion">Suggestion 1</ui-chip>
        <ui-chip type="assist">Assist 1</ui-chip>
        <ui-chip type="input">Input 1</ui-chip>
      </ui-chip-set>
    `)
    await assert.isAccessible(chipSet)
  }).tags(['@md', '@chip', '@a11y'])
})
