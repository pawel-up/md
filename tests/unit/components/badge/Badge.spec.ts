import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiBadgeElement } from '../../../../src/components/badge/ui-badge.js'

import '../../../../src/components/badge/ui-badge.js'

test.group('Badge', () => {
  async function basicFixture(): Promise<UiBadgeElement> {
    return fixture(html`<ui-badge></ui-badge>`) as Promise<UiBadgeElement>
  }

  test('has default property values and renders as a small dot', async ({ assert }) => {
    const badge = await basicFixture()
    assert.isFalse(badge.dot)
    assert.isFalse(badge.attached)
    assert.isTrue(badge.isDot)

    const dotElement = badge.shadowRoot?.querySelector('.badge.small')
    assert.isNotNull(dotElement)
  }).tags(['@md', '@badge'])

  test('is accessible in default dot badge state', async ({ assert }) => {
    const badge = await basicFixture()
    await assert.isAccessible(badge)
  }).tags(['@md', '@badge', '@a11y'])

  test('is accessible in numeric large badge state', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge>5</ui-badge>`)) as UiBadgeElement
    await assert.isAccessible(badge)
  }).tags(['@md', '@badge', '@a11y'])

  test('preserves user-authored accessibility attributes without mutation', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge aria-label="Unread updates"></ui-badge>`)) as UiBadgeElement
    assert.equal(badge.getAttribute('aria-label'), 'Unread updates')

    const hiddenBadge = (await fixture(html`<ui-badge aria-hidden="true">3</ui-badge>`)) as UiBadgeElement
    assert.equal(hiddenBadge.getAttribute('aria-hidden'), 'true')
  }).tags(['@md', '@badge', '@a11y'])

  test('renders large badge for slotted values', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge>3</ui-badge>`)) as UiBadgeElement
    assert.isFalse(badge.isDot)

    const badgeEl = badge.shadowRoot?.querySelector('.badge.large')
    assert.isNotNull(badgeEl)
  }).tags(['@md', '@badge'])

  test('preserves author-provided content as-is without altering or truncating', async ({ assert }) => {
    const badge1 = (await fixture(html`<ui-badge>99+</ui-badge>`)) as UiBadgeElement
    assert.isFalse(badge1.isDot)
    assert.equal(badge1.textContent?.trim(), '99+')

    const badge2 = (await fixture(html`<ui-badge>1500</ui-badge>`)) as UiBadgeElement
    assert.isFalse(badge2.isDot)
    assert.equal(badge2.textContent?.trim(), '1500')

    const badge3 = (await fixture(html`<ui-badge>NEW</ui-badge>`)) as UiBadgeElement
    assert.isFalse(badge3.isDot)
    assert.equal(badge3.textContent?.trim(), 'NEW')
  }).tags(['@md', '@badge'])

  test('forces small dot variant when dot attribute is set', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge dot>5</ui-badge>`)) as UiBadgeElement
    assert.isTrue(badge.dot)
    assert.isTrue(badge.isDot)

    const dotEl = badge.shadowRoot?.querySelector('.badge.small')
    assert.isNotNull(dotEl)
  }).tags(['@md', '@badge'])

  test('dynamically updates when dot property changes', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge>15</ui-badge>`)) as UiBadgeElement
    assert.isFalse(badge.isDot)

    badge.dot = true
    await badge.updateComplete
    assert.isTrue(badge.isDot)

    badge.dot = false
    await badge.updateComplete
    assert.isFalse(badge.isDot)
  }).tags(['@md', '@badge'])

  test('supports attached attribute', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge attached>1</ui-badge>`)) as UiBadgeElement
    assert.isTrue(badge.attached)
    assert.isTrue(badge.hasAttribute('attached'))
  }).tags(['@md', '@badge'])

  test('supports attached attribute with RTL direction', async ({ assert }) => {
    const badge = (await fixture(html`<ui-badge attached dir="rtl">1</ui-badge>`)) as UiBadgeElement
    assert.isTrue(badge.attached)
    assert.equal(badge.getAttribute('dir'), 'rtl')
  }).tags(['@md', '@badge'])
})
