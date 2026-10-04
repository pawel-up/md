import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/group.js'
import styles from './internals/group.styles.js'

/**
 * Material Design 3 Expressive Button Group.
 *
 * Button groups organize buttons and manage their visual appearance, spacing,
 * selection state, and roving tabindex keyboard navigation.
 *
 * Accessibility & Keyboard Navigation:
 * - The group container is not focusable (`role="group"`).
 * - Initial Tab focus lands on the first enabled button in the group.
 * - Arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) navigate between items in the group
 *   with wrapping around ends, skipping disabled items, and RTL support.
 * - `Home` and `End` jump directly to the first and last enabled buttons.
 * - `Space` or `Enter` selects/activates the focused button.
 *
 * Use when:
 * - Organizing related actions into visual groups (standard or connected).
 * - Implementing single or multi-select toggle button sets.
 *
 * Don't use when:
 * - Standalone buttons without visual grouping are needed.
 *
 * @fires change - Fired when the selection state of the group changes via user interaction.
 *
 * @example
 * ```html
 * <!-- Connected toggle group -->
 * <ui-button-group type="connected">
 *   <ui-button toggle>Option 1</ui-button>
 *   <ui-button toggle selected>Option 2</ui-button>
 *   <ui-button toggle>Option 3</ui-button>
 * </ui-button-group>
 *
 * <!-- Standard group with spacing -->
 * <ui-button-group type="standard" size="m">
 *   <ui-button color="tonal">Action 1</ui-button>
 *   <ui-button color="tonal">Action 2</ui-button>
 * </ui-button-group>
 * ```
 */
@customElement('ui-button-group')
export class UiButtonGroupElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button-group': UiButtonGroupElement
  }
}

export type { MdGroupType, MdGroupShape } from './internals/group.js'
