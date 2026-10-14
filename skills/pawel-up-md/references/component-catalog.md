# `@pawel-up/md` Component Catalog

Complete API reference, styling hooks, and usage examples for all custom elements and controllers in `@pawel-up/md`.

> **Import Rule**: Always import individual component modules via their subpath export (`@pawel-up/md/<folder>/<element>.js`). Do **not** include `/components/` in the path and do **not** barrel-import `@pawel-up/md`.

---

## 1. Actions

### Button (`<ui-button>`)

**Import:**
```typescript
import '@pawel-up/md/button/ui-button.js'
import '@pawel-up/md/icons/ui-icon.js' // Optional: when rendering an icon in slot="icon"
```

MD3 button supporting 5 emphasis levels (`filled`, `tonal`, `elevated`, `outlined`, `text`), 5 expressive sizes (`xs`–`xl`), shape morphing (`round`, `square`), toggle states, destructive styling, native form submission/reset, and Popover API triggers.

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `color` | `'filled' \| 'tonal' \| 'elevated' \| 'outlined' \| 'text'` | `'filled'` | Visual emphasis style of the button. |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'s'` | Expressive height and padding scale (`xs` = 32px, `s` = 40px, `m` = 56px, `l` = 96px, `xl` = 136px). |
| `shape` | `'round' \| 'square'` | `'round'` | Outer corner shape (`round` = pill, `square` = rounded rectangle matching size token). |
| `type` | `'button' \| 'submit' \| 'reset' \| 'text'` | `'button'` | Button behavior inside `<form>` elements. |
| `toggle` | `boolean` | `false` | Turns the button into a stateful toggle button (`aria-pressed`). |
| `selected` | `boolean` | `false` | Active state when `toggle` is enabled. |
| `destructive` | `boolean` | `false` | Applies error/destructive color tokens (`--md-sys-color-error*`). |
| `trailingicon` (prop: `trailingIcon`) | `boolean` | `false` | Moves `slot="icon"` to the trailing (end) side of the label. |
| `disabled` | `boolean` | `false` | Disables user interaction and removes from tab order. |
| `name` / `value` | `string \| undefined` | `undefined` | Form submission name and value. |
| `form` | `HTMLFormElement \| string \| null` | `undefined` | Associates the button with a form by reference or ID. |
| `popovertarget` (prop: `popoverTarget`) | `string \| undefined` | `undefined` | ID of a `<ui-menu>` or native popover element to control. |
| `popovertargetaction` (prop: `popoverTargetAction`) | `'toggle' \| 'show' \| 'hide'` | `'toggle'` | Action performed on the target popover. |
| `inwardFocus` | `boolean` | `false` | Renders the focus ring inside the button border instead of outside. |

**Slots:**
- `(default)`: Button text label.
- `icon`: Leading (or trailing when `trailingicon` is set) `<ui-icon>`.

**Events:**
- `action` (`CustomEvent`): Dispatched when activated via click, `Enter`, or `Space`.
- `toggle` (`Event`): Dispatched when a `toggle` button changes its `selected` state.
- `change` (`Event`): Dispatched on state change.

**Styling Hooks (CSS Custom Properties):**
- `--md-button-icon-size` (default: `20px`, scales with `size`)
- `--md-button-outline-color` (default: `var(--md-sys-color-outline-variant)`)
- `--ui-button-shape-start-start`, `--ui-button-shape-start-end`, `--ui-button-shape-end-start`, `--ui-button-shape-end-end`

**Example Usage:**
```html
<!-- Emphasis variants -->
<ui-button color="filled">Save Changes</ui-button>
<ui-button color="tonal">
  <ui-icon slot="icon">edit</ui-icon>
  Edit Draft
</ui-button>
<ui-button color="elevated">Share</ui-button>
<ui-button color="outlined" trailingicon>
  Next Step
  <ui-icon slot="icon">arrow_forward</ui-icon>
</ui-button>
<ui-button color="text">Cancel</ui-button>

<!-- Destructive button -->
<ui-button color="filled" destructive>
  <ui-icon slot="icon">delete</ui-icon>
  Delete Account
</ui-button>

<!-- Expressive sizes & shapes -->
<ui-button color="filled" size="m" shape="square">Medium Square</ui-button>
<ui-button color="tonal" size="l" shape="round">Large Expressive</ui-button>

<!-- Stateful toggle button -->
<ui-button color="tonal" toggle selected>
  <ui-icon slot="icon">bookmark</ui-icon>
  Saved
</ui-button>
```

---

### Button Group (`<ui-button-group>`)

**Import:**
```typescript
import '@pawel-up/md/button/ui-button-group.js'
import '@pawel-up/md/button/ui-button.js'
```

MD3 Expressive button group container (`role="group"`). Automatically propagates `size` and `shape` to all child `<ui-button>` elements, manages single or multi-select toggle state, and implements roving `tabindex` with `ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown`/`Home`/`End` keyboard navigation (RTL-aware).

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `type` | `'standard' \| 'connected'` | `'standard'` | `'standard'` spaces buttons apart; `'connected'` joins buttons with a 2px gap, rounding outer group corners and morphing selected buttons into pills. |
| `multiple` | `boolean` | `false` | When `false`, selecting one `toggle` button automatically deselects all others. When `true`, multiple buttons can be selected simultaneously. |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'s'` | Propagated to all child `<ui-button>` elements. |
| `shape` | `'round' \| 'square'` | `'round'` | Propagated to all child `<ui-button>` elements. |
| `buttons` (readonly prop) | `UiButtonElement[]` | `[]` | All child `<ui-button>` elements. |
| `enabledButtons` (readonly prop) | `UiButtonElement[]` | `[]` | Non-disabled child `<ui-button>` elements. |
| `selectedButtons` (readonly prop) | `UiButtonElement[]` | `[]` | Currently selected child `<ui-button>` elements. |

**Slots:**
- `(default)`: One or more `<ui-button>` elements. Add `toggle` to child buttons that participate in selection.

**Events:**
- `change` (`CustomEvent<{ target: UiButtonElement }>`): Dispatched when a child button's selection state changes via user interaction. `e.detail.target` references the toggled `<ui-button>`.

**Example Usage:**
```html
<!-- Connected single-selection (MD3 Expressive Segmented Control) -->
<ui-button-group
  type="connected"
  size="s"
  shape="round"
  @change="${(e: CustomEvent<{ target: UiButtonElement }>) => {
    console.log('Toggled button:', e.detail.target.value, e.detail.target.selected)
  }}"
>
  <ui-button color="tonal" toggle selected value="day">
    <ui-icon slot="icon">calendar_view_day</ui-icon>
    Day
  </ui-button>
  <ui-button color="tonal" toggle value="week">
    <ui-icon slot="icon">calendar_view_week</ui-icon>
    Week
  </ui-button>
  <ui-button color="tonal" toggle value="month">
    <ui-icon slot="icon">calendar_view_month</ui-icon>
    Month
  </ui-button>
</ui-button-group>

<!-- Standard multi-selection formatting toolbar -->
<ui-button-group type="standard" size="s" multiple>
  <ui-button color="outlined" toggle aria-label="Bold">
    <ui-icon slot="icon">format_bold</ui-icon>
  </ui-button>
  <ui-button color="outlined" toggle aria-label="Italic">
    <ui-icon slot="icon">format_italic</ui-icon>
  </ui-button>
  <ui-button color="outlined" toggle aria-label="Underline">
    <ui-icon slot="icon">format_underlined</ui-icon>
  </ui-button>
</ui-button-group>
```

