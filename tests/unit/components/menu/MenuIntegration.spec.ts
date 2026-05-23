import { test, fixture, html, nextFrame, aTimeout } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import Menu from '../../../../src/components/menu/internal/Menu.js'
import UiMenuItem from '../../../../src/components/menu/internal/MenuItem.js'
import UiSubMenu from '../../../../src/components/menu/internal/SubMenu.js'

import '../../../../src/components/menu/ui-menu.js'
import '../../../../src/components/menu/ui-menu-item.js'
import '../../../../src/components/menu/ui-sub-menu.js'
import '../../../../src/components/icons/ui-icon.js'
import '../../../../src/components/button/ui-button.js'

async function completeMenuFixture(): Promise<HTMLElement> {
  return fixture(html`
    <div>
      <ui-button id="menu-trigger" popovertarget="main-menu">Open Menu</ui-button>

      <ui-menu id="main-menu">
        <!-- Regular menu items -->
        <ui-menu-item>
          <span slot="start"><ui-icon>add</ui-icon></span>
          <span>New</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>folder</ui-icon></span>
          <span>Open</span>
        </ui-menu-item>

        <!-- Menu item with submenu -->
        <ui-menu-item id="file-item" submenu="file-submenu">
          <span slot="start"><ui-icon>docs</ui-icon></span>
          <span>File</span>
        </ui-menu-item>

        <!-- Menu item with submenu -->
        <ui-menu-item id="edit-item" submenu="edit-submenu">
          <span slot="start"><ui-icon>edit</ui-icon></span>
          <span>Edit</span>
        </ui-menu-item>

        <!-- File submenu with nested submenu -->
        <ui-sub-menu id="file-submenu" anchor="file-item">
          <ui-menu-item>New File</ui-menu-item>
          <ui-menu-item>Open File</ui-menu-item>
          <ui-menu-item id="export-item" submenu="export-submenu">
            <span slot="start"><ui-icon>file_export</ui-icon></span>
            <span>Export</span>
          </ui-menu-item>

          <!-- Nested submenu -->
          <ui-sub-menu id="export-submenu" anchor="export-item">
            <ui-menu-item>Export as PDF</ui-menu-item>
            <ui-menu-item>Export as PNG</ui-menu-item>
            <ui-menu-item>Export as SVG</ui-menu-item>
          </ui-sub-menu>
        </ui-sub-menu>

        <!-- Edit submenu -->
        <ui-sub-menu id="edit-submenu" anchor="edit-item">
          <ui-menu-item>Undo</ui-menu-item>
          <ui-menu-item>Redo</ui-menu-item>
          <ui-menu-item>Cut</ui-menu-item>
          <ui-menu-item>Copy</ui-menu-item>
        </ui-sub-menu>
      </ui-menu>
    </div>
  `)
}

