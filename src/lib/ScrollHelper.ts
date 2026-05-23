interface ICacheInfo {
  listener: () => void
  nodes: (Document | DocumentFragment)[]
}

const cache = new WeakMap<HTMLElement, ICacheInfo>()

function getRootNodes(from: HTMLElement): (Document | DocumentFragment)[] {
  const result: (Document | DocumentFragment)[] = []

  let node: EventTarget = from
  while (node) {
    if ((node as Node).nodeType === Node.DOCUMENT_FRAGMENT_NODE && (node as ShadowRoot).host) {
      result.push(node as DocumentFragment)
    }
    node = (node as ShadowRoot).host || (node as Element).assignedSlot || (node as Element).parentNode
  }
  result.push(document)
  return result
}

export function addListeners(element: HTMLElement, listener: () => void): void {
  removeListeners(element)
  const nodes = getRootNodes(element)
  nodes.forEach((n) => n.addEventListener('scroll', listener, { capture: true, passive: true }))
  window.addEventListener('resize', listener, { capture: true, passive: true })
  cache.set(element, {
    nodes,
    listener,
  })
}

export function removeListeners(element: HTMLElement): void {
  const info = cache.get(element)
  if (!info) {
    return
  }
  info.nodes.forEach((n) => n.removeEventListener('scroll', info.listener, { capture: true }))
  window.removeEventListener('resize', info.listener, { capture: true })
}