---

### Icon Button (`<ui-icon-button>`)

**Import:**
```typescript
import '@pawel-up/md/icon-button/ui-icon-button.js'
import '@pawel-up/md/icons/ui-icon.js'
```

Compact icon-only button extending `BaseButton`. Supports 5 color styles, 3 width aspect ratios (`default`, `narrow`, `wide`), 5 sizes (`xs`–`xl`), and toggle states with a dedicated `selected` icon slot.

> **Accessibility**: Always provide an `aria-label` on `<ui-icon-button>` since it contains no visible text label.

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `color` | `'standard' \| 'filled' \| 'tonal' \| 'outlined' \| 'elevated'` | `'standard'` | Visual style of the icon button. |
| `width` | `'default' \| 'narrow' \| 'wide'` | `'default'` | Expressive width variant (`narrow` = compact width, `wide` = expanded width). |
| `size` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl'` | `'s'` | Button size scale. |
| `shape` | `'round' \| 'square'` | `'round'` | Corner shape. |
| `toggle` | `boolean` | `false` | Enables toggle behavior (`aria-pressed`). |
| `selected` | `boolean` | `false` | Whether the toggle button is selected. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `popovertarget` | `string \| undefined` | `undefined` | Target popover/menu ID. |

**Slots:**
- `(default)`: Default `<ui-icon>` (shown when unselected, or always if `slot="selected"` is omitted).
- `selected`: `<ui-icon slot="selected">` shown when `toggle` and `selected` are both `true`.

**Styling Hooks:**
- `--md-button-icon-size` (default: `24px`)
- `--ui-icon-button-shape-start-start`, `--ui-icon-button-shape-start-end`, `--ui-icon-button-shape-end-start`, `--ui-icon-button-shape-end-end`

**Example Usage:**
```html
<!-- Standard & Filled Icon Buttons -->
<ui-icon-button color="standard" aria-label="Settings">
  <ui-icon>settings</ui-icon>
</ui-icon-button>

<ui-icon-button color="filled" size="m" width="wide" aria-label="Play">
  <ui-icon>play_arrow</ui-icon>
</ui-icon-button>

<!-- Toggle Icon Button with distinct unselected/selected icons -->
<ui-icon-button color="tonal" toggle aria-label="Favorite">
  <ui-icon>favorite_border</ui-icon>
  <ui-icon slot="selected">favorite</ui-icon>
</ui-icon-button>
```

---

### Floating Action Button & Speed-Dial Menu (`<ui-fab>`)

**Import:**
```typescript
import '@pawel-up/md/fab/ui-fab.js'
import '@pawel-up/md/icon-button/ui-icon-button.js'
import '@pawel-up/md/button/ui-button.js'
import '@pawel-up/md/icons/ui-icon.js'
```

Compositional container for a standalone Floating Action Button (FAB), Extended FAB, or expandable FAB Speed-Dial Menu (2–6 related primary actions). Integrates with `OverlayController` for Escape key and outside-click dismissal, roving `tabindex`, and upward staggered entrance animations.

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `placement` | `'bottom-end' \| 'bottom-start' \| 'top-start' \| 'top-end' \| 'inline'` | `'bottom-end'` | Screen corner positioning (`inline` keeps the FAB in normal document flow). |
| `open` | `boolean` | `false` | Expands or collapses the `slot="menu"` speed-dial actions. |
| `closeOnEscape` (prop only) | `boolean` | `true` | Dismisses the expanded menu when `Escape` is pressed. |
| `closeOnOutsideClick` (prop only) | `boolean` | `true` | Dismisses the expanded menu when clicking outside. |
| `beforeClose` (prop only) | `(reason: OverlayDismissReason) => boolean \| Promise<boolean>` | `undefined` | Guard callback; return `false` to prevent closing. |

**Slots:**
- `(default)` or `trigger`: The primary trigger button (`<ui-icon-button>` for icon FAB or `<ui-button>` for Extended FAB).
- `menu`: 2–6 `<ui-button slot="menu" role="menuitem">` elements representing speed-dial actions.

**Events:**
- `open` (`CustomEvent`): Dispatched when the FAB menu opens.
- `closing` (`CustomEvent<{ reason?: OverlayDismissReason }>`): Cancelable event dispatched before the FAB menu closes.
- `close` (`CustomEvent<{ reason?: OverlayDismissReason }>`): Dispatched when the FAB menu closes.
- `change` (`CustomEvent<{ open: boolean }>`): Dispatched whenever `open` changes.
- `select` (`CustomEvent<{ item: HTMLElement }>`): Dispatched when a `slot="menu"` action button is clicked; the menu closes automatically.

**Styling Hooks:**
- `--md-fab-margin`: Screen edge margin (`16px` on compact/medium, `24px` on expanded+).
- `--md-fab-margin-expanded`: Margin on `>=840px` viewports (default `24px`).
- `--md-fab-z-index`: Stacking order for fixed placements (default `100`).

**Example Usage:**
```html
<!-- 1. Standalone Icon FAB -->
<ui-fab placement="bottom-end">
  <ui-icon-button color="filled" size="m" aria-label="Create item">
    <ui-icon>add</ui-icon>
  </ui-icon-button>
</ui-fab>

<!-- 2. Standalone Extended FAB -->
<ui-fab placement="bottom-end">
  <ui-button color="filled" size="m">
    <ui-icon slot="icon">edit</ui-icon>
    Compose
  </ui-button>
</ui-fab>

<!-- 3. Expandable FAB Speed-Dial Menu -->
<ui-fab
  placement="bottom-end"
  @change="${(e: CustomEvent<{ open: boolean }>) => (this.isOpen = e.detail.open)}"
  @select="${(e: CustomEvent<{ item: HTMLElement }>) => console.log('Selected:', e.detail.item.id)}"
>
  <ui-icon-button
    color="filled"
    size="m"
    aria-label="${this.isOpen ? 'Close quick actions' : 'Open quick actions'}"
  >
    <ui-icon>${this.isOpen ? 'close' : 'add'}</ui-icon>
  </ui-icon-button>

  <ui-button id="new-doc" slot="menu" role="menuitem" color="tonal">
    <ui-icon slot="icon">edit</ui-icon>
    Create Document
  </ui-button>
  <ui-button id="share-team" slot="menu" role="menuitem" color="tonal">
    <ui-icon slot="icon">share</ui-icon>
    Share with Team
  </ui-button>
  <ui-button id="export-file" slot="menu" role="menuitem" color="tonal">
    <ui-icon slot="icon">file_download</ui-icon>
    Export File
  </ui-button>
</ui-fab>
```

---

### Segmented Button (`<ui-segmented-button-set>` & `<ui-segmented-button>`)

**Import:**
```typescript
import '@pawel-up/md/segmented-button/ui-segmented-button-set.js'
import '@pawel-up/md/segmented-button/ui-segmented-button.js'
```

Classic MD3 segmented button set. *(Note: For MD3 Expressive designs, prefer `<ui-button-group type="connected">`.)*

**Attributes & Properties (`<ui-segmented-button-set>`):**
- `multiselect` (`boolean`, default `false`): Allows multiple segments to be selected simultaneously.

**Attributes & Properties (`<ui-segmented-button>`):**
- `selected` (`boolean`, default `false`): Marks the segment as selected (renders a leading checkmark).
- `disabled` (`boolean`, default `false`): Disables the segment.