test.group('Complete workflow', () => {
  test('should open menu via trigger button', async ({ assert }) => {
    const container = await completeMenuFixture()
    const trigger = container.querySelector('#menu-trigger') as HTMLElement
    const menu = container.querySelector('#main-menu') as Menu
    await nextFrame()

    trigger.click()
    await nextFrame()

    assert.isTrue(menu.open)
  })

  test('should open submenu on hover', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    await nextFrame()

    menu.show()
    await nextFrame()

    // Hover over file item
    const mouseEnterEvent = new MouseEvent('mouseenter')
    fileItem.dispatchEvent(mouseEnterEvent)
    await nextFrame()

    assert.isNotNull(menu.activeSubMenu)
    assert.equal(menu.activeSubMenu, fileSubmenu)
  })

  test('should navigate submenus with keyboard', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    await nextFrame()

    menu.show()
    await nextFrame()

    // Set active item to file item
    menu.activeListItem = fileItem

    // Press right arrow to open submenu
    const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    menu.dispatchEvent(rightArrowEvent)
    await nextFrame()

    assert.isNotNull(menu.activeSubMenu)
  })

  test('should handle nested submenu navigation', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    const exportItem = container.querySelector('#export-item') as UiMenuItem
    const exportSubmenu = container.querySelector('#export-submenu') as UiSubMenu
    await nextFrame()

    menu.show()
    await nextFrame()

    // Open file submenu
    fileItem.openSubMenu()
    await nextFrame()

    // Hover over export item to open nested submenu
    const mouseEnterEvent = new MouseEvent('mouseenter')
    exportItem.dispatchEvent(mouseEnterEvent)
    await nextFrame()

    assert.isNotNull(fileSubmenu.activeSubMenu)
    assert.equal(fileSubmenu.activeSubMenu, exportSubmenu)
  })

  test('should close submenus when main menu closes', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    await nextFrame()

    menu.show()
    await nextFrame()

    // Open submenu
    fileItem.openSubMenu()
    await nextFrame()
    assert.isTrue(fileSubmenu.open)

    // Close main menu
    menu.hide()
    await nextFrame()

    assert.isFalse(menu.open)
    assert.isFalse(fileSubmenu.open)
    assert.isNull(menu.activeSubMenu)
  })

  test('should handle menu item selection and close menu', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const menuItem = menu.querySelector('ui-menu-item') as UiMenuItem
    let selectedItem: UiMenuItem | null = null
    let selectedIndex: number | null = null
    await nextFrame()

    menu.addEventListener('select', (e: Event) => {
      const customEvent = e as CustomEvent<{ item: UiMenuItem; index: number }>
      selectedItem = customEvent.detail.item
      selectedIndex = customEvent.detail.index
    })

    menu.show()
    await nextFrame()

    menuItem.click()
    await nextFrame()

    assert.isFalse(menu.open)
    assert.equal(selectedItem, menuItem)
    assert.equal(selectedIndex, 0)
  })

  test('should handle submenu item selection', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    const submenuItem = fileSubmenu.querySelector('ui-menu-item') as UiMenuItem
    let selectedItem: UiMenuItem | null = null
    await nextFrame()

    menu.addEventListener('select', (e: Event) => {
      const customEvent = e as CustomEvent<{ item: UiMenuItem; index: number }>
      selectedItem = customEvent.detail.item
    })

    menu.show()
    await nextFrame()

    // Open submenu
    fileItem.openSubMenu()
    await nextFrame()

    // Click submenu item
    submenuItem.click()
    await nextFrame()

    assert.isFalse(menu.open)
    assert.isFalse(fileSubmenu.open)
    assert.equal(selectedItem, submenuItem)
  })

  test('should handle deeply nested submenu selection', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const exportItem = container.querySelector('#export-item') as UiMenuItem
    const exportSubmenu = container.querySelector('#export-submenu') as UiSubMenu
    const nestedItem = exportSubmenu.querySelector('ui-menu-item') as UiMenuItem
    let selectedItem: UiMenuItem | null = null
    await nextFrame()

    menu.addEventListener('select', (e: Event) => {
      const customEvent = e as CustomEvent<{ item: UiMenuItem; index: number }>
      selectedItem = customEvent.detail.item
    })

    menu.show()
    await nextFrame()

    // Open file submenu
    fileItem.openSubMenu()
    await nextFrame()

    // Open export submenu
    exportItem.openSubMenu()
    await nextFrame()

    // Click nested item
    nestedItem.click()
    await nextFrame()

    assert.isFalse(menu.open)
    assert.equal(selectedItem, nestedItem)
  })

  test('should switch between submenus properly', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const editItem = container.querySelector('#edit-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    const editSubmenu = container.querySelector('#edit-submenu') as UiSubMenu
    await nextFrame()

    menu.show()
    await nextFrame()

    // Open file submenu
    fileItem.openSubMenu()
    await nextFrame()
    assert.equal(menu.activeSubMenu, fileSubmenu)
    assert.isTrue(fileSubmenu.open)

    // Switch to edit submenu
    editItem.openSubMenu()
    await nextFrame()
    assert.equal(menu.activeSubMenu, editSubmenu)
    assert.isTrue(editSubmenu.open)
    assert.isFalse(fileSubmenu.open)
  })

  test('should handle escape key to close nested submenus', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    const exportItem = container.querySelector('#export-item') as UiMenuItem
    const exportSubmenu = container.querySelector('#export-submenu') as UiSubMenu
    await nextFrame()

    menu.show()
    await nextFrame()

    // Open nested submenus
    fileItem.openSubMenu()
    await nextFrame()
    exportItem.openSubMenu()
    await nextFrame()

    assert.isTrue(exportSubmenu.open)

    // Press escape on nested submenu
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    exportSubmenu.dispatchEvent(escapeEvent)
    await nextFrame()

    assert.isFalse(exportSubmenu.open)
    assert.isTrue(fileSubmenu.open) // Parent submenu should still be open
    assert.isTrue(menu.open) // Main menu should still be open
  })

  test('should handle mouse leave to close submenus with delay', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    const fileSubmenu = container.querySelector('#file-submenu') as UiSubMenu
    await nextFrame()

    menu.show()
    await nextFrame()

    // Open submenu on hover
    const mouseEnterEvent = new MouseEvent('mouseenter')
    fileItem.dispatchEvent(mouseEnterEvent)
    await nextFrame()
    assert.isTrue(fileSubmenu.open)

    // Mouse leave
    const mouseLeaveEvent = new MouseEvent('mouseleave')
    fileItem.dispatchEvent(mouseLeaveEvent)

    // Should close after a delay
    await aTimeout(150) // Wait for the delay in the implementation

    assert.isFalse(fileSubmenu.open)
  })
})

