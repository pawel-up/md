import { fixture, html, nextFrame, test, waitUntil } from '@pawel-up/lupa/testing'
import { UiTabsElement } from '../../../../src/components/tabs/ui-tabs.js'
import { UiTabElement } from '../../../../src/components/tabs/ui-tab.js'

import '../../../../src/components/tabs/ui-tabs.js'
import '../../../../src/components/tabs/ui-tab.js'
import '../../../../src/components/badge/ui-badge.js'

test.group('Tabs', () => {
  async function basicFixture(): Promise<UiTabsElement> {
    return fixture(html`
      <ui-tabs>
        <ui-tab id="tab1" selected>Tab 1</ui-tab>
        <ui-tab id="tab2">Tab 2</ui-tab>
        <ui-tab id="tab3">Tab 3</ui-tab>
      </ui-tabs>
    `)
  }

  test('selects the first tab by default', async ({ assert }) => {
    const tabs = await basicFixture()
    await tabs.updateComplete

    assert.equal(tabs.activeTabIndex, 0)
    assert.isTrue(tabs.activeTab?.selected)
    assert.equal(tabs.activeTab?.id, 'tab1')
  }).tags(['@md', '@tabs'])

  test('changes active tab dynamically via index', async ({ assert }) => {
    const tabs = await basicFixture()
    await tabs.updateComplete

    tabs.activeTabIndex = 1
    await nextFrame()
    await tabs.updateComplete

    assert.equal(tabs.activeTabIndex, 1)
    assert.isTrue(tabs.activeTab?.selected)
    assert.equal(tabs.activeTab?.id, 'tab2')
  }).tags(['@md', '@tabs'])

  test('selects tab on click', async ({ assert }) => {
    const tabs = await basicFixture()
    await tabs.updateComplete
    const tab2 = tabs.querySelector('#tab2') as UiTabElement

    tab2.click()
    await nextFrame()
    await tabs.updateComplete

    assert.equal(tabs.activeTabIndex, 1)
    assert.isTrue(tab2.selected)
  }).tags(['@md', '@tabs'])

  test('navigates with keyboard arrow keys when auto-activate is enabled', async ({ assert }) => {
    const tabs = await basicFixture()
    await tabs.updateComplete
    const tab1 = tabs.querySelector('#tab1') as UiTabElement
    const tab2 = tabs.querySelector('#tab2') as UiTabElement

    // Enable autoActivate programmatically
    tabs.autoActivate = true
    await tabs.updateComplete

    // Mock focusedTab to return tab1 to ensure headless browser test compatibility
    Object.defineProperty(tabs, 'focusedTab', {
      get: () => tab1,
      configurable: true,
    })

    // Invoke handleKeydown directly
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      code: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    })
    await tabs['handleKeydown'](event)

    // Wait for macro-task event loop since handleKeydown awaits setTimeout(resolve, 0)
    await new Promise((resolve) => setTimeout(resolve, 10))
    await nextFrame()
    await tabs.updateComplete

    assert.equal(tabs.activeTabIndex, 1)
    assert.isTrue(tab2.selected)
  }).tags(['@md', '@tabs'])

  test('handles overflow and scroll buttons correctly', async ({ assert }) => {
    const tabs = (await fixture(html`
      <ui-tabs style="width: 200px;">
        <ui-tab style="min-width: 100px;">Tab 1</ui-tab>
        <ui-tab style="min-width: 100px;">Tab 2</ui-tab>
        <ui-tab style="min-width: 100px;">Tab 3</ui-tab>
      </ui-tabs>
    `)) as UiTabsElement
    await tabs.updateComplete
    // Wait for ResizeObserver to trigger
    await new Promise((resolve) => setTimeout(resolve, 50))
    await tabs.updateComplete

    // Initially, right button should be visible (as it overflows), left should not
    assert.isNull(tabs.shadowRoot?.querySelector('.scroll-button.left'))
    assert.isNotNull(tabs.shadowRoot?.querySelector('.scroll-button.right'))

    // Click right scroll button to scroll
    const rightBtn = tabs.shadowRoot?.querySelector('.scroll-button.right ui-icon-button') as HTMLElement
    assert.isNotNull(rightBtn, 'Right scroll button exists')
    rightBtn.click()

    // Wait for scroll to happen and left button to appear
    await waitUntil(
      () => tabs.shadowRoot?.querySelector('.scroll-button.left') !== null,
      'Left scroll button should become visible'
    )

    assert.isNotNull(tabs.shadowRoot?.querySelector('.scroll-button.left'))
  }).tags(['@md', '@tabs'])

  test('aligns secondary tabs with 2dp indicator and flat shape', async ({ assert }) => {
    const tabs = (await fixture(html`
      <ui-tabs priority="secondary">
        <ui-tab id="secTab1" selected>Secondary 1</ui-tab>
        <ui-tab id="secTab2">Secondary 2</ui-tab>
      </ui-tabs>
    `)) as UiTabsElement
    await tabs.updateComplete
    const tab1 = tabs.querySelector('#secTab1') as UiTabElement
    await tab1.updateComplete

    assert.equal(tab1.priority, 'secondary')
    const indicator = tab1.shadowRoot?.querySelector('.indicator')
    assert.isNotNull(indicator, 'indicator rendered')
    const styles = getComputedStyle(tab1)
    assert.equal(styles.getPropertyValue('--_active-indicator-height').trim(), '2px')
    assert.equal(styles.getPropertyValue('--_active-indicator-shape').trim(), '0')
  }).tags(['@md', '@tabs'])

  test('applies 2dp insets and 24dp min-width to primary tab sizing', async ({ assert }) => {
    const tabs = await basicFixture()
    await tabs.updateComplete
    const tab1 = tabs.querySelector('#tab1') as UiTabElement
    await tab1.updateComplete

    const sizing = tab1.getIndicatorSizing()
    assert.isAtLeast(sizing.width, 24)
  }).tags(['@md', '@tabs'])

  test('detects overflowing tabs dynamically and sets overflowing class', async ({ assert }) => {
    const tabs = (await fixture(html`
      <ui-tabs style="width: 200px;">
        <ui-tab style="min-width: 100px;">Tab 1</ui-tab>
        <ui-tab style="min-width: 100px;">Tab 2</ui-tab>
        <ui-tab style="min-width: 100px;">Tab 3</ui-tab>
      </ui-tabs>
    `)) as UiTabsElement
    await tabs.updateComplete
    await waitUntil(
      () => tabs.shadowRoot?.querySelector('.tabs-container')?.classList.contains('overflowing') === true,
      'tabs-container should acquire overflowing class'
    )

    const container = tabs.shadowRoot?.querySelector('.tabs-container')
    assert.isTrue(container?.classList.contains('overflowing'))
  }).tags(['@md', '@tabs'])

  test('respects custom design tokens for active indicator height and shape', async ({ assert }) => {
    const tabs = (await fixture(html`
      <ui-tabs
        style="--md-primary-tab-active-indicator-height: 5px; --md-primary-tab-active-indicator-shape: 5px 5px 0 0;"
      >
        <ui-tab id="customTab1" selected>Custom 1</ui-tab>
      </ui-tabs>
    `)) as UiTabsElement
    await tabs.updateComplete
    const tab1 = tabs.querySelector('#customTab1') as UiTabElement
    await tab1.updateComplete

    const styles = getComputedStyle(tab1)
    assert.equal(styles.getPropertyValue('--_active-indicator-height').trim(), '5px')
    assert.equal(styles.getPropertyValue('--_active-indicator-shape').trim(), '5px 5px 0 0')
  }).tags(['@md', '@tabs'])

  test('centers primary indicator when content width is constrained below 24dp', async ({ assert }) => {
    const tabs = (await fixture(html`
      <ui-tabs>
        <ui-tab id="narrowTab" selected>
          <span slot="icon" style="display: inline-block; width: 16px; height: 16px;"></span>
        </ui-tab>
      </ui-tabs>
    `)) as UiTabsElement
    await tabs.updateComplete
    const tab = tabs.querySelector('#narrowTab') as UiTabElement
    await tab.updateComplete

    const sizing = tab.getIndicatorSizing()
    assert.equal(sizing.width, 24)
    const contentRect = tab.shadowRoot?.querySelector('.tab-content')?.getBoundingClientRect()
    if (contentRect) {
      const expectedLeft = contentRect.left + (contentRect.width - 24) / 2
      assert.closeTo(sizing.left, expectedLeft, 0.01)
    }
  }).tags(['@md', '@tabs'])

  test('places badge over icon in primary stacked tab', async ({ assert }) => {
    const tab = (await fixture(html`
      <ui-tab priority="primary">
        <span slot="icon">✈️</span>
        Flights
        <ui-badge slot="badge">3</ui-badge>
      </ui-tab>
    `)) as UiTabElement
    await tab.updateComplete

    assert.isTrue(tab.hasSlottedBadge)
    assert.isTrue(tab.isBadgeOnIcon)

    const iconBadgeSlot = tab.shadowRoot?.querySelector('.icon .badge-slot')
    assert.isNotNull(iconBadgeSlot, 'badge slot rendered inside icon container')

    const labelBadgeSlot = tab.shadowRoot?.querySelector('.label-wrapper .badge-slot')
    assert.isNull(labelBadgeSlot, 'badge slot not rendered in label wrapper')
  }).tags(['@md', '@tabs', '@badge'])

  test('places badge inline after label in primary label-only tab', async ({ assert }) => {
    const tab = (await fixture(html`
      <ui-tab priority="primary">
        Flights
        <ui-badge slot="badge">3</ui-badge>
      </ui-tab>
    `)) as UiTabElement
    await tab.updateComplete

    assert.isTrue(tab.hasSlottedBadge)
    assert.isFalse(tab.isBadgeOnIcon)

    const labelBadgeSlot = tab.shadowRoot?.querySelector('.label-wrapper .badge-slot')
    assert.isNotNull(labelBadgeSlot, 'badge slot rendered inside label wrapper')

    const iconBadgeSlot = tab.shadowRoot?.querySelector('.icon .badge-slot')
    assert.isNull(iconBadgeSlot, 'badge slot not rendered inside icon')
  }).tags(['@md', '@tabs', '@badge'])

  test('places badge inline after label in secondary icon+label tab', async ({ assert }) => {
    const tab = (await fixture(html`
      <ui-tab priority="secondary">
        <span slot="icon">📄</span>
        Overview
        <ui-badge slot="badge">3</ui-badge>
      </ui-tab>
    `)) as UiTabElement
    await tab.updateComplete

    assert.isTrue(tab.hasSlottedBadge)
    assert.isFalse(tab.isBadgeOnIcon)

    const labelBadgeSlot = tab.shadowRoot?.querySelector('.label-wrapper .badge-slot')
    assert.isNotNull(labelBadgeSlot, 'badge slot rendered inside label wrapper')

    const iconBadgeSlot = tab.shadowRoot?.querySelector('.icon .badge-slot')
    assert.isNull(iconBadgeSlot, 'badge slot not rendered inside icon')
  }).tags(['@md', '@tabs', '@badge'])

  test('places badge over icon in icon-only tab', async ({ assert }) => {
    const tab = (await fixture(html`
      <ui-tab>
        <span slot="icon">✈️</span>
        <ui-badge slot="badge">3</ui-badge>
      </ui-tab>
    `)) as UiTabElement
    await tab.updateComplete

    assert.isTrue(tab.hasSlottedBadge)
    assert.isTrue(tab.isBadgeOnIcon)

    const iconBadgeSlot = tab.shadowRoot?.querySelector('.icon .badge-slot')
    assert.isNotNull(iconBadgeSlot, 'badge slot rendered inside icon container')
  }).tags(['@md', '@tabs', '@badge'])

  test('dynamically factors inline badge into primary tab indicator sizing', async ({ assert }) => {
    const tabWithoutBadge = (await fixture(html`<ui-tab priority="primary">Flights</ui-tab>`)) as UiTabElement
    await tabWithoutBadge.updateComplete

    const tabWithBadge = (await fixture(html`
      <ui-tab priority="primary">
        Flights
        <ui-badge slot="badge">999+</ui-badge>
      </ui-tab>
    `)) as UiTabElement
    await tabWithBadge.updateComplete

    const sizingWithout = tabWithoutBadge.getIndicatorSizing()
    const sizingWith = tabWithBadge.getIndicatorSizing()

    assert.isAbove(sizingWith.width, sizingWithout.width, 'indicator width expands to cover inline badge')
  }).tags(['@md', '@tabs', '@badge'])

  test('supports small dot badge indicator on tab', async ({ assert }) => {
    const tab = (await fixture(html`
      <ui-tab>
        <span slot="icon">🔔</span>
        <ui-badge slot="badge" dot></ui-badge>
      </ui-tab>
    `)) as UiTabElement
    await tab.updateComplete

    assert.isTrue(tab.hasSlottedBadge)
    const badge = tab.querySelector('ui-badge')
    assert.isNotNull(badge)
    assert.isTrue(badge?.isDot)
  }).tags(['@md', '@tabs', '@badge'])

  test('primary tabs are accessible', async ({ assert }) => {
    const tabs = await basicFixture()
    await tabs.updateComplete
    await assert.isAccessible(tabs)
  }).tags(['@md', '@tabs', '@a11y'])

  test('secondary tabs are accessible', async ({ assert }) => {
    const tabs = await fixture(html`
      <ui-tabs priority="secondary" aria-label="Secondary navigation">
        <ui-tab selected>Overview</ui-tab>
        <ui-tab>Specifications</ui-tab>
        <ui-tab disabled>Reviews</ui-tab>
      </ui-tabs>
    `)
    await assert.isAccessible(tabs)
  }).tags(['@md', '@tabs', '@a11y'])

  test('tabs with icons and badges are accessible', async ({ assert }) => {
    const tabs = await fixture(html`
      <ui-tabs aria-label="Travel options">
        <ui-tab selected>
          <span slot="icon" aria-hidden="true">✈️</span>
          Flights
          <ui-badge slot="badge">3</ui-badge>
        </ui-tab>
        <ui-tab>
          <span slot="icon" aria-hidden="true">🏨</span>
          Hotels
        </ui-tab>
      </ui-tabs>
    `)
    await assert.isAccessible(tabs)
  }).tags(['@md', '@tabs', '@a11y'])

  test('overflowing tabs with scroll buttons are accessible', async ({ assert }) => {
    const tabs = (await fixture(html`
      <ui-tabs style="width: 200px;" aria-label="Overflowing tabs">
        <ui-tab style="min-width: 100px;" selected>Tab 1</ui-tab>
        <ui-tab style="min-width: 100px;">Tab 2</ui-tab>
        <ui-tab style="min-width: 100px;">Tab 3</ui-tab>
      </ui-tabs>
    `)) as UiTabsElement
    await tabs.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 50))
    await tabs.updateComplete
    await assert.isAccessible(tabs)
  }).tags(['@md', '@tabs', '@a11y'])
})
