import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { UiDialogClosingReason } from '../../../src/components/dialog/internals/Dialog.js'
import { reactive } from '../../../src/decorators/index.js'
import '../../../src/components/dialog/ui-confirm-dialog.js'
import '../../../src/components/button/ui-button.js'

class ConfirmDialogDemo extends DemoPage {
  override accessor componentName = 'UI Confirm Dialog'

  @reactive() accessor basicDialogOpen = false

  @reactive() accessor deleteDialogOpen = false

  @reactive() accessor customDialogOpen = false

  @reactive() accessor lastResult = ''

  protected openBasicDialog(): void {
    this.basicDialogOpen = true
  }

  protected openDeleteDialog(): void {
    this.deleteDialogOpen = true
  }

  protected openCustomDialog(): void {
    this.customDialogOpen = true
  }

  protected handleBasicClose(e: CustomEvent<UiDialogClosingReason>): void {
    this.basicDialogOpen = false
    this.updateResult('Basic Dialog', e.detail)
  }

  protected handleDeleteClose(e: CustomEvent<UiDialogClosingReason>): void {
    this.deleteDialogOpen = false
    this.updateResult('Delete Dialog', e.detail)
  }

  protected handleCustomClose(e: CustomEvent<UiDialogClosingReason>): void {
    this.customDialogOpen = false
    this.updateResult('Custom Dialog', e.detail)
  }

  private updateResult(dialogType: string, detail: UiDialogClosingReason): void {
    const action = detail.cancelled ? 'dismissed' : 'confirmed'
    this.lastResult = `${dialogType} was ${action}`
  }

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      <h1>Confirm Dialog Demo</h1>

      <section class="demo-section">
        <h2>Basic Confirm Dialog</h2>
        <p>A simple confirmation dialog with default button labels.</p>
        <div class="button-group">
          <ui-button color="filled" @click="${this.openBasicDialog}">Open Basic Dialog</ui-button>
        </div>

        <ui-confirm-dialog .open="${this.basicDialogOpen}" @close="${this.handleBasicClose}">
          <span slot="title">Confirm Action</span>
          <p>Are you sure you want to proceed with this action?</p>
        </ui-confirm-dialog>
      </section>

      <section class="demo-section">
        <h2>Delete Confirmation Dialog</h2>
        <p>A confirmation dialog with custom button labels for a destructive action.</p>
        <div class="button-group">
          <ui-button color="filled" @click="${this.openDeleteDialog}">Delete Item</ui-button>
        </div>

        <ui-confirm-dialog
          confirmLabel="Delete"
          dismissLabel="Keep"
          destructive
          .open="${this.deleteDialogOpen}"
          @close="${this.handleDeleteClose}"
        >
          <span slot="title">Delete Item</span>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <p><strong>This will permanently remove the item from your account.</strong></p>
        </ui-confirm-dialog>
      </section>

      <section class="demo-section">
        <h2>Custom Styled Dialog</h2>
        <p>A confirmation dialog with custom button labels for a specific workflow.</p>
        <div class="button-group">
          <ui-button color="filled" @click="${this.openCustomDialog}">Save & Exit</ui-button>
        </div>

        <ui-confirm-dialog
          confirmLabel="Save & Exit"
          dismissLabel="Continue Editing"
          .open="${this.customDialogOpen}"
          @close="${this.handleCustomClose}"
        >
          <span slot="title">Save Changes</span>
          <p>You have unsaved changes in your document.</p>
          <p>Would you like to save your changes before exiting?</p>
        </ui-confirm-dialog>
      </section>

      ${this.lastResult
        ? html`
            <section class="demo-section">
              <h2>Last Action Result</h2>
              <div class="result">${this.lastResult}</div>
            </section>
          `
        : ''}
    `
  }
}

const instance = new ConfirmDialogDemo()
instance.render()
