import { test, nextFrame } from '@pawel-up/lupa/testing'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should render slot for menu items', async ({ assert }) => {
  const element = await basicFixture()
  await nextFrame()

  const slot = element.shadowRoot!.querySelector('slot')
  assert.isNotNull(slot)

  const menuItems = element.querySelectorAll('ui-menu-item')
  assert.equal(menuItems.length, 3)
})

test('should render with menu-container class', async ({ assert }) => {
  const element = await basicFixture()
  await nextFrame()

  const container = element.shadowRoot!.querySelector('.menu-container')
  assert.isNotNull(container)
})
