import { test, fixture, html, nextFrame } from '@pawel-up/lupa/testing'
import UiMenuGroup from '../../../../src/components/menu/internal/MenuGroup.js'
import UiMenu from '../../../../src/components/menu/internal/Menu.js'
import UiMenuItem from '../../../../src/components/menu/internal/MenuItem.js'

import '../../../../src/components/menu/ui-menu.js'
import '../../../../src/components/menu/ui-menu-item.js'
import '../../../../src/components/menu/ui-menu-group.js'

async function basicGroupFixture(): Promise<UiMenuGroup> {
  return fixture(html`
    <ui-menu-group aria-label="Actions">
      <ui-menu-item id="item1">Item 1</ui-menu-item>
      <ui-menu-item id="item2">Item 2</ui-menu-item>
    </ui-menu-group>
  `)
}

async function groupedMenuFixture(): Promise<{
  menu: UiMenu
  group1: UiMenuGroup
  group2: UiMenuGroup
  items: UiMenuItem[]
}> {
  const container = await fixture<HTMLElement>(html`
    <div>
      <ui-menu id="grouped-menu">
        <ui-menu-group id="g1" aria-label="Edit">
          <ui-menu-item id="item-undo">Undo</ui-menu-item>
          <ui-menu-item id="item-redo">Redo</ui-menu-item>
        </ui-menu-group>
        <ui-menu-group id="g2" aria-label="Clipboard">
          <ui-menu-item id="item-cut">Cut</ui-menu-item>
          <ui-menu-item id="item-copy">Copy</ui-menu-item>
          <ui-menu-item id="item-paste">Paste</ui-menu-item>
        </ui-menu-group>
      </ui-menu>
    </div>
  `)

  const menu = container.querySelector('#grouped-menu') as UiMenu
  const group1 = container.querySelector('#g1') as UiMenuGroup
  const group2 = container.querySelector('#g2') as UiMenuGroup
  const items = Array.from(container.querySelectorAll('ui-menu-item')) as UiMenuItem[]

  return { menu, group1, group2, items }
}

test.group('MenuGroup basic functionality', () => {
  test('should create group element with correct ARIA role', async ({ assert }) => {
    const group = await basicGroupFixture()
    assert.instanceOf(group, UiMenuGroup)
    assert.equal(group.getAttribute('role'), 'group')
  })

  test('should allow consumer to specify aria-label directly', async ({ assert }) => {
    const group = await basicGroupFixture()
    assert.equal(group.getAttribute('aria-label'), 'Actions')
  })

  test('should return slotted items from getter', async ({ assert }) => {
    const group = await basicGroupFixture()
    const items = group.items
    assert.equal(items.length, 2)
    assert.equal(items[0].id, 'item1')
    assert.equal(items[1].id, 'item2')
  })
})

test.group('Grouped Menu Integration', () => {
  test('should flatten items across all groups into parent menu.items', async ({ assert }) => {
    const { menu, items } = await groupedMenuFixture()
    assert.equal(menu.items.length, 5)
    assert.equal(menu.items[0].id, items[0].id)
    assert.equal(menu.items[1].id, items[1].id)
    assert.equal(menu.items[2].id, items[2].id)
    assert.equal(menu.items[3].id, items[3].id)
    assert.equal(menu.items[4].id, items[4].id)
  })

  test('should set has-groups attribute on parent menu', async ({ assert }) => {
    const { menu } = await groupedMenuFixture()
    assert.isTrue(menu.hasAttribute('has-groups'))
  })

  test('should seamlessly navigate with ArrowDown across group boundaries', async ({ assert }) => {
    const { menu, items } = await groupedMenuFixture()
    menu.open = true
    await nextFrame()

    // Activate last item of group 1 (item-redo, index 1)
    items.forEach((item) => item.deactivate())
    items[1].activate()

    // Press ArrowDown
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    menu.dispatchEvent(event)
    await nextFrame()

    // Focus should have moved to first item of group 2 (item-cut, index 2)
    assert.equal(menu.activeListItem?.id, items[2].id)
  })

  test('should seamlessly navigate with ArrowUp across group boundaries', async ({ assert }) => {
    const { menu, items } = await groupedMenuFixture()
    menu.open = true
    await nextFrame()

    // Activate first item of group 2 (item-cut, index 2)
    items.forEach((item) => item.deactivate())
    items[2].activate()

    // Press ArrowUp
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
    menu.dispatchEvent(event)
    await nextFrame()

    // Focus should have moved to last item of group 1 (item-redo, index 1)
    assert.equal(menu.activeListItem?.id, items[1].id)
  })

  test('should jump to first and last items across groups with Home and End', async ({ assert }) => {
    const { menu, items } = await groupedMenuFixture()
    menu.open = true
    await nextFrame()

    // Focus middle item
    items[2].focus()
    menu.activeListItem = items[2]

    // Press Home
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }))
    await nextFrame()
    assert.equal(menu.activeListItem?.id, items[0].id)

    // Press End
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    await nextFrame()
    assert.equal(menu.activeListItem?.id, items[4].id)
  })
})

