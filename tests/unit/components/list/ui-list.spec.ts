import { test, fixture, html, nextFrame } from '@pawel-up/lupa/testing'
import '../../../../src/components/list/ui-list.js'
import '../../../../src/components/list/ui-list-item.js'
import { UiListElement } from '../../../../src/components/list/ui-list.js'
import { UiListItemElement } from '../../../../src/components/list/ui-list-item.js'

test.group('UiList - Selection and Focus on Disabled Items', () => {
  test('getFirstItem returns the first enabled item when the first item is disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item disabled id="item1">Disabled 1</ui-list-item>
        <ui-list-item id="item2">Enabled 2</ui-list-item>
        <ui-list-item id="item3">Enabled 3</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    const first = el.getFirstItem()
    assert.ok(first)
    assert.equal(first?.id, 'item2')
  })

  test('getFirstItem skips static items', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item static id="header">Header</ui-list-item>
        <ui-list-item id="item1">Enabled 1</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    const first = el.getFirstItem()
    assert.ok(first)
    assert.equal(first?.id, 'item1')
  })

  test('getFirstItem returns undefined when all items are disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item disabled id="item1">Disabled 1</ui-list-item>
        <ui-list-item disabled id="item2">Disabled 2</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    const first = el.getFirstItem()
    assert.isUndefined(first)
  })

  test('getLastItem returns the last enabled item when the last item is disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item id="item1">Enabled 1</ui-list-item>
        <ui-list-item id="item2">Enabled 2</ui-list-item>
        <ui-list-item disabled id="item3">Disabled 3</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    const last = el.getLastItem()
    assert.ok(last)
    assert.equal(last?.id, 'item2')
  })

  test('getLastItem returns undefined when all items are disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item disabled id="item1">Disabled 1</ui-list-item>
        <ui-list-item disabled id="item2">Disabled 2</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    const last = el.getLastItem()
    assert.isUndefined(last)
  })

  test('focusing the list activates the first enabled item, skipping disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item disabled id="item1">Disabled 1</ui-list-item>
        <ui-list-item id="item2">Enabled 2</ui-list-item>
        <ui-list-item id="item3">Enabled 3</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    el.focus()
    await nextFrame()

    assert.equal(el.activeListItem?.id, 'item2')
    const item2 = el.querySelector('#item2') as UiListItemElement
    assert.equal(item2.getAttribute('tabindex'), '0')
    const item1 = el.querySelector('#item1') as UiListItemElement
    assert.notEqual(item1.getAttribute('tabindex'), '0')
    assert.isFalse(item1.isActive())
  })

  test('focusing the list when all items are disabled does not activate any item', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item disabled id="item1">Disabled 1</ui-list-item>
        <ui-list-item disabled id="item2">Disabled 2</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    el.focus()
    await nextFrame()

    assert.isNull(el.activeListItem)
  })

  test('Home key navigates to the first enabled item, skipping disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item disabled id="item1">Disabled 1</ui-list-item>
        <ui-list-item id="item2">Enabled 2</ui-list-item>
        <ui-list-item id="item3">Enabled 3</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    // Start on item 3
    const item3 = el.querySelector('#item3') as UiListItemElement
    el.activeListItem = item3
    item3.activate()

    const homeEvent = new KeyboardEvent('keydown', { key: 'Home', bubbles: true })
    el.dispatchEvent(homeEvent)
    await nextFrame()

    assert.equal(el.activeListItem?.id, 'item2')
  })

  test('End key navigates to the last enabled item, skipping disabled', async ({ assert }) => {
    const el = await fixture<UiListElement>(html`
      <ui-list>
        <ui-list-item id="item1">Enabled 1</ui-list-item>
        <ui-list-item id="item2">Enabled 2</ui-list-item>
        <ui-list-item disabled id="item3">Disabled 3</ui-list-item>
      </ui-list>
    `)
    await el.updateComplete
    await nextFrame()

    const item1 = el.querySelector('#item1') as UiListItemElement
    el.activeListItem = item1
    item1.activate()

    const endEvent = new KeyboardEvent('keydown', { key: 'End', bubbles: true })
    el.dispatchEvent(endEvent)
    await nextFrame()

    assert.equal(el.activeListItem?.id, 'item2')
  })
})

test.group('UiListItem - Focus Handling', () => {
  test('calling focus() on a disabled list item is a no-op', async ({ assert }) => {
    const item = await fixture<UiListItemElement>(html`<ui-list-item disabled id="item1">Disabled</ui-list-item>`)
    await item.updateComplete

    item.focus()
    assert.notEqual(document.activeElement, item)
  })

  test('isFocusable getter returns false when disabled', async ({ assert }) => {
    const item = await fixture<UiListItemElement>(html`<ui-list-item disabled id="item1">Disabled</ui-list-item>`)
    await item.updateComplete
    assert.isFalse(item.isFocusable)
  })

  test('isFocusable getter returns false when static', async ({ assert }) => {
    const item = await fixture<UiListItemElement>(html`<ui-list-item static id="item1">Static</ui-list-item>`)
    await item.updateComplete
    assert.isFalse(item.isFocusable)
  })

  test('isFocusable getter returns true when neither disabled nor static', async ({ assert }) => {
    const item = await fixture<UiListItemElement>(html`<ui-list-item id="item1">Normal</ui-list-item>`)
    await item.updateComplete
    assert.isTrue(item.isFocusable)
  })
})
