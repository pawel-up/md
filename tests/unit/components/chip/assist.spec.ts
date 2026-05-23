import { fixture, html, test } from '@pawel-up/lupa/testing'
import { normalizeColor } from '@api-client/core/lib/color/ColorConverter.js'
import { query } from '@pawel-up/lupa/commands'
import sinon from 'sinon'
import { UiChipElement } from '../../../../src/components/chip/ui-chip.js'

import '../../../../src/components/chip/ui-chip.js'
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
        <ui-icon slot="icon" icon="add"></ui-icon>
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
    await query({ css: 'ui-chip' }).press('Space')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('dispatches the click event on space enter', async ({ assert }) => {
    const element = await basicFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await query({ css: 'ui-chip' }).press('Enter')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('does not dispatch the click event on disabled chip', async ({ assert }) => {
    const element = await disabledFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await query({ css: 'ui-chip' }).press('Space')
    await query({ css: 'ui-chip' }).press('Enter')
    assert.isFalse(spy.called)
  }).tags(['@md', '@chip', '@assist-chip'])

  test('does not dispatch the select event', async ({ assert }) => {
    const element = await disabledFixture()
    const spy = sinon.spy()
    element.addEventListener('event', spy)
    await query({ css: 'ui-chip' }).press('Space')
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
})
