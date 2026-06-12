import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiTabsElement } from '../../../../src/components/tabs/ui-tabs.js'
import { UiTabElement } from '../../../../src/components/tabs/ui-tab.js'

import '../../../../src/components/tabs/ui-tabs.js'
import '../../../../src/components/tabs/ui-tab.js'

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
})
