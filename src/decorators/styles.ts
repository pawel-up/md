import { CSSResult } from 'lit'

const cachedStyles = new WeakSet<CSSResult>()

/**
 * Decorator to adapt static styles to the current theme.
 *
 * @param _target The target of the decorator (unused).
 * @param context The class getter decorator context.
 */
export function adaptStatic(_target: unknown, context: ClassGetterDecoratorContext): void {
  context.addInitializer(function () {
    let { styles } = this as { styles?: CSSResult | CSSResult[] }
    if (!styles) {
      return
    }
    if (!Array.isArray(styles)) {
      styles = [styles]
    }
    styles = styles.filter((i) => !cachedStyles.has(i))
    if (!styles.length) {
      return
    }
    styles.forEach((i) => cachedStyles.add(i))
    const sheets = styles.map((i) => i.styleSheet).filter((i) => !!i)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...sheets]
  })
}
