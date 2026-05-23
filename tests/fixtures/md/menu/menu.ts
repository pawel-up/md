import { fixture, html } from '@pawel-up/lupa/testing'
import type Menu from '../../../../src/components/menu/internal/Menu.js'

import '../../../../src/components/menu/ui-menu.js'
import '../../../../src/components/menu/ui-menu-item.js'
import '../../../../src/components/menu/ui-sub-menu.js'
import '../../../../src/components/icons/ui-icon.js'
import '../../../../src/components/button/ui-button.js'

export async function basicFixture(): Promise<Menu> {
  return fixture(html`
    <ui-menu id="test-menu">
      <ui-menu-item>Item 1</ui-menu-item>
      <ui-menu-item>Item 2</ui-menu-item>
      <ui-menu-item disabled>Item 3 (Disabled)</ui-menu-item>
    </ui-menu>
  `)
}

export async function submenuFixture(): Promise<Menu> {
  return fixture(html`
    <ui-menu id="main-menu">
      <ui-menu-item id="file-item" submenu="file-submenu">
        <span slot="start"><ui-icon>folder</ui-icon></span>
        <span>File</span>
      </ui-menu-item>
      <ui-menu-item>Item 2</ui-menu-item>

      <ui-sub-menu id="file-submenu" anchor="file-item">
        <ui-menu-item>New File</ui-menu-item>
        <ui-menu-item>Open File</ui-menu-item>
        <ui-menu-item id="export-item" submenu="export-submenu">Export</ui-menu-item>

        <ui-sub-menu id="export-submenu" anchor="export-item">
          <ui-menu-item>Export as PDF</ui-menu-item>
          <ui-menu-item>Export as PNG</ui-menu-item>
        </ui-sub-menu>
      </ui-sub-menu>
    </ui-menu>
  `)
}

export async function withTriggerFixture(): Promise<HTMLElement> {
  return fixture(html`
    <div>
      <ui-button id="trigger" popovertarget="menu">Open Menu</ui-button>
      <ui-menu id="menu">
        <ui-menu-item>Item 1</ui-menu-item>
        <ui-menu-item>Item 2</ui-menu-item>
      </ui-menu>
    </div>
  `)
}

export async function selectionFixture(): Promise<Menu> {
  return fixture(html`
    <ui-menu id="selection-menu" selectOnActivate>
      <ui-menu-item id="item1">Item 1</ui-menu-item>
      <ui-menu-item id="item2" selected>Item 2</ui-menu-item>
      <ui-menu-item id="item3">Item 3</ui-menu-item>
      <ui-menu-item id="item4" disabled>Item 4 (Disabled)</ui-menu-item>
    </ui-menu>
  `)
}
