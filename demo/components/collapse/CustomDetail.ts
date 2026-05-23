/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { html, css, LitElement, TemplateResult, CSSResult } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import type UiCollapse from '../../../src/components/collapse/internals/Collapse.js'
import '../../../src/components/collapse/ui-collapse.js'

@customElement('custom-detail')
export class CustomDetail extends LitElement {
  static override get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      #trigger {
        padding: 10px 15px;
        background-color: #f3f3f3;
        border: 1px solid #dedede;
        border-radius: 5px;
        font-size: 18px;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-align: left;
      }

      :host([opened]) #trigger {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      ui-collapse {
        border: 1px solid #dedede;
        border-top: none;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        box-shadow:
          0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2);
        padding: 12px;
      }
    `
  }

  /**
   * @attribute
   */
  @property({ type: Boolean }) accessor horizontal: boolean | undefined

  /**
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open: boolean | undefined

  /**
   * @attribute
   */
  @property({ type: Boolean }) accessor noAnimation: boolean | undefined

  get buttonLabel(): string {
    return this.open ? 'Collapse' : 'Expand'
  }

  toggle(): void {
    const node = this.shadowRoot!.querySelector('#collapse') as UiCollapse
    node.toggle()
  }

  override render(): TemplateResult {
    const { open, buttonLabel, horizontal, noAnimation } = this
    return html` <button
        id="trigger"
        @click="${this.toggle}"
        aria-expanded="${open ? 'true' : 'false'}"
        aria-controls="collapse"
      >
        ${buttonLabel}
      </button>
      <ui-collapse id="collapse" ?open="${open}" ?horizontal="${horizontal}" ?noanimation="${noAnimation}" tabindex="0">
        <slot></slot>
      </ui-collapse>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-detail': CustomDetail
  }
}
