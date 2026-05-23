/*
Copyright 2022 Pawel Psztyc
Licensed under the CC-BY 2.0
*/
import { html, TemplateResult, LitElement, SVGTemplateResult, PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import * as Icons from '../Icons.js'
import { IconType } from '../Icons.js'

export default class UiIcon extends LitElement {
  private hasIconInternal = false

  private iconValue: SVGTemplateResult | undefined

  /**
   * An icon to be rendered from the ApiIcons library.
   * When incorrect icon is referenced nothing is rendered.
   * @attribute
   */
  @property() accessor icon: IconType | undefined

  /**
   * @returns True when the icon was found and is rendered.
   */
  get hasIcon(): boolean {
    return this.hasIconInternal
  }

  override connectedCallback() {
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
