import { test, nextFrame } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should handle closeSubMenu when no submenu is active', async ({ assert }) => {
  const element = await basicFixture()

  // Should not throw
  element.closeSubMenu()

  assert.isNull(element.activeSubMenu)
})

test('should handle keydown events that are already prevented', async ({ assert }) => {
  const element = await basicFixture()
  const hideSpy = sinon.spy(element, 'hide')
  element.show()
  await nextFrame()

  const event = new KeyboardEvent('keydown', { key: 'Escape' })
  event.preventDefault()
  Object.defineProperty(event, 'defaultPrevented', { value: true })

  element.dispatchEvent(event)

  // Should not handle the event since it's already prevented
  assert.isFalse(hideSpy.called)
})