**Slots (`<ui-segmented-button>`):**
- `(default)`: Segment label text.
- `icon`: Custom `<ui-icon slot="icon">`.

**Events:**
- `select` (`CustomEvent<{ target: SegmentedButton }>` on `<ui-segmented-button-set>`): Fired when a segment is toggled.

**Example Usage:**
```html
<ui-segmented-button-set multiselect>
  <ui-segmented-button selected>
    <ui-icon slot="icon">directions_walk</ui-icon>
    Walk
  </ui-segmented-button>
  <ui-segmented-button>
    <ui-icon slot="icon">directions_transit</ui-icon>
    Transit
  </ui-segmented-button>
  <ui-segmented-button>
    <ui-icon slot="icon">directions_car</ui-icon>
    Drive
  </ui-segmented-button>
</ui-segmented-button-set>
```

---

## 2. Inputs & Form Controls

### Text Fields (`<ui-outlined-text-field>` & `<ui-filled-text-field>`)

**Import:**
```typescript
import '@pawel-up/md/text-field/ui-outlined-text-field.js'
import '@pawel-up/md/text-field/ui-filled-text-field.js'
```

Form-associated custom elements (`ElementInternals`) implementing MD3 Outlined and Filled text fields. Both share the exact same properties, methods, slots, and events, including native `<form>` submission on `Enter` keypress.

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Floating label text (notched in outlined variant when focused/populated). |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search' \| 'date' \| 'time' \| 'datetime-local' \| 'month' \| 'week' \| 'color' \| 'file'` | `'text'` | Underlying `<input>` type. |
| `value` | `string` | `''` | Current input value. Also exposes `valueAsNumber`, `valueAsDate`, and `files`. |
| `name` | `string \| undefined` | `undefined` | Key used in `FormData`. |
| `placeholder` | `string` | `''` | Placeholder text shown when focused and empty. |
| `supportingText` | `string` | `''` | Helper text displayed below the field. |
| `invalid` | `boolean \| undefined` | `undefined` | Displays error styling and swaps `supportingText` with `invalidText`. |
| `invalidText` | `string` | `''` | Error message displayed when `invalid` is `true`. |
| `required` | `boolean` | `false` | Marks the field as required for form validation. |
| `disabled` | `boolean` | `false` | Disables the field. |
| `readOnly` | `boolean` | `false` | Prevents editing while allowing focus and selection. |
| `noFloating` | `boolean` | `false` | Prevents the label from floating; hides label once text is entered. |
| `min` / `max` / `step` | `number \| string` | `''` / `''` / `1` | Numeric/date range constraints. |
| `minLength` / `maxLength` | `number` | `undefined` / `-1` | Character length constraints (renders character counter when `maxLength > 0`). |
| `pattern` | `string` | `''` | Regex validation pattern. |
| `autocomplete` / `inputMode` / `autocapitalize` | `string` | `'off'` | Standard input hints. |

**Methods:**
- `checkValidity(): boolean`
- `reportValidity(): boolean`
- `setCustomValidity(message: string): void`
- `select(): void`
- `setRangeText(...)`, `setSelectionRange(...)`, `stepUp()`, `stepDown()`

**Slots:**
- `prefix`: Leading icon or affix (`<ui-icon slot="prefix">search</ui-icon>`).
- `suffix`: Trailing icon or action (`<ui-icon-button slot="suffix" aria-label="Clear">...</ui-icon-button>`).

**Events:**
- `change` (`Event`): Fired when value changes or on input edit.
- `action` (`CustomEvent`): Fired when `Enter` is pressed inside the input.
- `invalid` (`Event`): Fired when validation fails.

**Styling Hooks:**
- `--md-outlined-text-field-label-active-color` (default: `var(--md-sys-color-primary)`)

**Example Usage:**
```html
<ui-outlined-text-field
  name="email"
  label="Email Address"
  type="email"
  required
  supportingText="We'll never share your email."
>
  <ui-icon slot="prefix">mail</ui-icon>
</ui-outlined-text-field>

<ui-filled-text-field
  name="password"
  label="Password"
  type="password"
  invalid
  invalidText="Password must be at least 8 characters."
>
  <ui-icon slot="prefix">lock</ui-icon>
  <ui-icon-button slot="suffix" aria-label="Show password">
    <ui-icon>visibility</ui-icon>
  </ui-icon-button>
</ui-filled-text-field>
```

---

### Text Area (`<ui-text-area>`)

**Import:**
```typescript
import '@pawel-up/md/text-area/ui-text-area.js'
```

Multi-line form-associated text input extending `TextField`. Supports all `<ui-outlined-text-field>` properties (`label`, `value`, `name`, `supportingText`, `invalid`, `invalidText`, `required`, `disabled`, `readOnly`, `maxLength`, `prefix`/`suffix` slots) plus:

- `rows` (`number | undefined`): Visible text lines.
- `cols` (`number | undefined`): Visible character width.
- `wrap` (`'soft' | 'hard' | undefined`): Text wrapping mode.

**Example Usage:**
```html
<ui-text-area
  name="bio"
  label="Project Description"
  rows="4"
  maxLength="200"
  supportingText="Briefly describe the project goals."
></ui-text-area>
```

---

### Select (`<ui-select>` & `<ui-option>`)

**Import:**
```typescript
import '@pawel-up/md/select/ui-select.js'
import '@pawel-up/md/select/ui-option.js'
```

Form-associated MD3 Select component styled as an outlined text field with a Popover/Anchor-positioned dropdown menu. Supports type-ahead keyboard search, dynamic option label/value updates, `standard` and `vibrant` color variants, and MD3 density levels.

