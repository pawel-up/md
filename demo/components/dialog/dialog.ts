import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import '../../../src/components/button/ui-button.js'
import '../../../src/components/icons/ui-icon.js'
import '../../../src/components/dialog/ui-dialog.js'
import '../../../src/components/divider/ui-divider.js'
import '../../../src/components/list/ui-list.js'
import '../../../src/components/list/ui-list-item.js'
import { reactive } from '../../../src/decorators/index.js'
import UiDialog, { type UiDialogClosingReason } from '../../../src/components/dialog/internals/Dialog.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI dialog'

  @reactive() accessor simpleOpened = false

  @reactive() accessor fullOpened = false

  @reactive() accessor overflowOpened = false

  @reactive() accessor formOpened = false

  @reactive() accessor destructiveOpened = false

  @reactive() accessor nonModalOpened = false

  protected openSimple(): void {
    this.simpleOpened = true
  }

  protected basicClosed(e: CustomEvent<UiDialogClosingReason>): void {
    this.simpleOpened = false
    this.reportClosingReason(e.detail)
  }

  protected openFull(): void {
    this.fullOpened = true
  }

  protected fullClosed(e: CustomEvent<UiDialogClosingReason>): void {
    this.fullOpened = false
    this.reportClosingReason(e.detail)
  }

  protected openOverflow(): void {
    this.overflowOpened = true
  }

  protected overflowClosed(e: CustomEvent<UiDialogClosingReason>): void {
    this.overflowOpened = false
    this.reportClosingReason(e.detail)
  }

  protected openForm(): void {
    this.formOpened = true
  }

  protected formClosed(e: CustomEvent<UiDialogClosingReason>): void {
    this.formOpened = false
    this.reportClosingReason(e.detail)
  }

  protected openDestructive(): void {
    this.destructiveOpened = true
  }

  protected destructiveClosed(e: CustomEvent<UiDialogClosingReason>): void {
    this.destructiveOpened = false
    this.reportClosingReason(e.detail)
  }

  protected openNonModal(): void {
    this.nonModalOpened = true
  }

  protected nonModalClosed(e: CustomEvent<UiDialogClosingReason>): void {
    this.nonModalOpened = false
    this.reportClosingReason(e.detail)
  }

  imperativeDialog: UiDialog | null = null

  protected openImperative(): void {
    if (this.imperativeDialog) {
      document.body.removeChild(this.imperativeDialog)
      this.imperativeDialog = null
    }
    const dialog = document.createElement('ui-dialog')
    dialog.textContent = 'This is a dialog content.'
    dialog.dismissLabel = 'Close'
    dialog.confirmLabel = 'OK'
    dialog.open = true
    document.body.appendChild(dialog)
    this.imperativeDialog = dialog
    dialog.addEventListener('close', (e: Event): void => {
      document.body.removeChild(dialog)
      this.imperativeDialog = null
      const event = e as CustomEvent<UiDialogClosingReason>
      this.reportClosingReason(event.detail)
    })
  }

  protected reportClosingReason(reason: UiDialogClosingReason): void {
    if (reason.cancelled) {
      console.log('The dialog was dismissed')
    } else {
      console.log('The dialog was confirmed')
    }
  }

  protected handleInertButton(): void {
    console.log('An inert button was clicked.')
  }

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      ${this.simpleDialog()} ${this.fullDialog()} ${this.overflowDialog()} ${this.formDialog()}
      ${this.destructiveDialog()} ${this.nonModalDialog()} ${this.renderImperativeDialog()}
    `
  }

  simpleDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Simple dialog</h2>
        <ui-button color="filled" @click="${this.openSimple}">Open</ui-button>
        <ui-dialog ?open="${this.simpleOpened}" @close="${this.basicClosed}">
          <p>This is a confirmation dialog content</p>
          <ui-button color="text" slot="button" value="dismiss">Dismiss</ui-button>
        </ui-dialog>
      </section>
    `
  }

  fullDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Full UI dialog</h2>
        <ui-button color="filled" @click="${this.openFull}">Open</ui-button>
        <ui-dialog ?open="${this.fullOpened}" @close="${this.fullClosed}" modal style="--ui-dialog-max-width: 380px">
          <ui-icon slot="icon" icon="deleteOutline"></ui-icon>
          <span slot="title">Reset settings?</span>
          <p>
            This will reset your app preferences back to their default settings. The following accounts will also be
            signed out:
          </p>
          <ui-divider></ui-divider>
          <ui-list>
            <ui-list-item>email1@gmail.com</ui-list-item>
            <ui-list-item>email2@gmail.com</ui-list-item>
          </ui-list>
          <ui-divider></ui-divider>
          <ui-button color="text" slot="button" @click="${this.handleInertButton}">Learn more</ui-button>
          <ui-button color="text" slot="button" value="dismiss">Cancel</ui-button>
          <ui-button color="text" slot="button" value="confirm">Accept</ui-button>
        </ui-dialog>
      </section>
    `
  }

  overflowDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Overflow dialog</h2>
        <p>This dialog contains a lot of content that will overflow the container.</p>
        <ui-button color="filled" @click="${this.openOverflow}">Open</ui-button>
        <ui-dialog
          ?open="${this.overflowOpened}"
          @close="${this.overflowClosed}"
          modal
          style="--ui-dialog-max-width: 400px; --ui-dialog-max-height: 500px;"
        >
          <ui-icon slot="icon" icon="info"></ui-icon>
          <span slot="title">Terms and Conditions</span>
          <div style="overflow-y: auto; max-height: 300px;">
            <h3>1. Introduction</h3>
            <p>
              Welcome to our application. These terms and conditions outline the rules and regulations for the use of
              our software.
            </p>

            <h3>2. User Agreement</h3>
            <p>
              By accessing this application, we assume you accept these terms and conditions. Do not continue to use our
              application if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h3>3. Privacy Policy</h3>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
              information when you use our service. By using our service, you agree to the collection and use of
              information in accordance with our Privacy Policy.
            </p>

            <h3>4. Data Collection</h3>
            <p>
              We collect several different types of information for various purposes to provide and improve our service
              to you. This includes:
            </p>
            <ul>
              <li>
                Personal Data: While using our service, we may ask you to provide us with certain personally
                identifiable information.
              </li>
              <li>Usage Data: We may also collect information on how the service is accessed and used.</li>
              <li>Tracking & Cookies Data: We use cookies and similar tracking technologies to track activity.</li>
            </ul>

            <h3>5. User Responsibilities</h3>
            <p>
              Users are responsible for maintaining the confidentiality of their account information and for all
              activities that occur under their account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Use the service in compliance with applicable laws</li>
            </ul>

            <h3>6. Prohibited Uses</h3>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform acts</li>
              <li>
                To violate any international, federal, provincial, or state regulations, rules, laws, or local
                ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or the intellectual property rights of
                others
              </li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h3>7. Intellectual Property</h3>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive
              property of our company and its licensors. The service is protected by copyright, trademark, and other
              laws.
            </p>

            <h3>8. Termination</h3>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever and without limitation.
            </p>

            <h3>9. Disclaimer</h3>
            <p>
              The information on this application is provided on an "as is" basis. To the fullest extent permitted by
              law, this company excludes all representations, warranties, conditions and terms.
            </p>

            <h3>10. Limitation of Liability</h3>
            <p>
              In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h3>11. Changes to Terms</h3>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision
              is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h3>12. Contact Information</h3>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at support@example.com or
              through our contact form.
            </p>
          </div>
          <ui-button color="text" slot="button" value="dismiss">Decline</ui-button>
          <ui-button color="filled" slot="button" value="confirm">Accept</ui-button>
        </ui-dialog>
      </section>
    `
  }

  formDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Form dialog</h2>
        <p>This dialog contains a form with validation and submit handling.</p>
        <ui-button color="filled" @click="${this.openForm}">Open Form Dialog</ui-button>
        <form @submit="${this.handleFormSubmit}" style="display: contents;">
          <ui-dialog
            ?open="${this.formOpened}"
            @close="${this.formClosed}"
            modal
            style="--ui-dialog-max-width: 500px;"
            submitClose
          >
            <ui-icon slot="icon" icon="info"></ui-icon>
            <span slot="title">User Registration</span>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: 500; color: var(--md-sys-color-on-surface);">Full Name *</span>
                <input
                  type="text"
                  name="fullName"
                  required
                  style="padding: 12px; border: 1px solid var(--md-sys-color-outline); border-radius: 4px; font-size: 14px;"
                  placeholder="Enter your full name"
                />
              </label>

              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: 500; color: var(--md-sys-color-on-surface);">Email *</span>
                <input
                  type="email"
                  name="email"
                  required
                  style="padding: 12px; border: 1px solid var(--md-sys-color-outline); border-radius: 4px; font-size: 14px;"
                  placeholder="Enter your email address"
                />
              </label>

              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: 500; color: var(--md-sys-color-on-surface);">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  style="padding: 12px; border: 1px solid var(--md-sys-color-outline); border-radius: 4px; font-size: 14px;"
                  placeholder="Enter your phone number (optional)"
                />
              </label>

              <label style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: 500; color: var(--md-sys-color-on-surface);">Department</span>
                <select
                  name="department"
                  style="padding: 12px; border: 1px solid var(--md-sys-color-outline); border-radius: 4px; font-size: 14px; background: white;"
                >
                  <option value="">Select a department</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                </select>
              </label>

              <label style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                <input type="checkbox" name="newsletter" style="margin: 0;" />
                <span style="font-size: 14px; color: var(--md-sys-color-on-surface);">
                  Subscribe to our newsletter
                </span>
              </label>

              <label style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" name="terms" required style="margin: 0;" />
                <span style="font-size: 14px; color: var(--md-sys-color-on-surface);">
                  I agree to the <a href="#" style="color: var(--md-sys-color-primary);">Terms and Conditions</a> *
                </span>
              </label>
            </div>

            <ui-button color="text" slot="button" value="dismiss">Cancel</ui-button>
            <ui-button color="filled" slot="button" value="confirm" type="submit">Register</ui-button>
          </ui-dialog>
        </form>
      </section>
    `
  }

  protected handleFormSubmit(e: CustomEvent): void {
    e.preventDefault()

    // Get form data from the event
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    // Convert to regular object for easier handling
    const data: Record<string, string | boolean> = {}
    for (const [key, value] of formData.entries()) {
      if (key === 'newsletter' || key === 'terms') {
        data[key] = value === 'on'
      } else {
        data[key] = value as string
      }
    }

    console.log('Form submitted with data:', data)

    // Simulate form validation
    if (!data.fullName || !data.email) {
      console.error('Required fields are missing')
      return
    }

    if (!data.terms) {
      console.error('Terms and conditions must be accepted')
      return
    }

    // If validation passes, the dialog will close automatically
    console.log('Registration successful!', data)
  }

  renderImperativeDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Imperative dialog</h2>
        <p>This dialog is created using imperative API.</p>
        <ui-button color="filled" @click="${this.openImperative}">Open</ui-button>
      </section>
    `
  }

  destructiveDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Destructive dialog</h2>
        <p>This dialog demonstrates the destructive attribute for dangerous actions.</p>
        <ui-button color="filled" @click="${this.openDestructive}">Open destructive dialog</ui-button>
        <ui-dialog
          ?open="${this.destructiveOpened}"
          @close="${this.destructiveClosed}"
          modal
          confirmLabel="Delete"
          dismissLabel="Cancel"
          destructive
        >
          <ui-icon slot="icon" icon="warning"></ui-icon>
          <span slot="title">Delete Account</span>
          <p>
            Are you sure you want to permanently delete your account? This action cannot be undone and all your data
            will be lost.
          </p>
        </ui-dialog>
      </section>
    `
  }

  nonModalDialog(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Non-modal dialog</h2>
        <p>This dialog demonstrates a non-modal dialog that is centered in the viewport.</p>
        <ui-button color="filled" @click="${this.openNonModal}">Open non-modal dialog</ui-button>
        <ui-dialog
          ?open="${this.nonModalOpened}"
          @close="${this.nonModalClosed}"
          confirmLabel="Got it"
          dismissLabel="Close"
        >
          <ui-icon slot="icon" icon="info"></ui-icon>
          <span slot="title">Non-Modal Information</span>
          <p>
            This is a non-modal dialog. Unlike modal dialogs, you can still interact with the content behind this
            dialog. The dialog is automatically centered in the viewport and maintains the smooth opening animation.
          </p>
          <p>
            Non-modal dialogs are useful for displaying information that doesn't require the user's full attention or
            when you want to allow interaction with the background content.
          </p>
        </ui-dialog>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
