import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonGroupElement } from '../../../../src/components/button/ui-button-group.js'
import type { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'
import '../../../../src/components/button/ui-button-group.js'

test.group('Button Group', () => {
  test('reflects properties to attributes', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="m" shape="square" multiple>
        <ui-button>1</ui-button>
      </ui-button-group>
    `)
    assert.equal(el.getAttribute('type'), 'connected')
    assert.equal(el.getAttribute('size'), 'm')
    assert.equal(el.getAttribute('shape'), 'square')
    assert.isTrue(el.hasAttribute('multiple'))
  }).tags(['@md', '@button-group'])

  test('sets connected gap to 2px', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const groupStyle = window.getComputedStyle(el)
    assert.equal(groupStyle.gap, '2px')
  }).tags(['@md', '@button-group'])

  test('sets standard gap based on size', async ({ assert }) => {
    const elS = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="standard" size="s">
        <ui-button>1</ui-button>
        <ui-button>2</ui-button>
      </ui-button-group>
    `)
    assert.equal(window.getComputedStyle(elS).gap, '12px')

    const elXs = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="standard" size="xs">
        <ui-button>1</ui-button>
        <ui-button>2</ui-button>
      </ui-button-group>
    `)
    assert.equal(window.getComputedStyle(elXs).gap, '18px')

    const elM = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="standard" size="m">
        <ui-button>1</ui-button>
        <ui-button>2</ui-button>
      </ui-button-group>
    `)
    assert.equal(window.getComputedStyle(elM).gap, '8px')

    const elL = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="standard" size="l">
        <ui-button>1</ui-button>
        <ui-button>2</ui-button>
      </ui-button-group>
    `)
    assert.equal(window.getComputedStyle(elL).gap, '8px')

    const elXl = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="standard" size="xl">
        <ui-button>1</ui-button>
        <ui-button>2</ui-button>
      </ui-button-group>
    `)
    assert.equal(window.getComputedStyle(elXl).gap, '8px')
  }).tags(['@md', '@button-group'])

  test('sets correct corner radii on connected unselected buttons for size s', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')

    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)

    if (b1 && b2 && b3) {
      const b1Style = window.getComputedStyle(b1)
      const b2Style = window.getComputedStyle(b2)
      const b3Style = window.getComputedStyle(b3)

      // First button: left side round (20px), right side inner corner (8px)
      assert.equal(b1Style.borderTopLeftRadius, '20px')
      assert.equal(b1Style.borderBottomLeftRadius, '20px')
      assert.equal(b1Style.borderTopRightRadius, '8px')
      assert.equal(b1Style.borderBottomRightRadius, '8px')

      // Middle button: all corners inner corner (8px)
      assert.equal(b2Style.borderTopLeftRadius, '8px')
      assert.equal(b2Style.borderBottomLeftRadius, '8px')
      assert.equal(b2Style.borderTopRightRadius, '8px')
      assert.equal(b2Style.borderBottomRightRadius, '8px')

      // Last button: left side inner corner (8px), right side round (20px)
      assert.equal(b3Style.borderTopLeftRadius, '8px')
      assert.equal(b3Style.borderBottomLeftRadius, '8px')
      assert.equal(b3Style.borderTopRightRadius, '20px')
      assert.equal(b3Style.borderBottomRightRadius, '20px')
    }
  }).tags(['@md', '@button-group'])

  test('selected button in connected group has all 4 corners round', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1" toggle>1</ui-button>
        <ui-button id="b2" toggle selected>2</ui-button>
        <ui-button id="b3" toggle>3</ui-button>
      </ui-button-group>
    `)
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b2)

    if (b2) {
      const b2Style = window.getComputedStyle(b2)
      assert.equal(b2Style.borderTopLeftRadius, '20px')
      assert.equal(b2Style.borderTopRightRadius, '20px')
      assert.equal(b2Style.borderBottomLeftRadius, '20px')
      assert.equal(b2Style.borderBottomRightRadius, '20px')
    }
  }).tags(['@md', '@button-group'])

  test('selected first button in connected group has all 4 corners round', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1" toggle selected>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
        <ui-button id="b3" toggle>3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    assert.isNotNull(b1)

    if (b1) {
      const b1Style = window.getComputedStyle(b1)
      assert.equal(b1Style.borderTopLeftRadius, '20px')
      assert.equal(b1Style.borderTopRightRadius, '20px')
      assert.equal(b1Style.borderBottomLeftRadius, '20px')
      assert.equal(b1Style.borderBottomRightRadius, '20px')
    }
  }).tags(['@md', '@button-group'])

  test('selected last button in connected group has all 4 corners round', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1" toggle>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
        <ui-button id="b3" toggle selected>3</ui-button>
      </ui-button-group>
    `)
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b3)

    if (b3) {
      const b3Style = window.getComputedStyle(b3)
      assert.equal(b3Style.borderTopLeftRadius, '20px')
      assert.equal(b3Style.borderTopRightRadius, '20px')
      assert.equal(b3Style.borderBottomLeftRadius, '20px')
      assert.equal(b3Style.borderBottomRightRadius, '20px')
    }
  }).tags(['@md', '@button-group'])

  test('single button in connected group has all 4 corners round', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1">1</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    assert.isNotNull(b1)

    if (b1) {
      const b1Style = window.getComputedStyle(b1)
      assert.equal(b1Style.borderTopLeftRadius, '20px')
      assert.equal(b1Style.borderTopRightRadius, '20px')
      assert.equal(b1Style.borderBottomLeftRadius, '20px')
      assert.equal(b1Style.borderBottomRightRadius, '20px')
    }
  }).tags(['@md', '@button-group'])

  test('sets correct corner radii for size xs in connected group', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="xs">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      const b1Style = window.getComputedStyle(b1)
      const b2Style = window.getComputedStyle(b2)

      // XS: outer radius 16px, inner radius 4px
      assert.equal(b1Style.borderTopLeftRadius, '16px')
      assert.equal(b1Style.borderTopRightRadius, '4px')
      assert.equal(b2Style.borderTopLeftRadius, '4px')
      assert.equal(b2Style.borderTopRightRadius, '16px')
    }
  }).tags(['@md', '@button-group'])

  test('sets correct corner radii for size m in connected group', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="m">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      const b1Style = window.getComputedStyle(b1)
      const b2Style = window.getComputedStyle(b2)

      // M: outer radius 28px, inner radius 8px
      assert.equal(b1Style.borderTopLeftRadius, '28px')
      assert.equal(b1Style.borderTopRightRadius, '8px')
      assert.equal(b2Style.borderTopLeftRadius, '8px')
      assert.equal(b2Style.borderTopRightRadius, '28px')
    }
  }).tags(['@md', '@button-group'])

  test('sets correct corner radii for size l in connected group', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="l">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      const b1Style = window.getComputedStyle(b1)
      const b2Style = window.getComputedStyle(b2)

      // L: outer radius 48px, inner radius 16px
      assert.equal(b1Style.borderTopLeftRadius, '48px')
      assert.equal(b1Style.borderTopRightRadius, '16px')
      assert.equal(b2Style.borderTopLeftRadius, '16px')
      assert.equal(b2Style.borderTopRightRadius, '48px')
    }
  }).tags(['@md', '@button-group'])

  test('sets correct corner radii for size xl in connected group', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="xl">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      const b1Style = window.getComputedStyle(b1)
      const b2Style = window.getComputedStyle(b2)

      // XL: outer radius 68px, inner radius 20px
      assert.equal(b1Style.borderTopLeftRadius, '68px')
      assert.equal(b1Style.borderTopRightRadius, '20px')
      assert.equal(b2Style.borderTopLeftRadius, '20px')
      assert.equal(b2Style.borderTopRightRadius, '68px')
    }
  }).tags(['@md', '@button-group'])

  test('square connected button group has square outer corners for unselected buttons', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s" shape="square">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      const b1Style = window.getComputedStyle(b1)
      const b2Style = window.getComputedStyle(b2)

      // For size s square: both outer and inner corners are 8px
      assert.equal(b1Style.borderTopLeftRadius, '8px')
      assert.equal(b1Style.borderTopRightRadius, '8px')
      assert.equal(b2Style.borderTopLeftRadius, '8px')
      assert.equal(b2Style.borderTopRightRadius, '8px')
    }
  }).tags(['@md', '@button-group'])

  test('single selection deselects other buttons', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1" toggle selected>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      assert.isTrue(b1.selected)
      assert.isFalse(b2.selected)

      b2.click()
      assert.isFalse(b1.selected)
      assert.isTrue(b2.selected)
    }
  }).tags(['@md', '@button-group'])

  test('multi selection allows multiple selected buttons', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s" multiple>
        <ui-button id="b1" toggle selected>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)

    if (b1 && b2) {
      assert.isTrue(b1.selected)
      assert.isFalse(b2.selected)

      b2.click()
      assert.isTrue(b1.selected)
      assert.isTrue(b2.selected)
    }
  }).tags(['@md', '@button-group'])

  test('dynamically changing type updates gap and children', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="standard" size="s">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    assert.equal(window.getComputedStyle(el).gap, '12px')

    el.type = 'connected'
    await el.updateComplete
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    if (b1 && b2) {
      await Promise.all([b1.updateComplete, b2.updateComplete])
      assert.equal(window.getComputedStyle(el).gap, '2px')
      const b1Style = window.getComputedStyle(b1)
      assert.equal(b1Style.getPropertyValue('--ui-button-shape-start-start').trim(), '20px')
      assert.equal(b1Style.getPropertyValue('--ui-button-shape-start-end').trim(), '8px')
    }
  }).tags(['@md', '@button-group'])

  test('dynamically changing size updates children', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected" size="s">
        <ui-button id="b1">1</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    assert.isNotNull(b1)
    if (b1) {
      assert.equal(b1.size, 's')
      el.size = 'xl'
      await el.updateComplete
      await b1.updateComplete
      assert.equal(b1.size, 'xl')
      const b1Style = window.getComputedStyle(b1)
      assert.equal(b1Style.getPropertyValue('--_group-pill-radius').trim(), '68px')
    }
  }).tags(['@md', '@button-group'])

  test('container is not a focusable element and has role="group"', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    assert.equal(el.getAttribute('role'), 'group')
    assert.isFalse(el.hasAttribute('tabindex'))
    const b1 = el.querySelector<UiButtonElement>('#b1')
    assert.isNotNull(b1)
    if (b1) {
      el.focus()
      assert.equal(document.activeElement, b1)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('initial focus lands on first enabled button with tabindex 0', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      assert.equal(b1.tabIndex, 0)
      assert.equal(b2.tabIndex, -1)
      assert.equal(b3.tabIndex, -1)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('skips disabled first button for initial tabindex 0', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1" disabled>1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      assert.isTrue(b1.disabled)
      assert.equal(b2.tabIndex, 0)
      assert.equal(b3.tabIndex, -1)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('arrow keys navigate between buttons and wrap around', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      b1.focus()
      assert.equal(document.activeElement, b1)

      // ArrowRight: b1 -> b2
      b1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      assert.equal(document.activeElement, b2)
      assert.equal(b1.tabIndex, -1)
      assert.equal(b2.tabIndex, 0)
      assert.equal(b3.tabIndex, -1)

      // ArrowDown: b2 -> b3
      b2.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      assert.equal(document.activeElement, b3)
      assert.equal(b2.tabIndex, -1)
      assert.equal(b3.tabIndex, 0)

      // ArrowRight wrap: b3 -> b1
      b3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      assert.equal(document.activeElement, b1)
      assert.equal(b3.tabIndex, -1)
      assert.equal(b1.tabIndex, 0)

      // ArrowLeft wrap: b1 -> b3
      b1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      assert.equal(document.activeElement, b3)
      assert.equal(b1.tabIndex, -1)
      assert.equal(b3.tabIndex, 0)

      // ArrowUp: b3 -> b2
      b3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      assert.equal(document.activeElement, b2)
      assert.equal(b3.tabIndex, -1)
      assert.equal(b2.tabIndex, 0)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('arrow keys skip disabled buttons during navigation', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2" disabled>2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      b1.focus()
      assert.equal(document.activeElement, b1)

      // ArrowRight: skips b2, lands on b3
      b1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      assert.equal(document.activeElement, b3)
      assert.equal(b1.tabIndex, -1)
      assert.equal(b3.tabIndex, 0)

      // ArrowRight wrap: skips b2, lands on b1
      b3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      assert.equal(document.activeElement, b1)
      assert.equal(b3.tabIndex, -1)
      assert.equal(b1.tabIndex, 0)

      // ArrowLeft: skips b2, lands on b3
      b1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      assert.equal(document.activeElement, b3)
      assert.equal(b1.tabIndex, -1)
      assert.equal(b3.tabIndex, 0)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('Home and End keys jump to first and last enabled buttons', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
        <ui-button id="b4" disabled>4</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      b2.focus()
      assert.equal(document.activeElement, b2)

      // End jumps to last enabled button (b3, since b4 is disabled)
      b2.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
      assert.equal(document.activeElement, b3)
      assert.equal(b3.tabIndex, 0)
      assert.equal(b2.tabIndex, -1)

      // Home jumps to first enabled button (b1)
      b3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
      assert.equal(document.activeElement, b1)
      assert.equal(b1.tabIndex, 0)
      assert.equal(b3.tabIndex, -1)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('RTL mode reverses ArrowLeft and ArrowRight direction', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group dir="rtl">
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      b1.focus()
      assert.equal(document.activeElement, b1)

      // In RTL: ArrowLeft moves forward (b1 -> b2)
      b1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      assert.equal(document.activeElement, b2)
      assert.equal(b2.tabIndex, 0)

      // In RTL: ArrowRight moves backward (b2 -> b1)
      b2.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      assert.equal(document.activeElement, b1)
      assert.equal(b1.tabIndex, 0)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('Space and Enter keys select focused toggle button', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected">
        <ui-button id="b1" toggle selected>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    if (b1 && b2) {
      assert.isTrue(b1.selected)
      assert.isFalse(b2.selected)

      b2.focus()
      assert.equal(document.activeElement, b2)

      // Enter selects b2 and deselects b1
      b2.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true }))
      assert.isFalse(b1.selected)
      assert.isTrue(b2.selected)

      // ArrowLeft moves back to b1
      b2.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      assert.equal(document.activeElement, b1)

      // Space keydown + keyup selects b1 and deselects b2
      b1.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true }))
      b1.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ', bubbles: true }))
      assert.isTrue(b1.selected)
      assert.isFalse(b2.selected)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('focusin event updates roving tabindex on direct focus', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
        <ui-button id="b3">3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    assert.isNotNull(b3)
    if (b1 && b2 && b3) {
      assert.equal(b1.tabIndex, 0)
      assert.equal(b2.tabIndex, -1)
      assert.equal(b3.tabIndex, -1)

      b3.focus()
      assert.equal(b3.tabIndex, 0)
      assert.equal(b1.tabIndex, -1)
      assert.equal(b2.tabIndex, -1)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('selectedButtons returns currently selected buttons', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group multiple>
        <ui-button id="b1" toggle selected>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
        <ui-button id="b3" toggle selected>3</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b3 = el.querySelector<UiButtonElement>('#b3')
    assert.isNotNull(b1)
    assert.isNotNull(b3)
    if (b1 && b3) {
      assert.deepEqual(el.selectedButtons, [b1, b3])
    }
  }).tags(['@md', '@button-group'])

  test('dispatches change event when button selection toggles', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group type="connected">
        <ui-button id="b1" toggle>1</ui-button>
        <ui-button id="b2" toggle>2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    assert.isNotNull(b1)
    if (b1) {
      let changeFired = false
      el.addEventListener('change', () => {
        changeFired = true
      })

      b1.click()
      assert.isTrue(changeFired)
      assert.isTrue(b1.selected)
      assert.deepEqual(el.selectedButtons, [b1])
    }
  }).tags(['@md', '@button-group'])

  test('ignores keyboard navigation when modifier keys are pressed', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    if (b1 && b2) {
      b1.focus()
      assert.equal(document.activeElement, b1)

      const altEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true })
      b1.dispatchEvent(altEvent)
      assert.equal(document.activeElement, b1)
      assert.isFalse(altEvent.defaultPrevented)

      const ctrlEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true, bubbles: true })
      b1.dispatchEvent(ctrlEvent)
      assert.equal(document.activeElement, b1)
      assert.isFalse(ctrlEvent.defaultPrevented)

      const metaEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', metaKey: true, bubbles: true })
      b1.dispatchEvent(metaEvent)
      assert.equal(document.activeElement, b1)
      assert.isFalse(metaEvent.defaultPrevented)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('ignores keyboard navigation when event target is not a group button', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <input id="txt" type="text" />
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const input = el.querySelector<HTMLInputElement>('#txt')
    assert.isNotNull(b1)
    assert.isNotNull(input)
    if (b1 && input) {
      input.focus()
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      input.dispatchEvent(event)
      assert.equal(document.activeElement, input)
      assert.isFalse(event.defaultPrevented)
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('removes tabindex attribute on all buttons when all buttons are disabled', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1" disabled>1</ui-button>
        <ui-button id="b2" disabled>2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    if (b1 && b2) {
      assert.isFalse(b1.hasAttribute('tabindex'))
      assert.isFalse(b2.hasAttribute('tabindex'))
    }
  }).tags(['@md', '@button-group', '@a11y'])

  test('dynamically appended button inherits group properties and roving tabindex', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group size="l" shape="square">
        <ui-button id="b1">1</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    assert.isNotNull(b1)
    if (b1) {
      assert.equal(b1.tabIndex, 0)

      const b2 = document.createElement('ui-button') as UiButtonElement
      b2.id = 'b2'
      b2.textContent = '2'
      el.appendChild(b2)

      // Wait for MutationObserver and slotchange
      await new Promise((resolve) => setTimeout(resolve, 50))
      await el.updateComplete

      assert.equal(b2.size, 'l')
      assert.equal(b2.shape, 'square')
      assert.equal(b2.tabIndex, -1)
      assert.equal(b1.tabIndex, 0)
    }
  }).tags(['@md', '@button-group'])

  test('dynamically removing active button updates roving tabindex to next enabled button', async ({ assert }) => {
    const el = await fixture<UiButtonGroupElement>(html`
      <ui-button-group>
        <ui-button id="b1">1</ui-button>
        <ui-button id="b2">2</ui-button>
      </ui-button-group>
    `)
    const b1 = el.querySelector<UiButtonElement>('#b1')
    const b2 = el.querySelector<UiButtonElement>('#b2')
    assert.isNotNull(b1)
    assert.isNotNull(b2)
    if (b1 && b2) {
      assert.equal(b1.tabIndex, 0)
      assert.equal(b2.tabIndex, -1)

      el.removeChild(b1)

      // Wait for MutationObserver and slotchange
      await new Promise((resolve) => setTimeout(resolve, 50))
      await el.updateComplete

      assert.equal(b2.tabIndex, 0)
    }
  }).tags(['@md', '@button-group', '@a11y'])
})