**Attributes & Properties (`<ui-select>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Floating label displayed in the select trigger. |
| `value` | `string \| undefined` | `undefined` | Value of the currently selected `<ui-option>`. |
| `name` | `string \| undefined` | `undefined` | Form submission field name. |
| `required` | `boolean` | `false` | Requires a non-empty selection for form validity. |
| `disabled` | `boolean` | `false` | Disables the select control. |
| `invalid` | `boolean \| undefined` | `undefined` | Forces error state styling. |
| `invalidText` | `string \| undefined` | `undefined` | Error message shown below the select when `invalid` is `true`. |
| `supportingText` | `string \| undefined` | `undefined` | Helper text shown below the select. |
| `open` | `boolean` | `false` | Controls whether the dropdown menu is open. |
| `density` | `'0' \| '-1' \| '-2' \| '-3'` | `'0'` | Dropdown option density (`0` = 48px, `-1` = 44px, `-2` = 40px, `-3` = 36px). |
| `variant` | `'standard' \| 'vibrant'` | `'standard'` | Dropdown surface color scheme (`vibrant` uses tertiary container tokens). |
| `closeOnEscape` (prop only) | `boolean` | `true` | Whether `Escape` closes the dropdown. |
| `closeOnOutsideClick` (prop only) | `boolean` | `true` | Whether clicking outside closes the dropdown. |
| `beforeClose` (prop only) | `BeforeCloseCallback` | `undefined` | Async/sync guard called before closing. |
| `selectedItem` (readonly prop) | `UiOption \| null` | `null` | Reference to the selected `<ui-option>` element. |
| `renderValue` (readonly prop) | `string` | `''` | Display label of the currently selected option. |

**Attributes & Properties (`<ui-option>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `value` | `string \| undefined` | `undefined` | Option value (falls back to text content if omitted). |
| `selected` | `boolean` | `false` | Marks the option as selected. |
| `disabled` | `boolean` | `false` | Disables selecting this option. |
| `lines` | `'one' \| 'two' \| 'three'` | `'one'` | Number of text lines (`two` or `three` when using `supporting-text` / `overline`). |
| `image` | `'icon' \| 'avatar' \| 'image' \| 'video'` | `'icon'` | Sizing preset for `slot="start"`. |

**Slots (`<ui-option>`):**
- `(default)`: Primary option label text (used as `renderValue` in the trigger).
- `start`: Leading visual (`<ui-icon slot="start">`, avatar, or image).
- `end`: Trailing control or icon.
- `end-text`: Trailing metadata text.
- `overline`: Overline text above the headline.
- `supporting-text`: Secondary description below the headline.

**Events (`<ui-select>`):**
- `change` (`CustomEvent<{ value: string | undefined; item: UiOption | null }>`): Fired when user selection changes.
- `open` (`CustomEvent`): Fired when the dropdown opens.
- `closing` (`CustomEvent<{ reason?: OverlayDismissReason }>`): Cancelable event fired before closing.
- `close` (`CustomEvent<{ reason?: OverlayDismissReason }>`): Fired when the dropdown closes.

**Example Usage:**
```html
<ui-select
  name="environment"
  label="Target Environment"
  value="prod"
  required
  supportingText="Choose deployment target"
  density="-1"
  variant="standard"
  @change="${(e: CustomEvent<{ value: string; item: HTMLElement }>) => console.log('Selected:', e.detail.value)}"
>
  <ui-option value="dev" lines="two">
    <ui-icon slot="start">code</ui-icon>
    Development
    <span slot="supporting-text">us-central1 • Ephemeral</span>
  </ui-option>
  <ui-option value="staging" lines="two">
    <ui-icon slot="start">science</ui-icon>
    Staging
    <span slot="supporting-text">us-east1 • Pre-release</span>
  </ui-option>
  <ui-option value="prod" lines="two" selected>
    <ui-icon slot="start">rocket_launch</ui-icon>
    Production
    <span slot="supporting-text">Multi-region • High Availability</span>
  </ui-option>
</ui-select>
```

---

### Checkbox (`<ui-checkbox>`), Radio (`<ui-radio>`), and Switch (`<ui-switch>`)

**Imports:**
```typescript
import '@pawel-up/md/checkbox/ui-checkbox.js'
import '@pawel-up/md/radio/ui-radio.js'
import '@pawel-up/md/switch/ui-switch.js'
```

All three are form-associated custom elements sharing a common `CheckedElement` base class.

**Common Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked/selected state. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `required` | `boolean` | `false` | Requires selection for form validity. |
| `invalid` | `boolean` | `false` | Applies error state styling. |
| `name` | `string \| undefined` | `undefined` | Form field name. For `<ui-radio>`, radios sharing the same `name` automatically synchronize as a mutually exclusive radio group with arrow-key navigation. |
| `value` | `string` | `'on'` | Value submitted in `FormData` when `checked` is `true`. |

**Component-Specific Attributes:**
- **`<ui-checkbox>`**:
  - `indeterminate` (`boolean`, default `false`): Renders the mixed/indeterminate dash state.
- **`<ui-switch>`**:
  - `onIcon` (`boolean`): Renders a checkmark icon inside the thumb when `checked`.
  - `offIcon` (`boolean`): Renders an `×` icon inside the thumb when unchecked.
  - `onIconInstance` / `offIconInstance` (`SVGTemplateResult | undefined`): Custom SVG templates for thumb icons.

**Events:**
- `change` (`Event`): Dispatched when `checked` state changes via user interaction.
- `input` (`Event`): Dispatched on user input.

**Example Usage:**
```html
<!-- Checkbox -->
<label style="display: flex; align-items: center; gap: 8px;">
  <ui-checkbox name="terms" required></ui-checkbox>
  Accept Terms and Conditions
</label>

<!-- Radio Group (synchronized via shared name="plan") -->
<div role="radiogroup" aria-label="Subscription Plan">
  <label><ui-radio name="plan" value="free" checked></ui-radio> Free</label>
  <label><ui-radio name="plan" value="pro"></ui-radio> Pro</label>
  <label><ui-radio name="plan" value="enterprise"></ui-radio> Enterprise</label>
</div>

<!-- Switch with state icons -->
<ui-switch name="notifications" checked onIcon offIcon aria-label="Enable notifications"></ui-switch>
```

---

### Chips (`<ui-chip-set>` & `<ui-chip>`)

**Import:**
```typescript
import '@pawel-up/md/chip/ui-chip-set.js'
import '@pawel-up/md/chip/ui-chip.js'
import '@pawel-up/md/icons/ui-icon.js'
```

Compact elements representing an input, attribute, filter, or action.

**Attributes & Properties (`<ui-chip>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `type` | `'assist' \| 'filter' \| 'input' \| 'suggestion' \| undefined` | `undefined` | MD3 chip role. `'filter'` enables toggle selection (`checked`) with a leading checkmark; `'input'` enables removal (`removable`). |
| `elevated` | `boolean` | `false` | Uses elevated tonal surface container and shadow instead of an outline border. |
| `checked` | `boolean` | `false` | Selected state (used with `type="filter"`). |
| `removable` | `boolean` | `false` | Renders a trailing remove (`×`) button that dispatches `remove`. |
| `disabled` | `boolean` | `false` | Disables the chip. |

**Slots (`<ui-chip>`):**
- `(default)`: Chip label text.
- `icon`: Leading `<ui-icon slot="icon">` (hidden when `type="filter"` is `checked`, replaced by the checkmark).
- `avatar`: Leading circular avatar image (`<img slot="avatar" ...>`).

**Events (`<ui-chip>`):**
- `select` (`Event`): Dispatched when a `type="filter"` chip's `checked` state toggles.
- `remove` (`Event`): Dispatched when the trailing remove icon is clicked on a `removable` or `type="input"` chip.
- `action` (`CustomEvent`): Dispatched when the chip is activated.

**Example Usage:**
```html
<ui-chip-set>
  <!-- Assist Chip -->
  <ui-chip type="assist" elevated>
    <ui-icon slot="icon">calendar_today</ui-icon>
    Add to Itinerary
  </ui-chip>

  <!-- Filter Chips -->
  <ui-chip type="filter" checked>Confirmed</ui-chip>
  <ui-chip type="filter">Pending</ui-chip>

  <!-- Removable Input Chip with Avatar -->
  <ui-chip type="input" removable @remove="${(e: Event) => (e.target as HTMLElement).remove()}">
    <img slot="avatar" src="/avatar.jpg" alt="Jane Doe" />
    Jane Doe
  </ui-chip>
</ui-chip-set>
```

---

### Date Pickers (`<ui-date-picker-input>`, `<ui-date-picker-modal>`, `<ui-date-picker-modal-input>`, `<ui-date-picker-calendar>`)

**Imports:**
```typescript
import '@pawel-up/md/date-picker/ui-date-picker-input.js'
import '@pawel-up/md/date-picker/ui-date-picker-modal.js'
import '@pawel-up/md/date-picker/ui-date-picker-modal-input.js'
import '@pawel-up/md/date-picker/internals/DatePickerCalendar.js'
```

1. **`<ui-date-picker-input>`**: Form-associated outlined text field with a calendar icon button that opens an anchored dropdown calendar.
   - **Attributes/Props**: `label` (`string`), `name` (`string`), `placeholder` (`'MM/DD/YYYY'`), `value` (`Date | null`), `minDate` (`Date`), `maxDate` (`Date`), `disabledDates` (`Date[]`), `locale` (`string`), `dateFormat` (`(date: Date) => string`), `required` (`boolean`), `disabled` (`boolean`), `error` (`boolean`), `errorMessage` (`string`), `open` (`boolean`).
   - **Events**: `change` (`CustomEvent<{ value: Date | null }>`), `closing`, `close`.
2. **`<ui-date-picker-modal>`**: Full MD3 modal dialog for selecting a date range (`{ start: Date | null, end: Date | null }`).
   - **Attributes/Props**: `open` (`boolean`), `title` (`'Select dates'`), `startLabel` (`'Start date'`), `endLabel` (`'End date'`), `selectedRange` (`DateRange | null`), `minDate` (`Date`), `maxDate` (`Date`), `disabledDates` (`Date[]`), `locale` (`string`).
   - **Events**: `date-range-change` (`CustomEvent<{ range: DateRange }>`), `close`.
3. **`<ui-date-picker-modal-input>`**: Modal dialog for keyboard text entry of a single date (`rangeMode = false`) or date range (`rangeMode = true`).
   - **Events**: `date-input-change` (`CustomEvent<{ date?: Date; range?: DateRange }>`), `modal-input-close`.
4. **`<ui-date-picker-calendar>`**: Standalone inline interactive calendar grid.
   - **Attributes/Props**: `selectedDate` (`Date | null`), `rangeSelection` (`boolean`), `rangeStart` (`Date | null`), `rangeEnd` (`Date | null`), `minDate`, `maxDate`, `disabledDates`, `locale`, `showActions` (`boolean`), `okButtonText`, `cancelButtonText`.
   - **Events**: `date-select`, `date-range-select`, `date-range-confirm`, `date-cancel`.

**Example Usage:**
```html
<!-- Single Date Dropdown Input -->
<ui-date-picker-input
  name="birthDate"
  label="Birth Date"
  required
  .minDate="${new Date(1920, 0, 1)}"
  .maxDate="${new Date()}"
  @change="${(e: CustomEvent<{ value: Date | null }>) => console.log('Date:', e.detail.value)}"
></ui-date-picker-input>

<!-- Modal Date Range Picker -->
<ui-date-picker-modal
  ?open="${this.rangeModalOpen}"
  title="Select Trip Dates"
  .selectedRange="${this.tripRange}"
  @date-range-change="${(e: CustomEvent) => (this.tripRange = e.detail.range)}"
  @close="${() => (this.rangeModalOpen = false)}"
></ui-date-picker-modal>
```

---

## 3. Menus, Overlays & Dialogs

### Menu System (`<ui-menu>`, `<ui-sub-menu>`, `<ui-menu-group>`, `<ui-menu-item>`)

**Imports:**
```typescript
import '@pawel-up/md/menu/ui-menu.js'
import '@pawel-up/md/menu/ui-sub-menu.js'
import '@pawel-up/md/menu/ui-menu-group.js'
import '@pawel-up/md/menu/ui-menu-item.js'
```

Built on the native **Popover API** (`popover="auto"`) and **CSS Anchor Positioning** with JavaScript fallback positioning and `OverlayController` stack coordination.

**Key Architectural Rules for Menus:**
1. Give `<ui-menu>` an `id` and `popover="auto"`, and set `popovertarget="<menu-id>"` on the trigger `<ui-button>` or `<ui-icon-button>`.
2. **Flat Submenu Structure**: Never nest `<ui-sub-menu>` inside `<ui-menu-item>`. Instead, place `<ui-sub-menu id="sub-id" anchor="trigger-item-id">` as a sibling inside `<ui-menu>`, and link it from `<ui-menu-item id="trigger-item-id" submenu="sub-id">`.
3. Use `<ui-menu-group aria-label="...">` to group related items with MD3 Expressive 8dp vertical gaps and rounded group corners.

**Attributes & Properties (`<ui-menu>` & `<ui-sub-menu>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `id` | `string` | — | Required for `popovertarget` association. |
| `popover` | `'auto' \| 'manual'` | `'auto'` | Native popover attribute (submenus automatically enforce `'manual'` internally to prevent premature light-dismiss). |
| `open` | `boolean` | `false` | Opens or closes the menu. |
| `anchor` (`<ui-sub-menu>` only) | `string \| undefined` | `undefined` | `id` of the `<ui-menu-item>` that triggers this submenu. |
| `selectOnActivate` | `boolean` | `false` | Automatically marks activated items as `selected` (single-select radio behavior). |
| `multiSelect` (attr: `multiselect`) | `boolean` | `false` | Enables multi-select checkbox behavior (`role="menuitemcheckbox"`), keeping the menu open on item toggle and showing pill selection states. |
| `variant` | `'standard' \| 'vibrant'` | `'standard'` | `'standard'` uses surface container; `'vibrant'` uses primary/tertiary container tokens. |
| `density` | `'0' \| '-1' \| '-2' \| '-3'` | `'0'` | Item height scale (`0` = 48px, `-1` = 44px, `-2` = 40px, `-3` = 36px). |
| `selectedItem` (readonly prop) | `UiMenuItem \| null` | `null` | First currently selected `<ui-menu-item>`. |
| `selectedItems` (readonly prop) | `UiMenuItem[]` | `[]` | All currently selected `<ui-menu-item>` elements. |

**Attributes & Properties (`<ui-menu-item>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `value` | `string \| undefined` | `undefined` | Logical value associated with the item. |
| `selected` | `boolean` | `false` | Marks the item as selected. |
| `showSelectionIcon` | `boolean` | `false` | Automatically renders a checkmark icon when `selected` is `true`. |
| `submenu` | `string \| undefined` | `undefined` | `id` of the `<ui-sub-menu>` controlled by this item (renders trailing submenu arrow). |
| `disabled` | `boolean` | `false` | Disables the item. |
| `lines` | `'one' \| 'two' \| 'three'` | `'one'` | Line count preset. |

**Slots (`<ui-menu-item>`):**
- `(default)`: Primary label text.
- `start`: Leading icon (`<ui-icon slot="start">`).
- `end`: Trailing icon or control.
- `end-text`: Trailing keyboard shortcut or metadata (`<span slot="end-text">⌘S</span>`).
- `overline`: Overline text.
- `supporting-text`: Secondary description.

**Events (`<ui-menu>`):**
- `select` (`CustomEvent<{ item: UiMenuItem; index: number }>`): Fired when a menu item (including inside submenus or groups) is activated.
- `open` (`CustomEvent`), `closing` (`CustomEvent`, cancelable), `close` (`CustomEvent`).

**Styling Hooks:**
- `--md-menu-item-shape` (`4px`), `--md-menu-item-selected-shape` (`12px`), `--md-menu-item-selected-bg`, `--md-menu-item-selected-color`, `--md-menu-item-margin-inline` (`6px`), `--md-menu-item-height` (`48px`).

**Example Usage (Grouped + Nested Submenus + Multi-Select):**
```html
<!-- 1. Grouped Menu with Nested Submenus -->
<ui-button id="file-menu-btn" color="filled" popovertarget="file-menu">File</ui-button>

<ui-menu id="file-menu" popover="auto" density="-1" @select="${(e: CustomEvent) => console.log(e.detail.item.value)}">
  <ui-menu-group aria-label="File Operations">
    <ui-menu-item value="new">
      <ui-icon slot="start">add</ui-icon>
      New File
      <span slot="end-text">⌘N</span>
    </ui-menu-item>
    <ui-menu-item id="export-item" submenu="export-sub">
      <ui-icon slot="start">file_export</ui-icon>
      Export
    </ui-menu-item>
  </ui-menu-group>

  <ui-menu-group aria-label="Session">
    <ui-menu-item value="close">
      <ui-icon slot="start">close</ui-icon>
      Close Workspace
    </ui-menu-item>
  </ui-menu-group>

  <!-- Submenu anchored to #export-item -->
  <ui-sub-menu id="export-sub" anchor="export-item">
    <ui-menu-item value="export-pdf">Export as PDF</ui-menu-item>
    <ui-menu-item value="export-svg">Export as SVG</ui-menu-item>
  </ui-sub-menu>
</ui-menu>

<!-- 2. Multi-Select Menu -->
<ui-button id="columns-btn" color="tonal" popovertarget="columns-menu">Visible Columns</ui-button>
<ui-menu id="columns-menu" popover="auto" multiselect>
  <ui-menu-item value="name" selected>Name</ui-menu-item>
  <ui-menu-item value="status" selected>Status</ui-menu-item>
  <ui-menu-item value="updated">Last Updated</ui-menu-item>
</ui-menu>
```

---

### Dropdown List (`<ui-dropdown-list>`)

**Import:**
```typescript
import '@pawel-up/md/dropdown-list/ui-dropdown-list.js'
```

Structural wrapper that pairs a trigger element in the default slot with an arbitrary overlay element (such as `<ui-listbox>` or `<ui-list>`) in `slot="dropdown"`, managing positioning, focus, and `OverlayController` dismissal.

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `open` | `boolean` | `false` | Opens or closes the dropdown overlay. |
| `verticalAlign` | `'top' \| 'bottom' \| 'middle' \| 'auto'` | `'auto'` | Vertical alignment relative to trigger. |
| `horizontalAlign` | `'left' \| 'right' \| 'center' \| 'auto'` | `'auto'` | Horizontal alignment relative to trigger. |
| `noOverlap` | `boolean` | `false` | Positions the dropdown adjacent to the trigger without covering it. |
| `matchTriggerWidth` | `boolean` | `false` | Sets the dropdown `min-width` to match the trigger's width. |
| `closeOnTab` | `boolean` | `false` | Closes the dropdown when `Tab` is pressed. |

**Slots:**
- `(default)`: Trigger element (e.g., `<ui-button>`).
- `dropdown`: Overlay content (e.g., `<ui-listbox slot="dropdown">`).

**Example Usage:**
```html
<ui-dropdown-list noOverlap matchTriggerWidth>
  <ui-button color="outlined">Choose Action</ui-button>
  <ui-listbox slot="dropdown" selectActive>
    <ui-list-item>Duplicate</ui-list-item>
    <ui-list-item>Move to Folder</ui-list-item>
    <ui-list-item>Archive</ui-list-item>
  </ui-listbox>
</ui-dropdown-list>
```

---

### Dialog (`<ui-dialog>`) & Confirm Dialog (`<ui-confirm-dialog>`)

**Imports:**
```typescript
import '@pawel-up/md/dialog/ui-dialog.js'
import '@pawel-up/md/dialog/ui-confirm-dialog.js'
```

Top-layer dialogs backed by the native `<dialog>` element and `OverlayController`. Automatically wire buttons in `slot="button"` with `value="confirm"` or `value="dismiss"` (or declarative `confirmLabel` / `dismissLabel` attributes) to close the dialog and emit `closing` and `close` events with `{ cancelled, value, reason }`.

**Attributes & Properties:**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `open` | `boolean` | `false` | Opens or closes the dialog. |
| `modal` | `boolean` | `false` (`true` on `<ui-confirm-dialog>`) | Opens via `showModal()` with backdrop scrim and focus trap. |
| `constrain` | `boolean` | `false` | Constrains dialog height/width and makes body content scrollable with dividers. |
| `closeOnOutsideClick` | `boolean` | `false` | Closes the dialog when clicking the backdrop/outside. |
| `closeOnEscape` (prop only) | `boolean` | `true` | Closes the dialog on `Escape` (`cancelled: true`). |
| `beforeClose` (prop only) | `BeforeCloseCallback` | `undefined` | Async/sync guard called before closing; return `false` to prevent dismissal. |
| `confirmLabel` | `string \| undefined` | `undefined` (`'Confirm'` on `<ui-confirm-dialog>`) | Automatically renders a confirm button with this label. |
| `dismissLabel` | `string \| undefined` | `undefined` (`'Cancel'` on `<ui-confirm-dialog>`) | Automatically renders a dismiss button with this label. |
| `destructive` | `boolean` | `false` | Styles the auto-rendered confirm button as destructive (`error` color). |
| `submitClose` | `boolean` | `false` | Submits any `<form>` inside the dialog when confirmed. |

**Slots:**
- `icon`: Optional `<ui-icon slot="icon">` centered above the title.
- `title`: Dialog headline text (`<span slot="title">...</span>`).
- `(default)`: Dialog body content (paragraphs, forms, lists).
- `button`: Custom action buttons (`<ui-button slot="button" color="text" value="dismiss">Cancel</ui-button>`).

**Events:**
- `closing` (`CustomEvent<{ cancelled: boolean; value?: unknown; reason?: OverlayDismissReason }>`): Cancelable event fired before the dialog closes. Call `e.preventDefault()` to block closing.
- `close` (`CustomEvent<{ cancelled: boolean; value?: unknown; reason?: OverlayDismissReason }>`): Fired after user-initiated dismissal or confirmation.

**Styling Hooks:**
- `--ui-dialog-width` (default: `revert`)
- `--ui-dialog-height` (default: `revert`)
- `--ui-dialog-max-width` (default: `90vw`)
- `--ui-dialog-max-height` (default: `90vh`)

**Example Usage:**
```html
<!-- 1. Standard Modal Dialog with Slotted Buttons -->
<ui-dialog
  modal
  constrain
  ?open="${this.dialogOpen}"
  @close="${(e: CustomEvent<{ cancelled: boolean }>) => {
    this.dialogOpen = false
    if (!e.detail.cancelled) this.saveSettings()
  }}"
>
  <ui-icon slot="icon">settings</ui-icon>
  <span slot="title">Workspace Settings</span>
  <p>Configure default permissions for new team members.</p>
  <ui-button slot="button" color="text" value="dismiss">Cancel</ui-button>
  <ui-button slot="button" color="filled" value="confirm">Apply</ui-button>
</ui-dialog>

<!-- 2. Destructive Confirm Dialog -->
<ui-confirm-dialog
  ?open="${this.confirmDeleteOpen}"
  destructive
  confirmLabel="Delete Project"
  dismissLabel="Keep Project"
  @close="${(e: CustomEvent<{ cancelled: boolean }>) => {
    this.confirmDeleteOpen = false
    if (!e.detail.cancelled) this.deleteProject()
  }}"
