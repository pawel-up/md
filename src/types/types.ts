/**
 * Represents an intermediate event target with event map.
 * @internal
 */
interface IntermediateEventTarget<EventMap> extends EventTarget {
  /**
   * Adds an event listener to the element.
   *
   * @param type The type of the event.
   * @param listener The event listener.
   * @param options Options for the event listener.
   */
  addEventListener<K extends keyof EventMap>(
    type: K,
    listener: (event: EventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void

  /**
   * Adds an event listener to the element.
   *
   * @param type The type of the event.
   * @param callback The event listener.
   * @param options Options for the event listener.
   */
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void
}

/**
 * Allows to extend a class by the `EventTarget` and declare events dispatched by the class.
 *
 * These events will be type checked by consumers! That is, when using `addEventListener()`
 *
 * **Example**
 *
 * ```typescript
 * interface ActivityEventMap {
 *   "activity:start": CustomEvent<null>
 * }
 *
 * export class MyClass extends (EventTarget as TypedEventTarget<ActivityEventMap>) {
 * }
 * ```
 */
export type TypedEventTarget<EventMap extends object> = new () => IntermediateEventTarget<EventMap>

/**
 * A mixin that extends a class with event listener capabilities.
 */
export interface TypedEvents<EventMap> {
  /**
   * Adds an event listener to the element.
   *
   * @param type The type of the event.
   * @param listener The event listener.
   * @param options Options for the event listener.
   */
  addEventListener<K extends keyof EventMap>(
    type: K,
    listener: (event: EventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void

  /**
   * Adds an event listener to the element.
   *
   * @param type The type of the event.
   * @param callback The event listener.
   * @param options Options for the event listener.
   */
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void
}
