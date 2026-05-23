import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { normalizeColor } from '@api-client/core/lib/color/ColorConverter.js'
import { query } from '@pawel-up/lupa/commands'
import sinon from 'sinon'
import type { UiChipElement } from '../../../../src/components/chip/ui-chip.js'

import '../../../../src/components/chip/ui-chip.js'
import '../../../../src/components/icons/ui-icon.js'

test.group('Filter chip', () => {
  async function basicFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="filter">Enabled</ui-chip>`)
  }

  async function disabledFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="filter" disabled>Disabled</ui-chip>`)
  }

  async function removableFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="filter" removable>removable</ui-chip>`)
  }

  async function listFixture(): Promise<UiChipElement> {
    return fixture(html`<ui-chip type="filter" list>List</ui-chip>`)
  }

  test('renders border around the chip', async ({ assert }) => {
    const element = await basicFixture()
    const styles = getComputedStyle(element)
    const m3Color = styles.getPropertyValue('--md-sys-color-outline-variant')
    const borderColor = normalizeColor(styles.borderColor)
    const compareColor = normalizeColor(m3Color)
    assert.equal(borderColor, compareColor, 'has the m3 color')
    assert.equal(styles.borderWidth, '1px', 'has the width')
  }).tags(['@md', '@chip', '@filter-chip'])

  test('dispatches the click event on space press', async ({ assert }) => {
    const element = await basicFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await query({ css: 'ui-chip' }).press('Space')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('dispatches the click event on enter', async ({ assert }) => {
    const element = await basicFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await query({ css: 'ui-chip' }).press('Enter')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('toggles the chip', async ({ assert }) => {
    const element = await basicFixture()
    element.click()
    await nextFrame()
    assert.isTrue(element.checked, 'the element is checked')
    const icon = element.shadowRoot!.querySelector('.leading-icon.check-mark')
    assert.ok(icon, 'renders the check mark icon')
  }).tags(['@md', '@chip', '@filter-chip'])

  test('does not dispatch the click event on disabled chip', async ({ assert }) => {
    const element = await disabledFixture()
    const spy = sinon.spy()
    element.addEventListener('click', spy)
    await query({ css: 'ui-chip' }).press('Space')
    await query({ css: 'ui-chip' }).press('Enter')
    assert.isFalse(spy.called)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('dispatches the select event', async ({ assert }) => {
    const element = await basicFixture()
    const spy = sinon.spy()
    element.addEventListener('select', spy)
    await query({ css: 'ui-chip' }).press('Space')
    assert.isTrue(spy.calledOnce)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('does not dispatch the select event when disabled', async ({ assert }) => {
    const element = await disabledFixture()
    const spy = sinon.spy()
    element.addEventListener('select', spy)
    await query({ css: 'ui-chip' }).press('Space')
    assert.isFalse(spy.called)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('does not render the close icon', async ({ assert }) => {
    const element = await removableFixture()
    const node = element.shadowRoot!.querySelector('.trailing-icon')
    assert.notOk(node)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('renders the list icon', async ({ assert }) => {
    const element = await listFixture()
    const node = element.shadowRoot!.querySelector('.trailing-icon')
    assert.ok(node, 'has the icon')
  }).tags(['@md', '@chip', '@filter-chip'])

  test('is accessible in a regular state', async ({ assert }) => {
    const element = await basicFixture()
    await assert.isAccessible(element)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('is accessible when removable', async ({ assert }) => {
    const element = await removableFixture()
    await assert.isAccessible(element)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('is accessible when has a list', async ({ assert }) => {
    const element = await listFixture()
    await assert.isAccessible(element)
  }).tags(['@md', '@chip', '@filter-chip'])

  test('is accessible when active', async ({ assert }) => {
    const element = await listFixture()
    element.click()
    await nextFrame()
    await assert.isAccessible(element)
  }).tags(['@md', '@chip', '@filter-chip'])
})
