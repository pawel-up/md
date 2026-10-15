/*
Copyright 2022 Pawel Psztyc
Licensed under the CC-BY 2.0
*/
import { html, TemplateResult, LitElement, SVGTemplateResult, PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import * as Icons from '../Icons.js'
import { IconType } from '../Icons.js'

/**
 * A Material Design 3 icon component that displays iconography using Material Symbols font ligatures
 * or slotted custom SVG elements.
 *
 * Icons are rendered via the default slot by providing the icon ligature name as text content
 * (e.g., `<ui-icon>settings</ui-icon>`). Alternatively, custom SVG elements can be slotted directly.
 *
 * By default, `aria-hidden="true"` is set to keep icons decorative for assistive technologies,
 * preventing screen readers from announcing the raw ligature name. For semantic or standalone icons
 * requiring announcement, specify `aria-hidden="false"` along with an accessible label (e.g., `aria-label`).
 *
 * Material Symbols variable font axes can be configured using the `--md-icon-settings` CSS custom property
 * to style icons to author's needs, such as `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24` for outlined icons or
 * `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24` for filled icons.
 *
 * Use when:
 * - Rendering Material Symbols or Material Icons font ligatures with consistent sizing and alignment.
 * - Displaying decorative or semantic iconography alongside text in buttons, list items, chips, or cards.
 * - Slotting custom SVG graphics that need standard icon sizing and theme-based coloring (`currentColor`).
 *
 * Don't use when:
 * - An interactive, clickable button with ripple effects and keyboard focus is needed (use `<ui-icon-button>` instead).
 *
 * @example
 * ```html
 * <!-- Standard outlined icon (Material Symbols font ligature) -->
 * <ui-icon>settings</ui-icon>
 *
 * <!-- Outlined icon configured via --md-icon-settings -->
 * <ui-icon style="--md-icon-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;">home</ui-icon>
 *
 * <!-- Filled icon variant -->
 * <ui-icon style="--md-icon-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">favorite</ui-icon>
 *
 * <!-- Accessible icon with label -->
 * <ui-icon aria-hidden="false" aria-label="Warning">warning</ui-icon>
 *
 * <!-- Custom SVG icon -->
 * <ui-icon>
 *   <svg viewBox="0 0 24 24">
 *     <path d="M12 2L2 22h20L12 2z"/>
 *   </svg>
 * </ui-icon>
 * ```
 *
 * @cssprop [--md-icon-size=24px] - The size of the icon (width, height, and font-size).
 * @cssprop [--md-icon-font=Material Symbols Outlined] - The font family used for font ligatures.
 * @cssprop [--md-icon-settings=inherit] - The `font-variation-settings` applied to Material Symbols
 *   (e.g., `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`).
 *
 * @slot - The default slot for font ligatures (icon names) or custom SVG content.
 */
export default class UiIcon extends LitElement {
  private hasIconInternal = false

  private iconValue: SVGTemplateResult | undefined

  /**
   * An icon to be rendered from the ApiIcons library.
   * When incorrect icon is referenced nothing is rendered.
   *
   * This property is no longer recommended to use. Use `slot` for custom SVGs and Material Icons font codes instead.
   *
   * @example
   * ```html
   * <ui-icon>settings</ui-icon>
   * <!-- instead of -->
   * <ui-icon icon="settings"></ui-icon>
   * ```
   *
   * See https://fonts.google.com/icons to find available icons.
   *
   * @attribute
   * @deprecated Use Material Icons font codes instead.
   */
  @property() accessor icon: IconType | undefined

  /**
   * @returns True when the icon was found and is rendered.
   * @deprecated Use `slot` for custom SVGs and Material Icons font codes instead.
   */
  get hasIcon(): boolean {
    return this.hasIconInternal
  }

  /**
   * Sets up accessibility attributes. Defaults `aria-hidden` to `'true'` for decorative icons
   * unless the consumer explicitly specified `aria-hidden="false"`.
   */
  override connectedCallback(): void {
    super.connectedCallback()
    const ariaHidden = this.getAttribute('aria-hidden')
    if (ariaHidden === 'false') {
      // Allow the user to set `aria-hidden="false"` to create an icon that is
      // announced by screen readers.
      this.removeAttribute('aria-hidden')
      return
    }
    // Needed for VoiceOver, which will create a "group" if the element is a
    // sibling to other content.
    this.setAttribute('aria-hidden', 'true')
  }

  /**
   * Updates the icon definition when the `icon` property changes.
   *
   * @param cp Changed properties map.
   */
  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('icon')) {
      this.updateIcon(this.icon)
    }
  }

  /**
   * Maps icon name to it's definition and sets `hasIcon` value.
   *
   * @param name Icon name
   */
  protected updateIcon(name: IconType | undefined): void {
    const icon = (Icons as never)[name as IconType] as SVGTemplateResult | undefined
    this.hasIconInternal = !!icon
    this.iconValue = icon
    this.requestUpdate()
  }

  /**
   * @return Template result for an icon
   */
  override render(): TemplateResult {
    const { hasIcon, iconValue } = this
    if (!hasIcon) {
      return html`<slot></slot>`
    }
    return html`${iconValue}`
  }
}