>
  <ui-icon slot="icon">warning</ui-icon>
  <span slot="title">Delete project permanently?</span>
  <p>This action cannot be undone and all associated datasets will be removed.</p>
</ui-confirm-dialog>
```

---

### Snackbar & Notifications (`SnackNotifications` & `<ui-snackbar>`)

**Import:**
```typescript
import { SnackNotifications } from '@pawel-up/md/notification/SnackNotifications.js'
```

MD3 snackbars must be queued so only one displays at a time. **Always prefer the programmatic `SnackNotifications.notify()` API** over manually mounting `<ui-snackbar>`.

**`SnackNotifications` Static API:**
- `SnackNotifications.notify(message: string, init?: ISnackInit): Snackbar`
- `SnackNotifications.dismiss(): void` — Closes the currently active snackbar.
- `SnackNotifications.clear(): void` — Clears all queued notifications.

**`ISnackInit` Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `5000` | Auto-dismiss duration in ms (ignored when `persistent: true`). |
| `persistent` | `boolean` | `false` | Prevents auto-timeout; requires user interaction or `SnackNotifications.dismiss()`. |
| `cancellable` | `boolean` | `true` | Whether the user can dismiss the snackbar. |
| `actionLabel` | `string` | `undefined` | Text for the optional action button (requires `actionCallback`). |
| `actionCallback` | `() => void` | `undefined` | Invoked when the action button is clicked. |
| `close` | `boolean` | `false` | Renders an explicit trailing close (`×`) icon button. |
| `closed` | `() => void` | `undefined` | Invoked when closed via timeout or user interaction. |

**Example Usage:**
```typescript
import { SnackNotifications } from '@pawel-up/md/notification/SnackNotifications.js'

