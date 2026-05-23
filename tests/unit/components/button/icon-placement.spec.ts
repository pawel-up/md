import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'
import '../../../../src/components/icons/ui-icon.js'

test.group('Icon placement', () => {
  async function iconFixture(): Promise<UiButtonElement> {
    return fixture(
      html`<ui-button color="filled">
        <ui-icon slot="icon" icon="add"></ui-icon>
        Label
      </ui-button>`
    )
  }

  async function trailingIconFixture(): Promise<UiButtonElement> {
    return fixture(
      html`<ui-button color="filled" trailingIcon>
        <ui-icon slot="icon" icon="add"></ui-icon>
        Label
      </ui-button>`
    )
  }

  test('places the icon as a prefix by default', async ({ assert }) => {
    const button = await iconFixture()
    const content = button.shadowRoot!
    assert.equal(content?.children[2].localName, 'slot')
  }).tags(['@md', '@button', '@icon'])

  test('places the icon as a suffix', async ({ assert }) => {
    const button = await trailingIconFixture()
    const content = button.shadowRoot!
    assert.equal(content?.children[3].localName, 'slot')
  }).tags(['@md', '@button', '@icon'])
})
