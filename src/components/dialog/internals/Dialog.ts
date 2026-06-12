import { html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { property, query, queryAssignedElements, queryAssignedNodes, state } from 'lit/decorators.js'
import { type ClassInfo, classMap } from 'lit/directives/class-map.js'
import { UiElement } from '../../UiElement.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import type UiButton from '../../button/internals/button.js'
import type { TypedEvents } from '../../../types/types.js'
import type { ButtonType } from '../../button/internals/button.js'
import '../../button/ui-button.js'
import { bound } from '../../../decorators/bound.js'

export interface UiDialogClosingReason {
  /**
   * Whether the dialog was cancelled by either activating the `dismiss` button
   * or by pressing escape.
   */
  cancelled: boolean
  /**
   * This is used in cases when the dialog has more complex purpose.
   * This is the value expected from the dialog.
   */
  value?: unknown
}

interface DialogEventMap {
  closing: CustomEvent<UiDialogClosingReason>
  close: CustomEvent<UiDialogClosingReason>
}

/**
 * Styled dialog using a native `<dialog>` element under the hood.
 * Note, since native dialog renders in the top layer it is not necessary
 * to place the dialog in the `<body>`.
 *
 * **Using Buttons**
 *
 * The dialog automatically recognizes buttons with values `confirm` and `dismiss`
 * to close the dialog and dispatch the `close` event. The event has additional
 * closing reason detail.
 *
 * ```javascript
 * <ui-button slot="button" color="text" value="dismiss">Cancel</ui-button>
 * <ui-button slot="button" color="text" value="confirm">Take action</ui-button>
 * ```
 *
 * ```javascript
 * <button value="dismiss">Cancel</button>
 * <button value="confirm">Take action</button>
 * ```
 *
 * The detail object of the `close` event has the following properties:
 * - cancelled - Whether the dialog was cancelled by either activating the `dismiss` button or by pressing escape.
 *
 * The `close` event is only dispatched when the user interact with the dialog. Imperative control of the
 * dialog won't trigger the close button.
 *
 * ** Full example**
 *
 * ```javascript
 * <ui-dialog modal>
 *  <ui-icon slot="icon" icon="delete"></ui-icon>
 *
 *  <span slot="title">Delete photos?</span>
 *  <p>This action will permanently remove the selected pictures from your account.</p>
 *
 *  <ui-button color="text" slot="button" value="dismiss" type="text">Cancel</ui-button>
 *  <ui-button color="text" slot="button" value="confirm" type="text">Confirm</ui-button>
 * </ui-dialog>
 * ```
 *
 * @slot - The slot for the content of the dialog.
 * @slot icon - The slot to place the dialog icon
 * @slot title - The slot to place the dialog title. Do not put elements here, just the text.
 * @slot button - The slot to place the dialog buttons. Use the `confirm` or `dismiss`
 *  buttons to automatically close the dialog.
 * @fires closing - A cancelable, non-bubbling event with the `UiDialogClosingReason` as the detail,
 *  dispatched before the dialog closes. If prevented, the dialog will not close.
 * @fires close - A non-bubbling, non-cancellable event with the `UiDialogClosingReason` as the detail.
 */
export default class UiDialog extends UiElement implements TypedEvents<DialogEventMap> {
  get disabled(): boolean {
    return isDisabled(this)
  }

  /**
   * When set, the button is a disabled state.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  set disabled(value: boolean) {
    const old = isDisabled(this)
    setDisabled(this, value)
    this.requestUpdate('disabled', old)
  }

  /**
   * When set, the dialog will constraint the content to the maximum width and height,
   * forcing it to overflow (show scrollbars).
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor constrain = false

  /**
   * Opens the dialog as modal when toggling dialog's open state.
   *
   * Setting this value after the dialog was opened has no effect.
   *
   * @attribute
   */
  @property({ type: Boolean }) accessor modal = false

  /**
   * Toggles visibility of the dialog.
   * Note, the dialog is opened asynchronously after the update is performed.
   * @attribute
   */
  @property({ type: Boolean }) accessor open = false

  /**
   * Imperative access to create a dismiss button.
   * When set this will render a dismiss button at the end of the buttons line, before the `confirmLabel` button.
   * @attribute
   */
  @property({ type: String }) accessor dismissLabel: string | undefined

  /**
   * Imperative access to create a confirm button.
   * When set this will render a confirm button at the end of the buttons line, after the `dismissLabel` button.
   * @attribute
   */
  @property({ type: String }) accessor confirmLabel: string | undefined

  /**
   * When true, styles the confirm button with error colors to indicate
   * a destructive action (e.g., delete, remove, etc.).
   * @attribute
   */
  @property({ type: Boolean }) accessor destructive = false

  /**
   * Only when `confirmLabel` is set.
   * Defines the value associated with the button's name when it's submitted with the form data.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#value}
   * @attribute
   */
  @property({ type: String }) accessor confirmValue: string | undefined

  /**
   * The type of the confirm button.
   * This is used to set the button's `type` attribute.
   * If not set, the default is `button`.
   * If set to `submit`, the dialog will trigger the form submission on the parent form.
   * @attribute
   */
  @property({ type: String }) accessor confirmType: ButtonType | undefined
  /**
   * When the dialog is wrapped in a form, set this to `true` to close the dialog
   * when the form is submitted.
   *
   * Note that the dialog doesn't perform any validation of the form. It only closes
   * when the form is submitted, regardless of the application logic. The `submit` event
   * is dispatched by the dialog when the form is valid.
   * @attribute
   */
  @property({ type: Boolean }) accessor submitClose: boolean | undefined

  /**
   * A reference to the underlying dialog element.
   */
  @query('dialog') accessor dialog!: HTMLDialogElement

  @state() protected accessor hasIcon = false

  @state() protected accessor hasTitle = false

  @state() protected accessor hasButton = false

  @queryAssignedElements({ flatten: true, slot: 'icon' }) protected accessor icons!: HTMLElement[]

  @queryAssignedNodes({ flatten: true, slot: 'title' }) protected accessor titles!: HTMLElement[]

  @queryAssignedElements({ flatten: true, slot: 'button' }) protected accessor buttons!: HTMLElement[]

  /**
   * To be set by a child class when closing the dialog.
   * This is passed to the close event.
   */
  dialogValue?: unknown

  /**
   * A reference to the parent form element.
   * When a form is found, the dialog will hook into the form's submit event
   * and close the dialog when the form is submitted.
   * Since the `submit` event is dispatched when the form is valid,
   * we can use this to close the dialog and not worry about the form validation.
   */
  #form: HTMLFormElement | null = null

  constructor() {
    super()

    this.addEventListener('click', this.handleClick)
    this.addEventListener('keydown', this.handleKeyDown)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.#form = this.closest('form')
    if (this.#form) {
      this.#form.addEventListener('submit', this.handleFormSubmit)
    }

    this.updateComplete.then(() => {
      this.#controlVisibility()
    })
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.#form) {
      this.#form.removeEventListener('submit', this.handleFormSubmit)
      this.#form = null
    }
  }

  @bound
  protected handleFormSubmit(): void {
    if (this.submitClose) {
      this.handleInteraction('confirm')
    }
  }

  override handleClick(e: MouseEvent): void {
    super.handleClick(e)
    const path = e.composedPath()
    const { buttons } = this
    const button = path.find((i) => buttons.includes(i as HTMLElement)) as HTMLButtonElement | UiButton | undefined
    if (!button) {
      return
    }
    if (button.type === 'submit') {
      // Adds support for forms.
      // When a form's submit button is clicked we yield the flow control to the form.
      // This way the form can handle the submit event.
      return
    }
    const { value = '' } = button
    this.handleInteraction(value as 'dismiss' | 'confirm')
  }

  override handleKeyDown(e: KeyboardEvent): void {
    super.handleKeyDown(e)
    if (e.defaultPrevented) {
      return
    }
    if (e.key === 'Escape') {
      this.handleInteraction('dismiss')
    }
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('open')) {
      this.#controlVisibility()
    }
    super.updated(changedProperties)
  }

  #controlVisibility(): void {
    const { dialog, modal, open } = this
    if (!dialog) {
      return
    }
    if (open) {
      if (this.isConnected && !dialog.open) {
        if (modal) {
          dialog.showModal()
        } else {
          dialog.show()
        }
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }

  #handleSlotChange(): void {
    const { icons, titles, buttons } = this
    this.hasIcon = !!icons && !!icons.length
    this.hasTitle = !!titles && !!titles.length
    this.hasButton = !!buttons && !!buttons.length
  }

  protected handleInteraction(value: 'dismiss' | 'confirm'): void {
    if (!['dismiss', 'confirm'].includes(value)) {
      return
    }

    const detail: UiDialogClosingReason = {
      cancelled: value === 'dismiss',
    }
    if (this.dialogValue !== undefined) {
      detail.value = this.dialogValue
    }

    // Dispatch cancelable closing event first
    const closingEvent = new CustomEvent<UiDialogClosingReason>('closing', {
      cancelable: true,
      composed: false,
      bubbles: false,
      detail,
    })
    const canClose = this.dispatchEvent(closingEvent)

    // Only proceed with closing if the event wasn't canceled
    if (!canClose) {
      return
    }

    this.open = false
    this.dispatchEvent(
      new CustomEvent<UiDialogClosingReason>('close', {
        composed: true,
        detail,
      })
    )
  }

  protected handleDialogClose(): void {
    if (!this.open) {
      return
    }

    const detail: UiDialogClosingReason = {
      cancelled: true,
    }
    if (this.dialogValue !== undefined) {
      detail.value = this.dialogValue
    }

    // Dispatch cancelable closing event first
    const closingEvent = new CustomEvent<UiDialogClosingReason>('closing', {
      cancelable: true,
      composed: false,
      bubbles: false,
      detail,
    })
    const canClose = this.dispatchEvent(closingEvent)

    // Only proceed with closing if the event wasn't canceled
    if (!canClose) {
      // If closing was prevented, reopen the dialog
      this.dialog.showModal()
      return
    }

    this.open = false
    this.dispatchEvent(
      new CustomEvent<UiDialogClosingReason>('close', {
        composed: true,
        detail,
      })
    )
  }

  protected handleDismiss(): void {
    this.handleInteraction('dismiss')
  }

  protected handleConfirm(): void {
    this.handleInteraction('confirm')
  }

  override render(): TemplateResult {
    const { modal } = this
    const dialogClass = modal ? 'modal' : 'non-modal'
    return html`
      <dialog @close="${this.handleDialogClose}" part="dialog" class="${dialogClass}">
        <div class="container">${this.renderContent()}</div>
      </dialog>
    `
  }

  protected renderContent(): TemplateResult[] | TemplateResult {
    return [this.renderIcon(), this.renderTitle(), this.renderBody(), this.renderButtons()]
  }

  protected renderIcon(): TemplateResult {
    const classes: ClassInfo = {
      'icon': true,
      'with-icon': this.hasIcon,
      'destructive': this.destructive,
    }
    return html`
      <div class="${classMap(classes)}" part="icon">
        <slot name="icon" @slotchange="${this.#handleSlotChange}"></slot>
      </div>
    `
  }

  protected renderTitle(): TemplateResult {
    const classes: ClassInfo = {
      'title': true,
      'with-title': this.hasTitle,
    }
    return html`
      <div class="${classMap(classes)}" part="title">
        <slot name="title" @slotchange="${this.#handleSlotChange}"></slot>
      </div>
    `
  }

  protected renderBody(): TemplateResult {
    return html` <div class="content" part="body"><slot></slot></div> `
  }

  protected renderButtons(): TemplateResult {
    const classes: ClassInfo = {
      'buttons': true,
      'with-buttons': this.hasButton || !!this.confirmLabel || !!this.dismissLabel,
    }
    return html`
      <div class="${classMap(classes)}" part="button">
        <slot name="button" @slotchange="${this.#handleSlotChange}"></slot>
        ${this.#renderDismissButton()} ${this.#renderConfirmButton()}
      </div>
    `
  }

  #renderDismissButton(): TemplateResult | typeof nothing {
    const { dismissLabel } = this
    if (!dismissLabel) {
      return nothing
    }
    return html`
      <ui-button
        color="text"
        value="dismiss"
        class="internal-button"
        @click="${this.handleDismiss}"
        part="negative-action"
        >${dismissLabel}</ui-button
      >
    `
  }

  #renderConfirmButton(): TemplateResult | typeof nothing {
    const { confirmLabel, confirmValue = 'confirm', destructive } = this
    if (!confirmLabel) {
      return nothing
    }
    const type = this.confirmType ?? 'button'
    return html`
      <ui-button
        color="text"
        type="${type}"
        value="${confirmValue}"
        class="internal-button"
        ?destructive="${destructive}"
        @click="${this.handleConfirm}"
        part="positive-action"
        >${confirmLabel}</ui-button
      >
    `
  }
}