test.group('Multi-select Menu', () => {
  test('should toggle items and stay open in multi-select mode', async ({ assert }) => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <ui-menu id="multi-menu" multiselect>
          <ui-menu-item id="opt1">Option 1</ui-menu-item>
          <ui-menu-item id="opt2">Option 2</ui-menu-item>
          <ui-menu-item id="opt3">Option 3</ui-menu-item>
        </ui-menu>
      </div>
    `)

    const menu = container.querySelector('#multi-menu') as UiMenu
    const items = Array.from(container.querySelectorAll('ui-menu-item')) as UiMenuItem[]

    menu.show()
    await nextFrame()

    // Click item 1
    items[0].click()
    await nextFrame()

    assert.isTrue(items[0].selected)
    assert.isTrue(menu.open, 'Menu should remain open in multi-select')

    // Click item 2
    items[1].click()
    await nextFrame()

    assert.isTrue(items[0].selected, 'Item 1 should remain selected')
    assert.isTrue(items[1].selected, 'Item 2 should be selected')
    assert.isTrue(menu.open, 'Menu should still remain open')

    const selected = menu.selectedItems
    assert.equal(selected.length, 2)
    assert.isTrue(selected.includes(items[0]))
    assert.isTrue(selected.includes(items[1]))

    // Click item 1 again to toggle off
    items[0].click()
    await nextFrame()

    assert.isFalse(items[0].selected)
    assert.isTrue(items[1].selected)
    assert.equal(menu.selectedItems.length, 1)
  })

  test('should set role="menuitemcheckbox" and aria-checked in multi-select mode', async ({ assert }) => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <ui-menu id="multi-menu" multiselect>
          <ui-menu-item id="opt1">Option 1</ui-menu-item>
        </ui-menu>
      </div>
    `)

    const menu = container.querySelector('#multi-menu') as UiMenu
    const item = container.querySelector('ui-menu-item') as UiMenuItem

    menu.show()
    await nextFrame()

    item.selected = true
    await nextFrame()

    assert.equal(item.getAttribute('role'), 'menuitemcheckbox')
    assert.equal(item.getAttribute('aria-checked'), 'true')

    item.selected = false
    await nextFrame()

    assert.equal(item.getAttribute('aria-checked'), 'false')
  })
})

test.group('Menu Variants and Density', () => {
  test('should reflect density attribute', async ({ assert }) => {
    const menu = await fixture<UiMenu>(html`<ui-menu density="-2"></ui-menu>`)
    assert.equal(menu.density, '-2')
    assert.equal(menu.getAttribute('density'), '-2')
  })

  test('should reflect variant attribute', async ({ assert }) => {
    const menu = await fixture<UiMenu>(html`<ui-menu variant="vibrant"></ui-menu>`)
    assert.equal(menu.variant, 'vibrant')
    assert.equal(menu.getAttribute('variant'), 'vibrant')
  })

  test('should synchronize density and variant down to child groups and items', async ({ assert }) => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <ui-menu id="synced-menu" density="-3" variant="vibrant">
          <ui-menu-group id="g1">
            <ui-menu-item id="i1">Grouped Item</ui-menu-item>
          </ui-menu-group>
          <ui-menu-item id="i2">Direct Item</ui-menu-item>
        </ui-menu>
      </div>
    `)

    const group = container.querySelector('#g1') as UiMenuGroup
    const item1 = container.querySelector('#i1') as UiMenuItem
    const item2 = container.querySelector('#i2') as UiMenuItem

    await nextFrame()

    assert.equal(group.density, '-3')
    assert.equal(group.variant, 'vibrant')
    assert.equal(item1.density, '-3')
    assert.equal(item1.variant, 'vibrant')
    assert.equal(item2.density, '-3')
    assert.equal(item2.variant, 'vibrant')
  })
})
