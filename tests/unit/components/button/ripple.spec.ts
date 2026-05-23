import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Ripple effect', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  test('renders the ripple element', async ({ assert }) => {
    const button = await basicFixture()
    const ripple = button.shadowRoot!.querySelector('ui-ripple')
    assert.ok(ripple)
  }).tags(['@md', '@button', '@ripple'])
})
