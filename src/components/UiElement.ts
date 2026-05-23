/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { LitElement } from 'lit'
import { state } from 'lit/decorators.js'
import {
  ActionController,
  ActionControllerHost,
  BeginPressConfig,
  EndPressConfig,
} from '../controllers/ActionController.js'

/**
 * The base class for all API Client's base UI elements.
 * Only contains logic to be applied to **all** UI elements.
 *
 * @fires action - An event dispatched when the UI element was activated (pointer, keyboard).
 */
export abstract class UiElement extends LitElement implements ActionControllerHost {
  /**
   * ActionController needs to know if the component is disabled, so subclasses
   * must implement a `disabled` property.
   */
  abstract disabled: boolean

  protected actionController = new ActionController(this)

  /**
   * Indicates the component is in the pressed state.
   */
  @state() protected accessor pressed: boolean | undefined

  /**
   * Hook method called when we've confirmed that the gesture is intended to be
   * a press. Subclasses should change the visual state of the control to
   * 'active' at this point, and possibly fire an event. Subclasses should
   * override this method if more needs to be done.
   *
   * @param options `positionEvent` is the Event that is considered the
   * beginning of the press. Null if this was a keyboard interaction.
   */
  beginPress(options: BeginPressConfig): void {
    this.pressed = true
  }

  /**
   * Hook method called when the control goes from a pressed to unpressed
   * state.
   *
   * @param options If `cancelled` is true, means the user canceled the action.
   *    Subclasses which trigger events on endPress() should check the value
   *    of this flag, and modify their behavior accordingly.
   */
  endPress({ cancelled, actionData }: EndPressConfig): void {
    this.pressed = false
    if (!cancelled) {
      this.dispatchEvent(
        new CustomEvent('action', {
          detail: actionData,
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerdown="${this.handlePointerDown}"`
   */
  handlePointerDown(e: PointerEvent): void {
    this.actionController.pointerDown(e)
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerup="${this.handlePointerUp}"`
   */
  handlePointerUp(e: PointerEvent): void {
    this.actionController.pointerUp(e)
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointercancel="${this.handlePointerCancel}"`
   */
  handlePointerCancel(e: PointerEvent): void {
    this.actionController.pointerCancel(e)
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerleave="${this.handlePointerleave}"`
   */
  handlePointerLeave(e: PointerEvent): void {
    this.actionController.pointerLeave(e)
  }

  /**
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerenter="${this.handlePointerEnter}"`
   */
  handlePointerEnter(e: PointerEvent): void {
    // this.actionController.pointerEnter(e)
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@click="${this.handleClick}"`
   */
  handleClick(e: MouseEvent): void {
    this.actionController.click(e)
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@contextmenu="${this.handleContextMenu}"`
   */
  handleContextMenu(): void {
    this.actionController.contextMenu()
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@keydown="${this.handleKeyDown}"`
   */
  handleKeyDown(e: KeyboardEvent): void {
    this.actionController.keyDown(e)
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@keyup="${this.handleKeyUp}"`
   */
  handleKeyUp(e: KeyboardEvent): void {
    this.actionController.keyUp(e)
  }

  /**
   * A common way for an element to notify a change.
   */
  notifyChange(): void {
    this.dispatchEvent(new Event('change'))
  }
}