SnackNotifications.notify('Message archived', {
  timeout: 4000,
  close: true,
  actionLabel: 'Undo',
  actionCallback: () => restoreMessage(),
})
```

---

## 4. Data Display, Navigation & Utilities

### Lists (`<ui-list>`, `<ui-list-item>`, `<ui-expressive-list>`, `<ui-expressive-list-item>`)

**Imports:**
```typescript
// Standard continuous rectangular list
import '@pawel-up/md/list/ui-list.js'
import '@pawel-up/md/list/ui-list-item.js'

// MD3 Expressive pill list (28px rounded items with 2px gap)
import '@pawel-up/md/list/ui-expressive-list.js'
import '@pawel-up/md/list/ui-expressive-list-item.js'
```

Both standard and expressive lists share the same API, keyboard navigation (roving tabindex, `ArrowUp`/`ArrowDown`/`Home`/`End`, type-ahead search), density scale, and collapsible parent-child group support.

**Attributes & Properties (`<ui-list>` & `<ui-expressive-list>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `selectActive` | `boolean` | `false` | Automatically applies the `.select` active state class to clicked/activated items. |
| `collapsible` | `boolean` | `false` | Enables parent-child expand/collapse groups via `id` on parent items and `parent="<id>"` on child items. |
| `density` | `'0' \| '-1' \| '-2' \| '-3'` | `'0'` | Row height density (`0` = 56px, `-1` = 52px, `-2` = 48px, `-3` = 44px for 1-line items). |
| `delegateFocus` | `boolean` | `false` | Delegates focus from the list container to the active item. |

