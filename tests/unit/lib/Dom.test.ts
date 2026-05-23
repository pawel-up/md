import { test } from '@pawel-up/lupa/testing'
import { css } from 'lit'
import { findElementInShadowRoots, adoptStyles } from '../../../src/lib/Dom.js'

test.group('findElementInShadowRoots', (group) => {
  let container: HTMLDivElement

  group.each.setup(() => {
    container = document.createElement('div')
    container.id = 'test-container'
    document.body.appendChild(container)
  })

  group.each.teardown(() => {
    document.body.removeChild(container)
  })

  test('finds element in document root', ({ assert }) => {
    const element = document.createElement('div')
    element.id = 'test-element'
    container.appendChild(element)

    const fromElement = document.createElement('div')
    container.appendChild(fromElement)

    const result = findElementInShadowRoots('test-element', fromElement)
    assert.equal(result, element)
  }).tags(['@lib', '@dom'])

  test('returns null when element is not found', ({ assert }) => {
    const fromElement = document.createElement('div')
    container.appendChild(fromElement)

    const result = findElementInShadowRoots('non-existent', fromElement)
    assert.isNull(result)
  }).tags(['@lib', '@dom'])

  test('finds element in parent shadow root', ({ assert }) => {
    // Create a custom element with shadow root
    const shadowHost = document.createElement('div')
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    // Add target element to shadow root
    const targetElement = document.createElement('div')
    targetElement.id = 'shadow-element'
    shadowRoot.appendChild(targetElement)

    // Add shadow host to container
    container.appendChild(shadowHost)

    // Create a child element inside the shadow root to search from
    const fromElement = document.createElement('div')
    shadowRoot.appendChild(fromElement)
    const result = findElementInShadowRoots('shadow-element', fromElement)
    assert.ok(result)
    assert.equal(result!.id, 'shadow-element')
  }).tags(['@lib', '@dom'])

  test('finds element in nested shadow roots', ({ assert }) => {
    // Create outer shadow host
    const outerShadowHost = document.createElement('div')
    outerShadowHost.id = 'outer-shadow-host'
    const outerShadowRoot = outerShadowHost.attachShadow({ mode: 'open' })

    // Create inner shadow host inside outer shadow root
    const innerShadowHost = document.createElement('div')
    innerShadowHost.id = 'inner-shadow-host'
    const innerShadowRoot = innerShadowHost.attachShadow({ mode: 'open' })
    outerShadowRoot.appendChild(innerShadowHost)

    // Add target element to outer shadow root
    const targetElement = document.createElement('div')
    targetElement.id = 'nested-element'
    outerShadowRoot.appendChild(targetElement)

    // Add container to document
    container.appendChild(outerShadowHost)

    // Search from element in inner shadow root
    const fromElement = document.createElement('div')
    fromElement.id = 'search-from'
    innerShadowRoot.appendChild(fromElement)

    const result = findElementInShadowRoots('nested-element', fromElement)
    assert.equal(result, targetElement)
  }).tags(['@lib', '@dom'])

  test('searches through multiple shadow root levels', ({ assert }) => {
    // Create a deeply nested shadow structure
    const level1Host = document.createElement('div')
    const level1Shadow = level1Host.attachShadow({ mode: 'open' })

    const level2Host = document.createElement('div')
    const level2Shadow = level2Host.attachShadow({ mode: 'open' })
    level1Shadow.appendChild(level2Host)

    const level3Host = document.createElement('div')
    const level3Shadow = level3Host.attachShadow({ mode: 'open' })
    level2Shadow.appendChild(level3Host)

    // Add target element at level 1
    const targetElement = document.createElement('div')
    targetElement.id = 'deep-element'
    level1Shadow.appendChild(targetElement)

    container.appendChild(level1Host)

    // Search from deepest level
    const fromElement = document.createElement('div')
    level3Shadow.appendChild(fromElement)

    const result = findElementInShadowRoots('deep-element', fromElement)
    assert.equal(result, targetElement)
  }).tags(['@lib', '@dom'])

  test('prefers document element over shadow root element', ({ assert }) => {
    // Create element in document
    const documentElement = document.createElement('div')
    documentElement.id = 'duplicate-id'
    documentElement.textContent = 'document'
    container.appendChild(documentElement)

    // Create shadow host with element with same ID
    const shadowHost = document.createElement('div')
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

    const shadowElement = document.createElement('div')
    shadowElement.id = 'duplicate-id'
    shadowElement.textContent = 'shadow'
    shadowRoot.appendChild(shadowElement)

    container.appendChild(shadowHost)

    const fromElement = document.createElement('div')
    shadowRoot.appendChild(fromElement)

    const result = findElementInShadowRoots('duplicate-id', fromElement)
    assert.equal(result, documentElement)
    assert.isNotNull(result)
    assert.equal(result!.textContent, 'document')
  }).tags(['@lib', '@dom'])

  test('handles elements without parent', ({ assert }) => {
    const isolatedElement = document.createElement('div')

    const result = findElementInShadowRoots('test-id', isolatedElement)
    assert.isNull(result)
  }).tags(['@lib', '@dom'])

  test('handles shadow root host traversal', ({ assert }) => {
    // Create a shadow host
    const shadowHost = document.createElement('div')
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    container.appendChild(shadowHost)

    // Add target element to container (outside shadow)
    const targetElement = document.createElement('div')
    targetElement.id = 'outside-shadow'
    container.appendChild(targetElement)

    // Search from inside shadow root
    const fromElement = document.createElement('div')
    shadowRoot.appendChild(fromElement)

    const result = findElementInShadowRoots('outside-shadow', fromElement)
    assert.equal(result, targetElement)
  }).tags(['@lib', '@dom'])

  test('handles elements in current shadow root', ({ assert }) => {
    const shadowHost = document.createElement('div')
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    container.appendChild(shadowHost)

    // Add target element to same shadow root
    const targetElement = document.createElement('div')
    targetElement.id = 'same-shadow'
    shadowRoot.appendChild(targetElement)

    // Add search element to same shadow root
    const fromElement = document.createElement('div')
    shadowRoot.appendChild(fromElement)

    const result = findElementInShadowRoots('same-shadow', fromElement)
    assert.equal(result, targetElement)
  }).tags(['@lib', '@dom'])

  test('handles complex shadow DOM structure with mixed content', ({ assert }) => {
    // Create complex structure: document -> shadow1 -> regular div -> shadow2
    const shadow1Host = document.createElement('div')
    const shadow1Root = shadow1Host.attachShadow({ mode: 'open' })
    container.appendChild(shadow1Host)

    const regularDiv = document.createElement('div')
    shadow1Root.appendChild(regularDiv)

    const shadow2Host = document.createElement('div')
    const shadow2Root = shadow2Host.attachShadow({ mode: 'open' })
    regularDiv.appendChild(shadow2Host)

    // Add target to shadow1
    const targetElement = document.createElement('div')
    targetElement.id = 'complex-target'
    shadow1Root.appendChild(targetElement)

    // Search from shadow2
    const fromElement = document.createElement('div')
    shadow2Root.appendChild(fromElement)

    const result = findElementInShadowRoots('complex-target', fromElement)
    assert.equal(result, targetElement)
  }).tags(['@lib', '@dom'])

  test('returns null for invalid ID characters', ({ assert }) => {
    const element = document.createElement('div')
    element.id = 'valid-id'
    container.appendChild(element)

    const fromElement = document.createElement('div')
    container.appendChild(fromElement)

    // Test with empty string
    const result1 = findElementInShadowRoots('', fromElement)
    assert.isNull(result1)

    // Test with whitespace
    const result2 = findElementInShadowRoots('   ', fromElement)
    assert.isNull(result2)
  }).tags(['@lib', '@dom'])
})

