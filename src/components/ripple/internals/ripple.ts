/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { html, LitElement, PropertyValues, TemplateResult } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import { Easing } from '../../motion/animation.js'

const PRESS_GROW_MS = 450
const MINIMUM_PRESS_MS = 80
const INITIAL_ORIGIN_SCALE = 0.2
const PADDING = 10
const SOFT_EDGE_MINIMUM_SIZE = 75
const SOFT_EDGE_CONTAINER_RATIO = 0.35
const PRESS_PSEUDO = '::after'
const ANIMATION_FILL = 'forwards'

interface IPoint {
  x: number
  y: number
}

export default class UiRipple extends LitElement {
  @query('.surface') accessor mdRoot!: HTMLElement

  /**
   * @attribute
   */
  @property({ type: Boolean }) accessor unbounded = false

  /**
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor disabled = false

  @state() protected accessor hovered = false

  @state() protected accessor focused = false

  @state() protected accessor pressed = false

  get isPressed(): boolean {
    return this.pressed
  }

  protected rippleSize = ''

  protected rippleScale = ''

  protected initialSize = 0

  private rippleStartEvent?: Event | null

  // protected pressAnimationSignal = createAnimationSignal()

  protected growAnimation: Animation | null = null

  protected delayedEndPressHandle: number | null = null

  protected override render(): TemplateResult {
    return html`<div class="surface ${classMap(this.getRenderRippleClasses())}"></div>`
  }

  /** @soyTemplate */
  protected getRenderRippleClasses(): ClassInfo {
    return {
      hovered: this.hovered,
      focused: this.focused,
      pressed: this.pressed,
      unbounded: this.unbounded,
    }
  }

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed)
    if (changed.has('hovered') || changed.has('focused') || changed.has('pressed')) {
      this.manageActivated()
    }
  }

  protected override update(changedProps: PropertyValues<this>): void {
    if (changedProps.has('disabled') && this.disabled) {
      this.endHover()
      this.endFocus()
      this.endPress()
    }
    super.update(changedProps)
  }

  protected getDimensions(): DOMRect {
    return (this.parentElement ?? this).getBoundingClientRect()
  }

  protected determineRippleSize(): void {
    const { height, width } = this.getDimensions()
    const maxDim = Math.max(height, width)
    const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE)

    let initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE)

    const hypotenuse = Math.sqrt(width ** 2 + height ** 2)
    const maxRadius = hypotenuse + PADDING

    // ensure `initialSize` is even for unbounded
    if (this.unbounded) {
      initialSize -= initialSize % 2
    }

    this.initialSize = initialSize
    this.rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`
    this.rippleSize = `${this.initialSize}px`
  }

  protected getNormalizedPointerEventCoords(pointerEvent: PointerEvent): IPoint {
    const { scrollX, scrollY } = window
    const { left, top } = this.getDimensions()
    const documentX = scrollX + left
    const documentY = scrollY + top
    const { pageX, pageY } = pointerEvent
    return { x: pageX - documentX, y: pageY - documentY }
  }

  protected getTranslationCoordinates(positionEvent?: Event | null): { startPoint: IPoint; endPoint: IPoint } {
    const { height, width } = this.getDimensions()
    // end in the center
    const endPoint = {
      x: (width - this.initialSize) / 2,
      y: (height - this.initialSize) / 2,
    }

    let startPoint
    if (positionEvent instanceof PointerEvent) {
      startPoint = this.getNormalizedPointerEventCoords(positionEvent)
    } else {
      startPoint = {
        x: width / 2,
        y: height / 2,
      }
    }

    // center around start point
    startPoint = {
      x: startPoint.x - this.initialSize / 2,
      y: startPoint.y - this.initialSize / 2,
    }

    return { startPoint, endPoint }
  }

  protected startPressAnimation(positionEvent?: Event | null): void {
    const { mdRoot } = this
    if (!mdRoot) {
      return
    }
    this.pressed = true
    this.growAnimation?.cancel()
    this.determineRippleSize()
    const { startPoint, endPoint } = this.getTranslationCoordinates(positionEvent)
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`

    const growAnimation = mdRoot.animate(
      {
        top: [0, 0],
        left: [0, 0],
        height: [this.rippleSize, this.rippleSize],
        width: [this.rippleSize, this.rippleSize],
        transform: [`translate(${translateStart}) scale(1)`, `translate(${translateEnd}) scale(${this.rippleScale})`],
      },
      {
        pseudoElement: PRESS_PSEUDO,
        duration: PRESS_GROW_MS,
        easing: Easing.STANDARD,
        fill: ANIMATION_FILL,
      }
    )

    this.growAnimation = growAnimation
  }

  private async endPressAnimation() {
    this.rippleStartEvent = undefined
    const animation = this.growAnimation
    let pressAnimationPlayState = Infinity
    if (typeof animation?.currentTime === 'number') {
      pressAnimationPlayState = animation.currentTime
    } else if (animation?.currentTime) {
      pressAnimationPlayState = animation.currentTime.to('ms').value
    }

    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      this.pressed = false
      return
    }

    await new Promise((resolve) => {
      setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState)
    })

    if (this.growAnimation !== animation) {
      // A new press animation was started. The old animation was canceled and
      // should not finish the pressed state.
      return
    }

    this.pressed = false
  }

  beginHover(hoverEvent?: Event): void {
    if ((hoverEvent as PointerEvent)?.pointerType !== 'touch') {
      this.hovered = true
      this.manageActivated()
    }
  }

  endHover(): void {
    this.hovered = false
    this.manageActivated()
  }

  beginFocus(): void {
    this.focused = true
    this.manageActivated()
  }

  endFocus(): void {
    this.focused = false
    this.manageActivated()
  }

  beginPress(positionEvent?: Event | null): void {
    this.pressed = true
    this.rippleStartEvent = positionEvent
    if (this.delayedEndPressHandle !== null) {
      clearTimeout(this.delayedEndPressHandle)
      this.delayedEndPressHandle = null
    }
    this.startPressAnimation(positionEvent)
    this.manageActivated()
  }

  endPress(): void {
    const pressAnimationPlayState = (this.growAnimation?.currentTime ?? Infinity) as number
    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      this.pressed = false
    } else {
      this.delayedEndPressHandle = setTimeout(() => {
        this.pressed = false
        this.delayedEndPressHandle = null
      }, MINIMUM_PRESS_MS - pressAnimationPlayState) as unknown as number
    }
    this.endPressAnimation()
    this.manageActivated()
  }

  protected manageActivated(): void {
    if (this.pressed || this.hovered || this.focused) {
      this.classList.add('activated')
    } else {
      this.classList.remove('activated')
    }
  }
}