**Attributes & Properties (`<ui-list-item>` & `<ui-expressive-list-item>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `lines` | `'one' \| 'two' \| 'three'` | `'one'` | Row height and text-wrapping mode (`56px`, `72px`, or `88px` at density `0`). |
| `image` | `'icon' \| 'avatar' \| 'image' \| 'video'` | `'icon'` | Leading media preset (`icon` = 24px, `avatar` = 40px circle, `image` = 56×56px square, `video` = 114×64px 16:9). |
| `static` | `boolean` | `false` | Disables hover/ripple/focus interactivity for read-only display rows. |
| `disabled` | `boolean` | `false` | Disables the item. |
| `open` | `boolean` | `false` | On a parent group item (`id="..."`), controls whether child items (`parent="..."`) are expanded. |
| `parent` | `string \| undefined` | `undefined` | `id` of the parent list item in a `collapsible` list. |

**Slots (`<ui-list-item>` & `<ui-expressive-list-item>`):**
- `(default)`: Primary headline text (do **not** use `slot="headline"`—place headline text directly in the default slot).
- `overline`: Overline caption above the headline.
- `supporting-text`: Secondary description below the headline.
- `start`: Leading `<ui-icon>`, avatar badge, `<img>`, or video thumbnail.
- `end`: Trailing interactive control (`<ui-checkbox>`, `<ui-switch>`, `<ui-icon-button>`). Stop pointerdown/click propagation on trailing controls if they shouldn't trigger row selection.
- `end-text`: Trailing metadata text (e.g., timestamps, counts, prices).

**Events (`<ui-list>` & `<ui-expressive-list>`):**
- `select` (`CustomEvent<{ item: UiListItem; index: number }>`): Dispatched when a list item is activated.
- `highlightchange` (`CustomEvent`), `itemschange` (`CustomEvent`).

**Styling Hooks:**
- `--md-list-container-color` (default: `var(--md-sys-color-surface)`)
- `--md-density-offset`, `--md-list-item-height`, `--md-list-item-two-lines-height`, `--md-list-item-three-lines-height`
- `--md-list-item-supporting-text-color`, `--md-list-item-trailing-supporting-text-color`, `--md-list-item-overline-color`

**Example Usage:**
```html
<!-- Expressive List with Leading Media, Supporting Text, and Collapsible Group -->
<ui-expressive-list collapsible selectActive density="0" @select="${(e: CustomEvent) => console.log(e.detail.item)}">
  <!-- Two-line item with avatar and trailing action -->
  <ui-expressive-list-item lines="two" image="avatar">
    <img slot="start" src="/avatars/jane.jpg" alt="Jane Doe" />
    Jane Doe
    <p slot="supporting-text">Lead Systems Architect</p>
    <span slot="end-text">Admin</span>
  </ui-expressive-list-item>

  <!-- Collapsible Parent Group -->
  <ui-expressive-list-item id="security-group" open>
    <ui-icon slot="start">security</ui-icon>
    Security & Access
    <ui-icon-button slot="end" width="narrow" aria-label="Toggle group">
      <ui-icon>keyboard_arrow_up</ui-icon>
    </ui-icon-button>
  </ui-expressive-list-item>

  <!-- Child Items linked via parent="security-group" -->
  <ui-expressive-list-item parent="security-group">
    <ui-icon slot="start">key</ui-icon>
    API Keys
    <span slot="end-text">4 active</span>
  </ui-expressive-list-item>
  <ui-expressive-list-item parent="security-group">
    <ui-icon slot="start">history</ui-icon>
    Audit Logs
  </ui-expressive-list-item>
</ui-expressive-list>
```

---

### Tabs (`<ui-tabs>` & `<ui-tab>`)

**Import:**
```typescript
import '@pawel-up/md/tabs/ui-tabs.js'
import '@pawel-up/md/tabs/ui-tab.js'
import '@pawel-up/md/icons/ui-icon.js'
```

Horizontal navigation tabs with animated active indicator and automatic horizontal scroll buttons when tabs overflow the container.

**Attributes & Properties (`<ui-tabs>`):**
| Attribute / Property | Type | Default | Description |
|----------------------|------|---------|-------------|
| `priority` | `'primary' \| 'secondary'` | `'primary'` | `'primary'` uses a 3px rounded indicator under the label width; `'secondary'` uses a full-width 2px indicator for sub-navigation. Propagated to child `<ui-tab>` elements. |
| `autoActivate` | `boolean` | `false` | When `true`, arrow-key focus movement immediately selects the focused tab. |
| `activeTab` (readonly prop) | `UiTab \| null` | `null` | Currently selected `<ui-tab>`. |
| `activeTabIndex` | `number` | `-1` | Index of the currently selected `<ui-tab>`. |

**Attributes & Properties (`<ui-tab>`):**
- `selected` (`boolean`, default `false`): Marks the tab as active.
- `disabled` (`boolean`, default `false`): Disables the tab.

**Events (`<ui-tabs>`):**
- `change` (`CustomEvent`): Dispatched when the active tab changes. Read `(e.target as UiTabs).activeTabIndex` or `activeTab`.

**Styling Hooks:**
- `--md-tabs-background-color`, `--md-tab-background-color`, `--md-tab-container-shape`
- `--md-primary-tab-label-text-color`, `--md-primary-tab-active-label-text-color`, `--md-primary-tab-active-indicator-height` (`3px`), `--md-primary-tab-active-indicator-shape`
- `--md-secondary-tab-label-text-color`, `--md-secondary-tab-active-label-text-color`, `--md-secondary-tab-active-indicator-height` (`2px`)

**Example Usage:**
```html
<ui-tabs
  priority="primary"
  autoActivate
  @change="${(e: Event) => (this.activeIndex = (e.target as any).activeTabIndex)}"
>
  <ui-tab selected>
    <ui-icon>flight</ui-icon>
    Flights
  </ui-tab>
  <ui-tab>
    <ui-icon>hotel</ui-icon>
    Hotels
  </ui-tab>
  <ui-tab>
    <ui-icon>explore</ui-icon>
    Explore
  </ui-tab>
</ui-tabs>
```

---

### Progress Indicators (`<ui-progress>` & `<ui-circular-progress>`)

**Imports:**
```typescript
import '@pawel-up/md/progress/ui-progress.js'
import '@pawel-up/md/progress/ui-circular-progress.js'
```

Linear (`<ui-progress>`) and circular (`<ui-circular-progress>`) MD3 progress indicators supporting determinate, indeterminate, buffered, thick, and MD3 Expressive wavy animations.

**Attributes & Properties:**
| Attribute / Property | Component | Type | Default | Description |
|----------------------|-----------|------|---------|-------------|
| `value` | Both | `number` | `0` | Current progress value. |
| `min` / `max` / `step` | Both | `number` | `0` / `100` / `1` | Progress range bounds. |
| `indeterminate` | Both | `boolean` | `false` | Animates continuously for unknown completion times. |
| `wavy` | Both | `boolean` | `false` | Enables MD3 Expressive animated sine-wave active indicator. |
| `thick` | Both | `boolean` | `false` | Renders thicker track/indicator stroke (8px linear). |
| `secondaryProgress` | `<ui-progress>` | `number \| undefined` | `undefined` | Buffer progress value on linear indicator. |
| `hide-stop-indicator` (prop: `hideStopIndicator`) | `<ui-progress>` | `boolean` | `false` | Hides the trailing stop dot on determinate linear progress. |
| `fourColor` | `<ui-circular-progress>` | `boolean` | `false` | Cycles through 4 theme accent colors during indeterminate animation. |

**Styling Hooks:**
- `<ui-progress>`: `--ui-progress-height` (`4px`), `--ui-progress-track-color`, `--ui-progress-primary-progress-color`, `--ui-progress-secondary-progress-color`, `--ui-progress-stop-indicator-color`, `--ui-progress-wave-speed` (`0.65s`).
- `<ui-circular-progress>`: `--ui-circular-progress-size` (`48px`), `--ui-circular-progress-active-indicator-width` (`10`), `--ui-circular-progress-active-indicator-color`, `--ui-circular-progress-track-color`.

**Example Usage:**
```html
<!-- Determinate Wavy Linear Progress with Buffer -->
<ui-progress value="65" secondaryProgress="85" wavy thick aria-label="Upload progress"></ui-progress>

<!-- Indeterminate 4-Color Circular Progress -->
<ui-circular-progress indeterminate fourColor aria-label="Loading data"></ui-circular-progress>
```

---

### Collapse (`<ui-collapse>`), Divider (`<ui-divider>`), Date-Time (`<ui-date-time>`)

**Imports:**
```typescript
import '@pawel-up/md/collapse/ui-collapse.js'
import '@pawel-up/md/divider/ui-divider.js'
import '@pawel-up/md/date/ui-date-time.js'
```

- **`<ui-collapse>`**: Smoothly animates height (or width when `horizontal` is set) when toggling `open`.
  - **Attributes**: `open` (`boolean`), `horizontal` (`boolean`), `noAnimation` (`boolean`), `disabled` (`boolean`).
  - **Methods**: `toggle(): void`.
  - **Events**: `toggle`, `transitioning`, `resize`.
  - **CSS Hook**: `--ui-collapse-transition-duration` (default `300ms`).
- **`<ui-divider>`**: 1px `outline-variant` separator line.
  - **Attributes**: `type` (`'full' | 'inset' | 'middle'`), `vertical` (`boolean`).
  - **CSS Hooks**: `--ui-divider-padding`, `--ui-divider-vertical-separation`.
- **`<ui-date-time>`**: Renders a semantic `<time>` element formatted via `Intl.DateTimeFormat`.
  - **Attributes**: `date` (`Date | string | number`), `locales` (`string`), `year`, `month` (`'numeric' | '2-digit' | 'long' | 'short' | 'narrow'`), `day`, `hour`, `minute`, `second`, `weekday`, `timeZone`, `timeZoneName`.

**Example Usage:**
```html
<ui-date-time date="2026-10-13T21:30:00Z" year="numeric" month="short" day="numeric" hour="2-digit" minute="2-digit"></ui-date-time>
<ui-divider type="middle"></ui-divider>
<ui-collapse ?open="${this.detailsOpen}">
  <div style="padding: 16px;">Collapsible content panel</div>
</ui-collapse>
```

---

### Icon (`<ui-icon>`), Focus Ring (`<ui-focus-ring>`), Ripple (`<ui-ripple>`), and `OverlayController`

**Imports:**
```typescript
import '@pawel-up/md/icons/ui-icon.js'
import '@pawel-up/md/focus-ring/ui-focus-ring.js'
import '@pawel-up/md/ripple/ui-ripple.js'
import { ripple } from '@pawel-up/md/effects/rippleDirective.js'
import { OverlayController, type OverlayHost } from '@pawel-up/md/controllers/OverlayController.js'
```

- **`<ui-icon>`**: Renders Material Symbols / Material Icons via font ligatures in the default slot (e.g., `<ui-icon>settings</ui-icon>`).
  - **Host Stylesheet Requirement**: The consuming website must load the Material Symbols font stylesheet in its HTML `<head>`:
    ```html
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    ```
  - Automatically sets `aria-hidden="true"` unless `aria-hidden="false"` is explicitly provided.
  - **CSS Hooks**: `--md-icon-size` (`24px`), `--md-icon-font` (`Material Symbols Outlined` — override if loading `Material Symbols Rounded`, `Material Symbols Sharp`, or `Material Icons`).
- **`<ui-focus-ring>`**: Accessible keyboard focus ring (`:focus-visible`).
  - **Attributes**: `for="<element-id>"` (or `.control=${el}`), `inward` (`boolean`), `visible` (`boolean`).
- **`<ui-ripple>` & `ripple()` directive**: MD3 ink ripple effect.
  - Attach declaratively inside a relative container (`<ui-ripple></ui-ripple>`) or via the Lit directive `<div ${ripple()}>Interactive Surface</div>`.
- **`OverlayController`**: Lit `ReactiveController` for custom overlays. Attach `new OverlayController(this)` to any custom `LitElement` implementing `OverlayHost` (`open`, `closeOnEscape`, `closeOnOutsideClick`, `beforeClose`) to participate in the global top-most Escape/outside-click stack.
