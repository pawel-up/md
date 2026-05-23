import { fixture, html, test } from '@pawel-up/lupa/testing'
import Menu from '../../../../../src/components/menu/internal/Menu.js'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should create menu element', async ({ assert }) => {
  const element = await basicFixture()
  assert.instanceOf(element, Menu)
  assert.equal(element.tagName.toLowerCase(), 'ui-menu')
})

test('should have correct default properties', async ({ assert }) => {
  const element = await basicFixture()
  assert.isFalse(element.open)
  assert.isFalse(element.disabled)
  assert.isNull(element.activeSubMenu)
})

test('should set correct ARIA attributes', async ({ assert }) => {
  const element = await basicFixture()
  assert.equal(element.getAttribute('role'), 'menu')
  assert.equal(element.getAttribute('aria-expanded'), 'false')
  assert.equal(element.tabIndex, -1)
})

test('should set popover attribute if not present', async ({ assert }) => {
  const element = await basicFixture()
  assert.equal(element.getAttribute('popover'), 'auto')
})

test('should generate ID if not present', async ({ assert }) => {
  const element: Menu = await fixture(html`<ui-menu><ui-menu-item>Test</ui-menu-item></ui-menu>`)
  assert.isString(element.id)
  assert.isTrue(element.id.length > 0)
})
