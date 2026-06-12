import { html, SVGTemplateResult, TemplateResult, nothing } from 'lit'
import { query } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import CheckedElement from './CheckedElement.js'
import { check, checkIndeterminate } from '../../icons/Icons.js'
import type UiRipple from '../../ripple/internals/ripple.js'
import type { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'

import '../../ripple/ui-ripple.js'
import '../../focus-ring/ui-focus-ring.js'

export default class CheckboxElement extends CheckedElement {
  protected get _icon(): SVGTemplateResult | typeof nothing {
    const { indeterminate, checked } = this
    if (indeterminate) {
      return checkIndeterminate
    }
    if (checked) {
      return check
    }
    return nothing
  }

  @query('ui-ripple') protected accessor ripple!: UiRipple | null

  protected pressRipple(options: BeginPressConfig): void {
    const element = this.ripple
    if (element && !element.isPressed) {
      element.beginPress(options.positionEvent as PointerEvent)
    }
  }

  protected endRipple(): void {
    this.ripple?.endPress()
  }

  override beginPress(options: BeginPressConfig): void {
    super.beginPress(options)
    this.pressRipple(options)
  }

  override endPress(config: EndPressConfig): void {
    super.endPress(config)
    this.endRipple()
  }

  override async handleKeyDown(e: KeyboardEvent): Promise<void> {
    super.handleKeyDown(e)
    if (['Space'].includes(e.code)) {
      this.ripple?.beginPress()
    }
  }

  override async handleKeyUp(e: KeyboardEvent): Promise<void> {
    super.handleKeyUp(e)
    if (['Space'].includes(e.code)) {
      this.ripple?.endPress()
    }
  }

  override handlePointerEnter(e: PointerEvent): void {
    super.handlePointerEnter(e)
    if (this.ripple) {
      this.ripple.beginHover(e)
    }
  }

  override handlePointerLeave(e: PointerEvent): void {
    super.handlePointerLeave(e)
    if (this.ripple) {
      this.ripple.endHover()
    }
  }

  protected override render(): TemplateResult {
    const { pressed = false } = this
    const containerClasses = {
      surface: true,
      pressed,
    }
    return html`
      <ui-focus-ring part="focus-ring" .control="${this as HTMLElement}"></ui-focus-ring>
      <div class=${classMap(containerClasses)}>
        <div class="container"></div>
        <div class="state"></div>
        <ui-ripple class="ripple" unbounded ?disabled="${this.disabled}"></ui-ripple>
        <div class="icon">${this._icon}</div>
      </div>
    `
  }
}
