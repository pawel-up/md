import { test, nextFrame } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should focus menu when shown', async ({ assert }) => {
  const element = await basicFixture()
  const focusSpy = sinon.spy(element, 'focus')

  element.show()
  await nextFrame()

  assert.isTrue(focusSpy.calledOnce)
  assert.equal(element.tabIndex, 0)
})

test('should set tabindex correctly based on open state', async ({ assert }) => {
  const element = await basicFixture()

  assert.equal(element.tabIndex, -1)

  element.show()
  await nextFrame()

  assert.equal(element.tabIndex, 0)

  element.hide()
  await nextFrame()

  assert.equal(element.tabIndex, -1)
})
