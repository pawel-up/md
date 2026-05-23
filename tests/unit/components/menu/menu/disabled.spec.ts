import { test, nextFrame } from '@pawel-up/lupa/testing'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should set disabled attribute and call setDisabled', async ({ assert }) => {
  const element = await basicFixture()

  element.disabled = true
  await nextFrame()

  assert.isTrue(element.hasAttribute('disabled'))
  assert.isTrue(element.disabled)
})

test('should reflect disabled property to attribute', async ({ assert }) => {
  const element = await basicFixture()

  element.disabled = true
  await nextFrame()

  assert.equal(element.getAttribute('disabled'), '')

  element.disabled = false
  await nextFrame()

  assert.isFalse(element.hasAttribute('disabled'))
})
