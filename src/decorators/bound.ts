/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Decorator to bind methods to the class instance.
 *
 * @param _target The target of the decorator (unused).
 * @param context The class member decorator context.
 */
export function bound(_: unknown, { name, addInitializer }: ClassMemberDecoratorContext) {
  addInitializer(function (this: any) {
    this[name] = this[name].bind(this)
  })
}
