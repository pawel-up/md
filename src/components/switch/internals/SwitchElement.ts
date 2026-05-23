import { html, SVGTemplateResult, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import CheckedElement from '../../checkbox/internals/CheckedElement.js'
import { check, close } from '../../icons/Icons.js'

export default class SwitchElement extends CheckedElement {
  protected renderOnIcon(): SVGTemplateResult {
    return check
  }

  protected renderOffIcon(): SVGTemplateResult {
    return close
  }

  /**
   * When true it renders the "on" icon
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor onIcon: boolean | undefined

  /**
   * When true it renders the "off" icon
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor offIcon: boolean | undefined

  /**
   * An instance of the `SVGTemplateResult` passed as a property that describes the `off` icon.
   */
  @property({ type: Object }) accessor offIconInstance: SVGTemplateResult | undefined

  /**
   * An instance of the `SVGTemplateResult` passed as a property that describes the `on` icon.
   */
  @property({ type: Object }) accessor onIconInstance: SVGTemplateResult | undefined

  /**
   * Whether any icon is rendered.
   */
  protected get _rendersIcons(): boolean {
    if (this.checked) {
      return !!this.onIcon
    }
    return !!this.offIcon
  }

  protected get _currentIcon(): SVGTemplateResult | TemplateResult {
    if (!this._rendersIcons) {
      return html``
    }
    if (this.checked) {
      const { onIconInstance } = this
      return onIconInstance || this.renderOnIcon()
    }
    const { offIconInstance } = this
    return offIconInstance || this.renderOffIcon()
  }

  protected override render(): TemplateResult {
    const { pressed = false, _rendersIcons } = this
    const surfaceClasses = {
      surface: true,
      pressed,
      withIcon: _rendersIcons,
    }
    return html`
      <div class="${classMap(surfaceClasses)}">
        <div class="container track"></div>
        <div class="state"></div>
        <div class="content">
          <div class="thumb">${this._rendersIcons ? this._iconsTemplate() : html``}</div>
        </div>
      </div>
    `
  }

  protected _iconsTemplate(): TemplateResult {
    return html` <div class="icon">${this._currentIcon}</div> `
  }
}
