import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { SnackNotifications } from '../../../src/components/notification/SnackNotifications.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI snackbar'

  _actionHandler(): void {
    console.log(`An action was triggered.`)
  }

  simpleHandler(): void {
    SnackNotifications.notify('Simple notification')
  }

  timeoutHandler(): void {
    SnackNotifications.notify('2-seconds notification', 2000)
  }

  closeHandler(): void {
    SnackNotifications.notify('This toast has a close button.', {
      close: true,
      closed() {
        console.log('Close action occurred')
      },
    })
  }

  actionHandler(): void {
    SnackNotifications.notify('This toast is persistent.', {
      actionLabel: 'Click me',
      actionCallback() {
        console.log('Action was called (action)')
      },
      persistent: true,
    })
  }

  closeActionHandler(): void {
    SnackNotifications.notify('Close and action toast message.', {
      actionLabel: 'Click me',
      actionCallback() {
        console.log('Action was called (close and action)')
      },
      close: true,
      closed() {
        console.log('The close & action toast was closed.')
      },
    })
  }

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="title-large">Snackbar</h2>
        <div class="demo-row">
          <ui-button color="filled" @click="${this.simpleHandler}">Simple snackbar</ui-button>
          <ui-button color="filled" @click="${this.timeoutHandler}">2 second snackbar</ui-button>
          <ui-button color="filled" @click="${this.closeHandler}">With close button</ui-button>
          <ui-button color="filled" @click="${this.actionHandler}">With action</ui-button>
          <ui-button color="filled" @click="${this.closeActionHandler}">With action and close button</ui-button>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
