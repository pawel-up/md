import { Snackbar } from '../snackbar/internals/Snackbar.js'
import '../snackbar/ui-snackbar.js'

export interface ISnackInit {
  /**
   * When set the snackbar does not timeout.
   * It has to be cancelled by user interaction or programmatically.
   *
   * When the `cancellable` is set to false the user won't be able to dismiss the
   * snackbar and the application must remove the snackbar after the process
   * finish. Otherwise another snackbar won't appear.
   *
   * @default false
   */
  persistent?: boolean

  /**
   * Whether the snackbar can be cancelled via user interaction.
   *
   * @default true
   */
  cancellable?: boolean

  /**
   * The time in milliseconds after which the message is removed.
   * Has not effect when `persistent` flag is set.
   *
   * @default 5000
   */
  timeout?: number

  /**
   * The action to render next to the message.
   * There can be only one action.
   * It is only rendered when `actionCallback` is set.
   */
  actionLabel?: string

  /**
   * The callback function called when the action was activated by the user.
   */
  actionCallback?: () => void

  /**
   * Whether to render affordable "close" icon.
   */
  close?: boolean

  /**
   * Callback called when the message was closed either by the user interaction
   * or by a timeout.
   * Note, it is not called when the message is closed programmatically.
   */
  closed?: () => void
}

interface INotificationInfo {
  element: Snackbar
  init?: ISnackInit
}

/**
 * A class that manages user notifications via a snackbar (toast messages).
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SnackNotifications {
  protected static current?: INotificationInfo

  protected static stack: INotificationInfo[] = []

  /**
   * Notifies a user about something using default settings.
   * @param message The message to show
   * @param timeout Optionally the timeout after which the message will disappear.
   */
  static notify(message: string, timeout?: number): Snackbar

  /**
   * Notifies the user about something with full configuration options available.
   * @param message The message to show
   * @param init Snack configuration options.
   */
  static notify(message: string, init: ISnackInit): Snackbar

  static notify(message: string, timeoutOrInit?: number | ISnackInit): Snackbar {
    const snack = document.createElement('ui-snackbar')
    snack.innerText = message
    let configInit: ISnackInit | undefined

    if (typeof timeoutOrInit === 'number') {
      snack.timeout = timeoutOrInit
    } else if (timeoutOrInit) {
      const cnf = timeoutOrInit as ISnackInit
      configInit = cnf
      if (typeof cnf.timeout === 'number') {
        snack.timeout = cnf.timeout
      }
      if (typeof cnf.persistent === 'boolean') {
        snack.persistent = cnf.persistent
      }
      if (typeof cnf.close === 'boolean') {
        snack.close = cnf.close
      }
      if (typeof cnf.cancellable === 'boolean') {
        snack.cancellable = cnf.cancellable
      }
      if (cnf.actionLabel && typeof cnf.actionCallback === 'function') {
        snack.action = cnf.actionLabel
      }
    }
    this.stack.push({
      element: snack,
      init: configInit,
    })
    document.body.appendChild(snack)
    snack.addEventListener('action', this.actionHandler.bind(this))
    snack.addEventListener('open', this.openHandler.bind(this))
    snack.addEventListener('dismiss', this.dismissHandler.bind(this))
    setTimeout(() => {
      this.schedule()
    })
    return snack
  }

  protected static schedule(): void {
    if (this.current) {
      return
    }
    const { stack = [] } = this
    const item = stack.shift()
    if (!item) {
      return
    }
    this.current = item
    item.element.open = true
  }

  protected static actionHandler(e: Event): void {
    const target = e.target as Snackbar
    const info = SnackNotifications.current
    if (!info) {
      return
    }
    if (target !== info.element) {
      return
    }
    if (info.init && info.init.actionCallback) {
      info.init.actionCallback()
    }
  }

  protected static openHandler(e: Event): void {
    const target = e.target as Snackbar
    if (target.open) {
      return
    }
    const info = SnackNotifications.current
    if (!info) {
      return
    }
    if (target !== info.element) {
      return
    }
    target.parentElement?.removeChild(target)
    if (info.init && info.init.closed) {
      info.init.closed()
    }
    SnackNotifications.current = undefined
    SnackNotifications.schedule()
  }

  protected static dismissHandler(e: Event): void {
    const target = e.target as Snackbar
    const info = SnackNotifications.current
    if (!info) {
      return
    }
    if (target !== info.element) {
      return
    }
    target.parentElement?.removeChild(target)
    SnackNotifications.current = undefined
    SnackNotifications.schedule()
  }

  static cancel(snack: Snackbar): void {
    if (this.current?.element === snack) {
      if (snack.open) {
        snack.open = false
      } else {
        snack.parentElement?.removeChild(snack)
        this.current = undefined
        SnackNotifications.schedule()
      }
    } else {
      const index = this.stack.findIndex((i) => i.element === snack)
      if (index >= 0) {
        this.stack.splice(index, 1)
      }
    }
  }

  static clear(): void {
    this.stack = []
    if (this.current) {
      this.current.element.parentElement?.removeChild(this.current.element)
      this.current = undefined
    }
  }
}
