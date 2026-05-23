import { html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit'
import { cancelEvent } from '@api-client/core/lib/events/Utils.js'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import '../../button/ui-button.js'
import '../../icon-button/ui-icon-button.js'
import '../../icons/ui-icon.js'

/**
 * Snackbars provide brief messages about app processes at the bottom of the screen.
 *
 * Snackbars inform users of a process that an app has performed or will perform.
 * They appear temporarily, towards the bottom of the screen.
 * They shouldn’t interrupt the user experience, and they don’t require user input to disappear.
 *
 * Only one snackbar may be displayed at a time.
 *
 * A snackbar can contain a single action. "Dismiss" or "cancel" actions are optional.
 *
 * Snackbars communicate messages that are minimally interruptive and don’t require user action.
 *
 * **Caution**, Do not use this element directly.
 *
 * A snackbar is the UI to render in the application. It does not care whether another
 * message is already rendered. Use `SnackNotifications` to manage notification system.
 * The `SnackNotifications` will position toasts directly under the `body` which will make
 * it easier to manage especially when relative / absolute positioning is used.
 *
 * @fires open - When the open state changes. Note, this event is not dispatched when it was programmatically closed.
 * @fires dismiss - When the message was closed via the API.
 * @fires action - When the action button was activated.
 */
export class Snackbar extends LitElement {
  /**
   * When set the snackbar does not timeout.
   * It has to be cancelled by user interaction or programmatically.
   *
   * When the `cancellable` is set to false the user won't be able to dismiss the
   * snackbar and the application must remove the snackbar after the process
   * finish. Otherwise another snackbar won't appear.
   *
   * @default false
   * @attribute
   */
  @property({ type: Boolean }) accessor persistent = false

  /**
   * Whether the snackbar can be cancelled via user interaction.
   *
   * @default true
   * @attribute
   */
  @property({ type: Boolean }) accessor cancellable = true

  /**
   * The time in milliseconds after which the message is removed.
   * Has not effect when `persistent` flag is set.
   *
   * @default 5000
   * @attribute
   */
  @property({ type: Number }) accessor timeout = 5000

  /**
   * The action to render next to the message.
   * There can be only one action.
   * It is only rendered when `actionCallback` is set.
   *
   * @attribute
   */
  @property({ type: String }) accessor action: string | undefined

  /**
   * Whether to render affordable "close" icon.
   *
   * @attribute
   */
  @property({ type: Boolean }) accessor close: boolean | undefined

  /**
   * Whether the message is being rendered.
   *
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open: boolean | undefined

  protected dismissed?: boolean

  protected timer?: number

  protected touchXStart?: number

  protected touchYStart?: number

  constructor() {
    super()

    this.addEventListener('touchstart', this.touchstartHandler.bind(this), { passive: true })
    this.addEventListener('touchend', this.touchendHandler.bind(this), { passive: true })
    this.addEventListener('transitionend', this.transitionendHandler.bind(this), { passive: true })
  }

  protected override updated(cp: PropertyValues<this>): void {
    if (cp.has('open')) {
      if (this.open) {
        this.setupTimeout()
      } else {
        this.clearTimer()
      }
    }
  }

  /**
   * Dismisses the snackbar
   */
  dismiss(): void {
    this.dismissed = true
    this.open = false
  }

  protected setupTimeout(): void {
    const { timeout = 5000, persistent } = this
    this.clearTimer()
    if (persistent) {
      return
    }
    this.timer = setTimeout(() => {
      this.timeoutHandler()
    }, timeout) as unknown as number
  }

  protected clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  protected timeoutHandler(): void {
    this.open = false
  }

  protected touchstartHandler(e: TouchEvent): void {
    if (this.cancellable === false) {
      return
    }
    this.touchXStart = e.changedTouches[0].screenX
    this.touchYStart = e.changedTouches[0].screenY
  }

  protected touchendHandler(e: TouchEvent): void {
    if (this.cancellable === false) {
      return
    }
    const { touchXStart, touchYStart } = this
    if (typeof touchXStart !== 'number' || typeof touchYStart !== 'number') {
      return
    }
    this.touchXStart = undefined
    this.touchYStart = undefined
    const endX = e.changedTouches[0].screenX
    const endY = e.changedTouches[0].screenY
    const xDelta = Math.abs(endX - touchXStart)
    const yDelta = Math.abs(endY - touchYStart)
    const threshold = 20
    if (xDelta > threshold || yDelta > threshold) {
      this.open = false
    }
  }

  protected actionHandler(): void {
    this.dispatchEvent(new Event('action'))
    this.dismiss()
  }

  protected transitionendHandler(): void {
    if (!this.dismissed) {
      this.dispatchEvent(new Event('open'))
    } else {
      this.dismissed = false
      this.dispatchEvent(new Event('dismiss'))
    }
  }

  protected closeHandler(): void {
    this.open = false
  }

  protected override render(): TemplateResult {
    const classes = {
      body: true,
      withAction: !!this.action,
      withClose: !!this.close,
    }
    return html`
      <div class="${classMap(classes)}">
        <slot></slot>
      </div>
      ${this.renderAction()} ${this.renderIcon()}
    `
  }

  protected renderAction(): TemplateResult | typeof nothing {
    const { action } = this
    if (!action) {
      return nothing
    }
    return html`
      <ui-button color="text" class="action" @click="${this.actionHandler}" @action="${cancelEvent}"
        >${action}</ui-button
      >
    `
  }

  protected renderIcon(): TemplateResult | typeof nothing {
    const { close } = this
    if (!close) {
      return nothing
    }
    return html`
      <ui-icon-button @click="${this.closeHandler}" class="icon" @action="${cancelEvent}">
        <ui-icon icon="close"></ui-icon>
      </ui-icon-button>
    `
  }
}