test.group('Accessibility integration', () => {
  test('should maintain proper ARIA states throughout navigation', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    const fileItem = container.querySelector('#file-item') as UiMenuItem
    await nextFrame()

    // Initial state
    assert.equal(menu.getAttribute('aria-expanded'), 'false')
    assert.equal(fileItem.getAttribute('aria-expanded'), 'false')

    // Open menu
    menu.show()
    await nextFrame()
    assert.equal(menu.getAttribute('aria-expanded'), 'true')

    // Open submenu
    fileItem.openSubMenu()
    await nextFrame()
    assert.equal(fileItem.getAttribute('aria-expanded'), 'true')

    // Close submenu
    fileItem.closeSubMenu()
    await nextFrame()
    assert.equal(fileItem.getAttribute('aria-expanded'), 'false')
  })

  test('should maintain focus management', async ({ assert }) => {
    const container = await completeMenuFixture()
    const menu = container.querySelector('#main-menu') as Menu
    await nextFrame()

    const focusSpy = sinon.spy(menu, 'focus')

    menu.show()
    await nextFrame()

    assert.isTrue(focusSpy.calledOnce)
    assert.equal(menu.tabIndex, 0)
  })
})

test.group('Error handling', () => {
  test('should handle missing submenu references gracefully', async ({ assert }) => {
    const brokenMenu: HTMLElement = await fixture(html`
      <ui-menu>
        <ui-menu-item submenu="nonexistent">Broken Item</ui-menu-item>
      </ui-menu>
    `)
    const menu = brokenMenu as Menu
    const brokenItem = brokenMenu.querySelector('ui-menu-item') as UiMenuItem
    await nextFrame()

    menu.show()
    await nextFrame()

    // Should not throw
    brokenItem.openSubMenu()
    assert.isFalse(brokenItem.hasSubMenu)
    assert.isNull(menu.activeSubMenu)
  })

  test('should handle missing anchor references gracefully', async ({ assert }) => {
    const brokenSubmenu: HTMLElement = await fixture(html`
      <div>
        <ui-sub-menu anchor="nonexistent">
          <ui-menu-item>Item</ui-menu-item>
        </ui-sub-menu>
      </div>
    `)
    const submenu = brokenSubmenu.querySelector('ui-sub-menu') as UiSubMenu
    await nextFrame()

    // Should not show since anchor doesn't exist
    submenu.show()
    await nextFrame()

    assert.isFalse(submenu.open)
  })
})
