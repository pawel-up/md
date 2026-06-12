import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiDividerElement, DividerType } from '../../../../src/components/divider/ui-divider.js'

import '../../../../src/components/divider/ui-divider.js'

test.group('Divider', () => {
  async function basicFixture(): Promise<UiDividerElement> {
    return fixture(html`<ui-divider></ui-divider>`) as Promise<UiDividerElement>
  }

  test('has default property values', async ({ assert }) => {
    const divider = await basicFixture()
    assert.equal(divider.type, DividerType.full)
    assert.isFalse(divider.vertical)
  }).tags(['@md', '@divider'])

  test('sets role attribute to presentation by default', async ({ assert }) => {
    const divider = await basicFixture()
    assert.equal(divider.getAttribute('role'), 'presentation')
  }).tags(['@md', '@divider'])

  test('respects vertical and type attributes', async ({ assert }) => {
    const divider = (await fixture(html`<ui-divider vertical type="inset"></ui-divider>`)) as UiDividerElement
    assert.isTrue(divider.vertical)
    assert.equal(divider.type, DividerType.inset)
  }).tags(['@md', '@divider'])
})