test.group('adoptStyles', (group) => {
  let originalAdoptedStyleSheets: CSSStyleSheet[] | undefined

  group.each.setup(() => {
    // Save original state
    if (typeof document !== 'undefined') {
      originalAdoptedStyleSheets = document.adoptedStyleSheets
    }
  })

  group.each.teardown(() => {
    // Restore original state
    if (typeof document !== 'undefined') {
      // @ts-expect-error: restoring readonly property for test cleanup
      document.adoptedStyleSheets = originalAdoptedStyleSheets
    }
  })

  test('does nothing if adoptedStyleSheets is not supported', () => {
    // Simulate environment without adoptedStyleSheets
    const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'adoptedStyleSheets')
    // @ts-expect-error: deleting property to simulate missing feature
    delete Document.prototype.adoptedStyleSheets

    try {
      const style = css`
        body {
          color: blue;
        }
      `
      adoptStyles(style)
      // Assert no error is thrown
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(Document.prototype, 'adoptedStyleSheets', originalDescriptor)
      } else {
        // @ts-expect-error: deleting property for cleanup
        delete Document.prototype.adoptedStyleSheets
      }
    }
  }).tags(['@lib', '@dom'])

  test('adopts styles in a supported environment', ({ assert }) => {
    const style = css`
      body {
        color: green;
      }
    `
    adoptStyles(style)

    assert.isTrue(document.adoptedStyleSheets.length > 0)
    // We can't easily check content of adoptedStyleSheets as it depends on implementation,
    // but length check confirms adoption happened.
  }).tags(['@lib', '@dom'])
})
