import { test, fixture, html } from '@pawel-up/lupa/testing'
import '../../../../src/components/list/ui-expressive-list.js'
import '../../../../src/components/list/ui-expressive-list-item.js'
import { UiExpressiveListElement } from '../../../../src/components/list/ui-expressive-list.js'

test.group('UiExpressiveList', () => {
  test('renders a list with items', async ({ assert }) => {
    const el = await fixture<UiExpressiveListElement>(html`
      <ui-expressive-list>
        <ui-expressive-list-item>Item 1</ui-expressive-list-item>
        <ui-expressive-list-item>Item 2</ui-expressive-list-item>
      </ui-expressive-list>
    `)
    assert.ok(el)
    const items = el.querySelectorAll('ui-expressive-list-item')
    assert.equal(items.length, 2)
  })

  test('passes a11y audit', async ({ assert }) => {
    const el = await fixture<UiExpressiveListElement>(html`
      <ui-expressive-list role="list" aria-label="Test List">
        <ui-expressive-list-item tabindex="0">Item 1</ui-expressive-list-item>
        <ui-expressive-list-item>Item 2</ui-expressive-list-item>
      </ui-expressive-list>
    `)
    await assert.isAccessible(el)
  })
})

test.group('UiExpressiveList - collapsible lists', () => {
  test('sets group and last-in-group attributes automatically', async ({ assert }) => {
    const el = await fixture<UiExpressiveListElement>(html`
      <ui-expressive-list collapsible>
        <ui-expressive-list-item id="p1">Parent</ui-expressive-list-item>
        <ui-expressive-list-item parent="p1" id="c1">Child 1</ui-expressive-list-item>
        <ui-expressive-list-item parent="p1" id="c2">Child 2</ui-expressive-list-item>
      </ui-expressive-list>
    `)
    // updateComplete for the list and items to sync
    await el.updateComplete

    const parent = el.querySelector('#p1') as UiExpressiveListElement
    const child1 = el.querySelector('#c1') as UiExpressiveListElement
    const child2 = el.querySelector('#c2') as UiExpressiveListElement

    assert.isTrue(parent.hasAttribute('group'), 'Parent should have group attribute')
    assert.isFalse(child1.hasAttribute('last-in-group'), 'Child 1 should not be last')
    assert.isTrue(child2.hasAttribute('last-in-group'), 'Child 2 should be last-in-group')
  })

  test('collapses children when parent is closed', async ({ assert }) => {
    const el = await fixture<UiExpressiveListElement>(html`
      <ui-expressive-list collapsible>
        <ui-expressive-list-item id="p1">Parent</ui-expressive-list-item>
        <ui-expressive-list-item parent="p1" id="c1">Child 1</ui-expressive-list-item>
      </ui-expressive-list>
    `)
    await el.updateComplete

    const child1 = el.querySelector('#c1') as UiExpressiveListElement
    // By default, open is false, so child should be collapsed
    assert.isTrue(child1.hasAttribute('collapsed'), 'Child should be collapsed')
  })

  test('shows children when parent is open', async ({ assert }) => {
    const el = await fixture<UiExpressiveListElement>(html`
      <ui-expressive-list collapsible>
        <ui-expressive-list-item id="p1" open>Parent</ui-expressive-list-item>
        <ui-expressive-list-item parent="p1" id="c1">Child 1</ui-expressive-list-item>
      </ui-expressive-list>
    `)
    await el.updateComplete

    const child1 = el.querySelector('#c1') as UiExpressiveListElement
    // open is true, child should not be collapsed
    assert.isFalse(child1.hasAttribute('collapsed'), 'Child should not be collapsed')
  })

  test('toggles parent open state on click', async ({ assert }) => {
    const el = await fixture<UiExpressiveListElement>(html`
      <ui-expressive-list collapsible>
        <ui-expressive-list-item id="p1">Parent</ui-expressive-list-item>
        <ui-expressive-list-item parent="p1" id="c1">Child 1</ui-expressive-list-item>
      </ui-expressive-list>
    `)
    await el.updateComplete

    const parent = el.querySelector('#p1') as UiExpressiveListElement
    const child1 = el.querySelector('#c1') as UiExpressiveListElement

    assert.isTrue(child1.hasAttribute('collapsed'), 'Initial: Child should be collapsed')

    // Simulate activation
    parent.click()
    await el.updateComplete

    assert.isTrue(parent.hasAttribute('open'), 'Parent should be open after click')
    assert.isFalse(child1.hasAttribute('collapsed'), 'Child should not be collapsed after click')
  })
})
