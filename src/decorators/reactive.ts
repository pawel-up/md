/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Symbol used to store the reactive properties.
 */
const propertiesSymbol = Symbol('properties')

/**
 * Interface for reactive instances.
 *
 * @example
 *
 * ```typescript
 * class MyClass implements ReactiveInstance {
 *   render(): void {
 *     // Render the component
 *   }
 * }
 * ```
 */
export interface ReactiveInstance {
  render(): void
}

/**
 * The PropertyDecorator interface represents a decorator that can be applied to a class property.
 *
 * @example
 *
 * ```typescript
 * class MyClass {
 *   @reactive()
 *   myProperty: string
 * }
 * ```
 */
export interface PropertyDecorator {
  // accessor decorator signature
  <C extends ReactiveInstance, V>(
    target: ClassAccessorDecoratorTarget<C, V>,
    context: ClassAccessorDecoratorContext<C, V>
  ): ClassAccessorDecoratorResult<C, V>
  // setter decorator signature
  <C extends ReactiveInstance, V>(
    target: (value: V) => void,
    context: ClassSetterDecoratorContext<C, V>
  ): (this: C, value: V) => void
}

type StandardPropertyContext<C, V> = ClassAccessorDecoratorContext<C, V> | ClassSetterDecoratorContext<C, V>
type StandardPropertyTarget<C, V> = ClassAccessorDecoratorTarget<C, V> | ((value: V) => void)

/**
 * Reactive decorator that calls the `render()` function when the value of the property change.
 */
export default function reactive(): PropertyDecorator {
  return <C extends ReactiveInstance, V>(
    target: StandardPropertyTarget<C, V>,
    context: StandardPropertyContext<C, V>
  ): any => {
    const { kind, name } = context
    if (kind === 'accessor') {
      // const accessorTarget = target as ClassAccessorDecoratorTarget<C, V>
      return {
        set(this: ReactiveInstance, value: V): void {
          let map = Reflect.get(this, propertiesSymbol)
          if (!map) {
            map = {}
            Reflect.set(this, propertiesSymbol, map)
          }
          if (map[name] === value) {
            return
          }
          if (value === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete map[name]
          } else {
            map[name] = value
          }
          if (typeof this.render === 'function') {
            this.render()
          }
        },

        get(): V {
          const map = Reflect.get(this, propertiesSymbol) || {}
          return map[context.name]
        },

        init(this: ReactiveInstance, initialValue: V): V {
          let map = Reflect.get(this, propertiesSymbol)
          if (!map) {
            map = {}
            Reflect.set(this, propertiesSymbol, map)
          }
          map[name] = initialValue
          return initialValue
        },
      }
    } else if (kind === 'setter') {
      const { name } = context
      return function (this: ReactiveInstance, value: V): void {
        const oldValue = this[name as keyof ReactiveInstance]
        if (value === oldValue) {
          return
        }
        ;(target as (value: V) => void).call(this, value)
        if (typeof this.render === 'function') {
          this.render()
        }
      }
    }
    throw new Error(`Unsupported decorator location: ${kind}`)
  }
}
