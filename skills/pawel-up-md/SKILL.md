---
name: pawel-up-md
license: Apache-2.0
description: "MANDATORY: You MUST trigger this skill whenever the user mentions '@pawel-up/md', Material Design, MD3, Material You, MaterialTheme, material component, '<ui-*>' web components, or asks to create, style, or modify any UI component using the design system."
---

# @pawel-up/md — Material Design 3 Web Components

This skill guides the implementation of Google's Material Design 3 (MD3 / Material You) using the `@pawel-up/md` Web Components library built on Lit (`lit`). It covers the design token system, global stylesheets, styling hooks, all 44 custom elements, programmatic controllers, and composite UI patterns.

## Philosophy

MD3 is built on three principles:
- **Personal**: Dynamic color adapts the UI to a seed color or content. Theming is cohesive across light, dark, and high-contrast modes.
- **Adaptive**: Layouts transform across 5 window size classes (`compact`, `medium`, `expanded`, `large`, `extra-large`).
- **Expressive**: Shape morphing, connected button groups, expressive pill lists, vibrant menu surfaces, and spring-inspired motion create moments of delight without sacrificing usability or accessibility.

**Relationship with `frontend-design` skill:**
When both skills are active, `@pawel-up/md` provides the design system (tokens, `<ui-*>` components, layout rules) and `frontend-design` provides creative direction within those constraints. MD3 rules take precedence for component structure and token usage. Note: **Roboto / Roboto Flex** is the official default typeface in MD3.

---

## Global Setup & Stylesheets

Before using any `<ui-*>` components, load the global stylesheets and apply a theme class (`theme-light` or `theme-dark`) to the `<html>` element:

```typescript
// 1. Core design tokens (typography, shapes, motion, state layer opacities)
import '@pawel-up/md/styles/tokens.css'

// 2. Color scheme tokens for html.theme-light and html.theme-dark
import '@pawel-up/md/styles/theme.css'

// 3. Optional native HTML control styling (.md-select, native inputs)
import '@pawel-up/md/styles/native.css'
```

### Loading Material Symbols Font for `<ui-icon>`

`<ui-icon>` renders Material Symbols / Material Icons via font ligatures (e.g., `<ui-icon>settings</ui-icon>`). Ensure the consuming website imports the **Material Symbols Outlined** stylesheet in its HTML `<head>` (or global CSS):

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>
```

If using a different Material icon font family (such as `Material Symbols Rounded`, `Material Symbols Sharp`, or classic `Material Icons`), load its stylesheet and override `--md-icon-font` on `:root`.

### Activating Light / Dark Themes

Apply `theme-light` or `theme-dark` on the root `<html>` element:

```html
<html lang="en" class="theme-light">
```

```typescript
// Toggle dark mode dynamically at runtime
function setDarkMode(isDark: boolean): void {
  document.documentElement.classList.toggle('theme-dark', isDark)
  document.documentElement.classList.toggle('theme-light', !isDark)
}
```

### Using Typography Classes Inside Lit Components

When authoring custom Lit components, import the shared typography CSS module to use `.display-large`, `.headline-medium`, `.title-large`, `.body-medium`, `.label-large`, etc. inside Shadow DOM:

```typescript
import { LitElement, html, css } from 'lit'
import typography from '@pawel-up/md/styles/typography.module.js'

export class MyView extends LitElement {
  static styles = [
    typography,
    css`
      :host {
        display: block;
        color: var(--md-sys-color-on-surface);
      }
    `,
  ]
}
```

---

## Design Token System & Styling Hooks

All system tokens use CSS custom properties under `--md-sys-*`.

### 1. Color Tokens (`--md-sys-color-*`)

| Token | Purpose |
|-------|---------|
| `primary` / `on-primary` | High-emphasis fills, text, and icons |
| `primary-container` / `on-primary-container` | Standout container fill (FABs, selected states) |
| `secondary` / `on-secondary` | Less prominent accents |
| `secondary-container` / `on-secondary-container` | Tonal buttons, standard menu/list selection fills |
| `tertiary` / `on-tertiary` | Contrasting accents, vibrant selection states |
| `tertiary-container` / `on-tertiary-container` | Complementary containers, vibrant menu surfaces |
| `error` / `on-error` | Error states and destructive actions |
| `error-container` / `on-error-container` | Error container fills |
| `surface` / `on-surface` | Default page/component background and primary text |
| `surface-variant` / `on-surface-variant` | Lower-emphasis text, icons, track backgrounds |
| `surface-container-lowest` → `low` → `surface-container` → `high` → `highest` | 5-level tonal elevation hierarchy (replaces drop shadows) |
| `surface-dim` / `surface-bright` | Fixed dimmest/brightest surface across themes |
| `inverse-surface` / `inverse-on-surface` / `inverse-primary` | Contrasting elements (snackbars) |
| `outline` | Interactive boundaries requiring 3:1 contrast (input borders) |
| `outline-variant` | Decorative boundaries (dividers, card borders) |

Full details: [`references/color-system.md`](./references/color-system.md) and [`references/theming-and-dynamic-color.md`](./references/theming-and-dynamic-color.md).

### 2. Typography Tokens (`--md-sys-typescale-*`)

5 categories (`display`, `headline`, `title`, `body`, `label`) × 3 sizes (`large`, `medium`, `small`).

> **IMPORTANT**: In `@pawel-up/md/styles/tokens.css`, the line-height token suffix is **`-height`** (not `-line-height`):
> - `--md-sys-typescale-{scale}-{size}-font`
> - `--md-sys-typescale-{scale}-{size}-weight`
> - `--md-sys-typescale-{scale}-{size}-size`
> - `--md-sys-typescale-{scale}-{size}-height`
> - `--md-sys-typescale-{scale}-{size}-tracking`

### 3. Shape (`--md-sys-shape-corner-*`) & Motion (`--md-sys-motion-*`)

- **Shapes**: `none` (`0`), `extra-small` (`4px`), `small` (`8px`), `medium` (`12px`), `large` (`16px`), `extra-large` (`28px`), `full` (`9999px`), plus directional tokens (`extra-small-top`, `small-top`, `small-bottom`, `medium-top`, `large-end`, `large-top`, `extra-large-top`).
- **Motion Easing**: `--md-sys-motion-easing-standard`, `--md-sys-motion-easing-standard-decelerate`, `--md-sys-motion-easing-standard-accelerate`, `--md-sys-motion-easing-emphasized-decelerate`, `--md-sys-motion-easing-emphasized-accelerate`.
- **Motion Duration**: `--md-sys-motion-duration-short1` (`50ms`) through `short4` (`200ms`), `medium1` (`250ms`) through `medium4` (`400ms`), `long1` (`450ms`) through `long4` (`600ms`), `extra-long1` (`700ms`) through `extra-long4` (`1000ms`).
- **State Layer Opacity**: `--md-sys-state-hover-state-layer-opacity` (`0.08`), `--md-sys-state-focus-state-layer-opacity` (`0.1`), `--md-sys-state-pressed-state-layer-opacity` (`0.1`), `--md-sys-state-dragged-state-layer-opacity` (`0.16`).

Full details: [`references/typography-and-shape.md`](./references/typography-and-shape.md).

### 4. Component-Level Styling Hooks (CSS Custom Properties)

Customize individual component instances without piercing Shadow DOM using these exposed CSS variables:

| Component | CSS Custom Properties |
|-----------|-----------------------|
| `ui-button` | `--md-button-icon-size` (`20px`), `--md-button-outline-color`, `--ui-button-shape-start-start`, `--ui-button-shape-start-end`, `--ui-button-shape-end-start`, `--ui-button-shape-end-end` |
| `ui-icon-button` | `--md-button-icon-size` (`24px`), `--ui-icon-button-shape-start-start`, `--ui-icon-button-shape-start-end`, `--ui-icon-button-shape-end-start`, `--ui-icon-button-shape-end-end` |
| `ui-icon` | `--md-icon-size` (`24px`), `--md-icon-font` (`Material Symbols Outlined`) |
| `ui-fab` | `--md-fab-margin` (`16px` / `24px`), `--md-fab-margin-expanded`, `--md-fab-z-index` (`100`) |
| `ui-dialog` / `ui-confirm-dialog` | `--ui-dialog-width`, `--ui-dialog-height`, `--ui-dialog-max-width` (`90vw`), `--ui-dialog-max-height` (`90vh`) |
| `ui-list` / `ui-list-item` | `--md-list-container-color`, `--md-density-offset`, `--md-list-item-height`, `--md-list-item-two-lines-height`, `--md-list-item-three-lines-height`, `--md-list-item-supporting-text-color`, `--md-list-item-trailing-supporting-text-color`, `--md-list-item-overline-color` |
| `ui-menu-item` / `ui-option` | `--md-density-offset`, `--md-menu-item-shape`, `--md-menu-item-margin-inline` (`6px`), `--md-menu-item-height`, `--md-menu-item-selected-shape` (`12px`), `--md-menu-item-selected-bg`, `--md-menu-item-selected-color` |
| `ui-tabs` / `ui-tab` | `--md-tabs-background-color`, `--md-tab-background-color`, `--md-tab-container-shape`, `--md-primary-tab-label-text-color`, `--md-primary-tab-active-label-text-color`, `--md-primary-tab-active-indicator-height` (`3px`), `--md-primary-tab-active-indicator-shape`, `--md-secondary-tab-label-text-color`, `--md-secondary-tab-active-label-text-color`, `--md-secondary-tab-active-indicator-height` (`2px`) |
| `ui-outlined-text-field` | `--md-outlined-text-field-label-active-color` |
| `ui-progress` | `--ui-progress-height` (`4px`), `--ui-progress-track-color`, `--ui-progress-primary-progress-color`, `--ui-progress-secondary-progress-color`, `--ui-progress-stop-indicator-color`, `--ui-progress-wave-speed` (`0.65s`), `--ui-progress-scale-duration`, `--ui-progress-indeterminate-cycle-duration` |
| `ui-circular-progress` | `--ui-circular-progress-size` (`48px`), `--ui-circular-progress-active-indicator-width` (`10`), `--ui-circular-progress-active-indicator-color`, `--ui-circular-progress-track-color`, `--ui-circular-progress-four-color-active-indicator-one-color` (and `-two-color`, `-three-color`, `-four-color`) |
| `ui-collapse` | `--ui-collapse-transition-duration` (`300ms`) |
| `ui-divider` | `--ui-divider-padding`, `--ui-divider-vertical-separation` |
| `ui-badge` | `--ui-badge-color`, `--ui-badge-label-color`, `--ui-badge-shape-small` (`3px`), `--ui-badge-shape-large` (`8px`), `--ui-badge-size-small` (`6px`), `--ui-badge-size-large` (`16px`), `--ui-badge-offset-x`, `--ui-badge-offset-y` |
| `ui-focus-ring` | `--md-focus-ring-color`, `--md-focus-ring-width` (`3px`), `--md-focus-ring-active-width` (`8px`), `--md-focus-ring-outward-offset` (`2px`), `--md-focus-ring-inward-offset` (`0px`), `--md-focus-ring-shape`, `--md-focus-ring-duration` (`600ms`) |
| `ui-ripple` | `--md-ripple-hover-state-layer-color`, `--md-ripple-hover-state-layer-opacity`, `--md-ripple-pressed-state-layer-color`, `--md-ripple-pressed-state-layer-opacity`, `--md-ripple-focus-state-layer-color`, `--md-ripple-focus-state-layer-opacity`, `--md-ripple-state-layer-shape` |

---

## Component Quick Reference

Always import individual component modules using their subpath export (`@pawel-up/md/<folder>/<element>.js`). **Never** barrel-import `@pawel-up/md` or include `/components/` in the import path.

| Category | Element Tag | Subpath Import | Key Attributes / Features |
|----------|-------------|----------------|---------------------------|
| **Actions** | `<ui-button>` | `@pawel-up/md/button/ui-button.js` | `color` (`filled`\|`tonal`\|`elevated`\|`outlined`\|`text`), `size` (`xs`\|`s`\|`m`\|`l`\|`xl`), `shape` (`round`\|`square`), `toggle`, `selected`, `destructive`, `trailingicon`, `popovertarget` |
| **Actions** | `<ui-button-group>` | `@pawel-up/md/button/ui-button-group.js` | `type` (`standard`\|`connected`), `multiple`, `size` (`xs`–`xl`), `shape` (`round`\|`square`); manages child `<ui-button>` states & roving tabindex |
| **Actions** | `<ui-icon-button>` | `@pawel-up/md/icon-button/ui-icon-button.js` | `color` (`standard`\|`filled`\|`tonal`\|`outlined`\|`elevated`), `width` (`default`\|`narrow`\|`wide`), `size` (`xs`–`xl`), `shape`, `toggle`, `selected`; `selected` slot |
| **Actions** | `<ui-fab>` | `@pawel-up/md/fab/ui-fab.js` | `placement` (`bottom-end`\|`bottom-start`\|`top-start`\|`top-end`\|`inline`), `open`; composable trigger + `slot="menu"` speed-dial actions |
| **Actions** | `<ui-segmented-button-set>` | `@pawel-up/md/segmented-button/ui-segmented-button-set.js` | `multiselect`; legacy MD3 segmented button container |
| **Actions** | `<ui-segmented-button>` | `@pawel-up/md/segmented-button/ui-segmented-button.js` | `selected`, `disabled`; slots: `(default)`, `icon` |
| **Inputs** | `<ui-outlined-text-field>` | `@pawel-up/md/text-field/ui-outlined-text-field.js` | Form-associated input; `label`, `type`, `value`, `masked`, `noVisibilityToggle`, `supportingText`, `invalid`, `invalidText`, `required`, `noFloating`; slots: `prefix`, `suffix` |
| **Inputs** | `<ui-filled-text-field>` | `@pawel-up/md/text-field/ui-filled-text-field.js` | Filled variant with identical API and slots (`prefix`, `suffix`) to `<ui-outlined-text-field>` |
| **Inputs** | `<ui-text-area>` | `@pawel-up/md/text-area/ui-text-area.js` | Form-associated multi-line textarea; `rows`, `cols`, `wrap`, plus all text-field props & `prefix`/`suffix` slots |
| **Inputs** | `<ui-select>` | `@pawel-up/md/select/ui-select.js` | Form-associated select; `label`, `value`, `name`, `required`, `invalid`, `invalidText`, `supportingText`, `density` (`0` to `-3`), `variant` (`standard`\|`vibrant`) |
| **Inputs** | `<ui-option>` | `@pawel-up/md/select/ui-option.js` | `value`, `selected`, `disabled`, `lines` (`one`\|`two`\|`three`), `image`; slots: `(default)`, `start`, `end`, `end-text`, `overline`, `supporting-text` |
| **Inputs** | `<ui-checkbox>` | `@pawel-up/md/checkbox/ui-checkbox.js` | Form-associated; `checked`, `indeterminate`, `disabled`, `required`, `invalid`, `name`, `value` |
| **Inputs** | `<ui-radio>` | `@pawel-up/md/radio/ui-radio.js` | Form-associated; `checked`, `disabled`, `required`, `invalid`, `name`, `value` (auto-syncs group by `name`) |
| **Inputs** | `<ui-switch>` | `@pawel-up/md/switch/ui-switch.js` | Form-associated; `checked`, `disabled`, `required`, `invalid`, `onIcon`, `offIcon` |
| **Inputs** | `<ui-chip-set>` | `@pawel-up/md/chip/ui-chip-set.js` | Container for `<ui-chip>` elements |
| **Inputs** | `<ui-chip>` | `@pawel-up/md/chip/ui-chip.js` | `type` (`assist`\|`filter`\|`input`\|`suggestion`), `elevated`, `removable`, `checked`, `disabled`; slots: `(default)`, `icon`, `avatar` |
| **Inputs** | `<ui-date-picker-input>` | `@pawel-up/md/date-picker/ui-date-picker-input.js` | Outlined input with dropdown calendar; `label`, `value` (`Date`), `minDate`, `maxDate`, `disabledDates`, `locale`, `error`, `errorMessage` |
| **Inputs** | `<ui-date-picker-modal>` | `@pawel-up/md/date-picker/ui-date-picker-modal.js` | Modal date range picker; `open`, `title`, `selectedRange` (`{ start, end }`), `minDate`, `maxDate`, `locale` |
| **Inputs** | `<ui-date-picker-modal-input>` | `@pawel-up/md/date-picker/ui-date-picker-modal-input.js` | Text-entry modal date/range picker; `open`, `rangeMode`, `selectedDate`, `selectedRange` |
| **Inputs** | `<ui-date-picker-calendar>` | `@pawel-up/md/date-picker/internals/DatePickerCalendar.js` | Standalone inline calendar grid; `selectedDate`, `rangeSelection`, `rangeStart`, `rangeEnd`, `showActions` |
| **Overlays & Menus** | `<ui-menu>` | `@pawel-up/md/menu/ui-menu.js` | Popover menu (`popover="auto"`); `open`, `selectOnActivate`, `multiSelect`, `density` (`0` to `-3`), `variant` (`standard`\|`vibrant`) |
| **Overlays & Menus** | `<ui-sub-menu>` | `@pawel-up/md/menu/ui-sub-menu.js` | Anchored submenu; `id`, `anchor="<menu-item-id>"`, `open`, `density`, `variant` |
| **Overlays & Menus** | `<ui-menu-group>` | `@pawel-up/md/menu/ui-menu-group.js` | Expressive menu grouping (`role="group"`) with 8dp separation; `density`, `variant` |
| **Overlays & Menus** | `<ui-menu-item>` | `@pawel-up/md/menu/ui-menu-item.js` | `value`, `selected`, `showSelectionIcon`, `submenu="<sub-menu-id>"`, `disabled`, `lines`; slots: `(default)`, `start`, `end`, `end-text`, `overline`, `supporting-text` |
| **Overlays & Menus** | `<ui-dropdown-list>` | `@pawel-up/md/dropdown-list/ui-dropdown-list.js` | Generic trigger + overlay wrapper; `open`, `verticalAlign`, `horizontalAlign`, `noOverlap`, `matchTriggerWidth`; slots: `(default)`, `dropdown` |
| **Overlays & Menus** | `<ui-dialog>` | `@pawel-up/md/dialog/ui-dialog.js` | Top-layer `<dialog>`; `open`, `modal`, `constrain`, `closeOnOutsideClick`, `confirmLabel`, `dismissLabel`, `destructive`; slots: `(default)`, `icon`, `title`, `button` |
| **Overlays & Menus** | `<ui-confirm-dialog>` | `@pawel-up/md/dialog/ui-confirm-dialog.js` | Pre-configured modal confirmation dialog; `open`, `confirmLabel`, `dismissLabel`, `destructive`; slots: `title`, `(default)`, `icon`, `button` |
| **Overlays & Menus** | `<ui-snackbar>` | `@pawel-up/md/snackbar/ui-snackbar.js` | Notification bar (prefer programmatic `SnackNotifications.notify()`); `open`, `persistent`, `timeout`, `action`, `close` |
| **Data Display** | `<ui-list>` | `@pawel-up/md/list/ui-list.js` | Standard continuous list; `selectActive`, `collapsible`, `density` (`0` to `-3`), `delegateFocus` |
| **Data Display** | `<ui-list-item>` | `@pawel-up/md/list/ui-list-item.js` | `lines` (`one`\|`two`\|`three`), `image` (`icon`\|`avatar`\|`image`\|`video`), `static`, `disabled`, `open`, `parent`; slots: `(default)`, `start`, `end`, `end-text`, `overline`, `supporting-text` |
| **Data Display** | `<ui-expressive-list>` | `@pawel-up/md/list/ui-expressive-list.js` | MD3 Expressive list (28px pill items with 2px gap); `selectActive`, `collapsible`, `density` (`0` to `-3`) |
| **Data Display** | `<ui-expressive-list-item>` | `@pawel-up/md/list/ui-expressive-list-item.js` | Expressive pill list item; identical attributes and slots to `<ui-list-item>` |
| **Data Display** | `<ui-listbox>` | `@pawel-up/md/listbox/ui-listbox.js` | Accessible `role="listbox"` container; `selector`, `selectActive`, `collapsible`, `density` |
| **Data Display** | `<ui-collapse>` | `@pawel-up/md/collapse/ui-collapse.js` | Animated expand/collapse container; `open`, `horizontal`, `noAnimation`, `disabled` |
| **Data Display** | `<ui-divider>` | `@pawel-up/md/divider/ui-divider.js` | `type` (`full`\|`inset`\|`middle`), `vertical` |
| **Data Display** | `<ui-badge>` | `@pawel-up/md/badge/ui-badge.js` | `dot`, `attached`; slotted content only; small dot (6×6dp) and large badge (16dp) status/count indicator |
| **Data Display** | `<ui-date-time>` | `@pawel-up/md/date/ui-date-time.js` | Semantic `<time>` formatting via `Intl.DateTimeFormat`; `date`, `locales`, `year`, `month`, `day`, `hour`, `minute`, `second`, `weekday`, `timeZone` |
| **Data Display** | `<ui-icon>` | `@pawel-up/md/icons/ui-icon.js` | Material Symbols font ligature icon (`<ui-icon>add</ui-icon>`); requires Material Symbols stylesheet in host page |
| **Navigation** | `<ui-tabs>` | `@pawel-up/md/tabs/ui-tabs.js` | Tab bar with animated indicator & overflow scroll buttons; `priority` (`primary`\|`secondary`), `autoActivate` |
| **Navigation** | `<ui-tab>` | `@pawel-up/md/tabs/ui-tab.js` | Individual tab; `selected`, `disabled`, `priority` (`primary`\|`secondary`) |
| **Feedback & Utils** | `<ui-progress>` | `@pawel-up/md/progress/ui-progress.js` | Linear progress; `value`, `min`, `max`, `indeterminate`, `secondaryProgress`, `wavy`, `thick`, `hide-stop-indicator` |
| **Feedback & Utils** | `<ui-circular-progress>` | `@pawel-up/md/progress/ui-circular-progress.js` | Circular progress; `value`, `min`, `max`, `indeterminate`, `fourColor`, `wavy`, `thick` |
| **Feedback & Utils** | `<ui-focus-ring>` | `@pawel-up/md/focus-ring/ui-focus-ring.js` | Accessible focus indicator; `for`, `control`, `inward`, `visible` |
| **Feedback & Utils** | `<ui-ripple>` | `@pawel-up/md/ripple/ui-ripple.js` | Ink ripple surface; `unbounded`, `disabled` (or use `ripple()` directive from `@pawel-up/md/effects/rippleDirective.js`) |

Full component APIs, slots, events, and examples: [`references/component-catalog.md`](./references/component-catalog.md).

---

## Programmatic Controllers & Helpers

- **`SnackNotifications`** (`@pawel-up/md/notification/SnackNotifications.js`): Global queue manager for MD3 snackbars. Call `SnackNotifications.notify(message, options)` instead of manually mounting `<ui-snackbar>`.
- **`OverlayController` & `OverlayStackManager`** (`@pawel-up/md/controllers/OverlayController.js`): Lit `ReactiveController` managing top-most Escape dismissal, outside-click dismissal, and async `beforeClose(reason)` guards across `<ui-dialog>`, `<ui-menu>`, `<ui-select>`, `<ui-fab>`, `<ui-dropdown-list>`, and `<ui-date-picker-input>`.
- **`ripple` Directive** (`@pawel-up/md/effects/rippleDirective.js`): Lit directive `ripple()` for adding ink ripples to any element inside custom templates.

---

## Essential Composite Component Patterns

### 1. Button Groups (`<ui-button-group>` + `<ui-button>`)

`<ui-button-group>` manages layout (`standard` spaced vs `connected` 2px-gap segmented), `size` (`xs`–`xl`), `shape` (`round`\|`square`), roving `tabindex`, keyboard arrow navigation, and selection state (`multiple`). Add `toggle` to child `<ui-button>` elements to enable selection.

```html
<!-- Connected single-select button group -->
<ui-button-group
  type="connected"
  size="m"
  shape="round"
  @change="${(e: CustomEvent<{ target: HTMLElement }>) => console.log('Toggled:', e.detail.target)}"
>
  <ui-button color="tonal" toggle selected>
    <ui-icon slot="icon">calendar_view_day</ui-icon>
    Day
  </ui-button>
  <ui-button color="tonal" toggle>
    <ui-icon slot="icon">calendar_view_week</ui-icon>
    Week
  </ui-button>
  <ui-button color="tonal" toggle>
    <ui-icon slot="icon">calendar_view_month</ui-icon>
    Month
  </ui-button>
</ui-button-group>
```

### 2. Menus, Submenus & Menu Groups (`<ui-menu>`, `<ui-sub-menu>`, `<ui-menu-group>`, `<ui-menu-item>`)

Menus use the native **Popover API** (`popover="auto"`) and **CSS Anchor Positioning**.
- Trigger buttons open the root menu via `popovertarget="<menu-id>"`.
- Submenus (`<ui-sub-menu>`) are placed **inside** the `<ui-menu>` at the root level (not nested inside `<ui-menu-item>`), linked via `submenu="<sub-menu-id>"` on the `<ui-menu-item>` and `anchor="<menu-item-id>"` on the `<ui-sub-menu>`.
- Use `<ui-menu-group>` for expressive 8dp-separated logical groups.
- Supports `variant="vibrant"`, `density="-1" | "-2" | "-3"`, `multiSelect`, and `selectOnActivate` with `showSelectionIcon` on items.

```html
<ui-button id="actions-trigger" color="filled" popovertarget="actions-menu">
  Actions
</ui-button>

<ui-menu id="actions-menu" popover="auto" variant="standard" density="0" @select="${onMenuSelect}">
  <ui-menu-group aria-label="Document Actions">
    <ui-menu-item value="new">
      <ui-icon slot="start">add</ui-icon>
      New Document
      <span slot="end-text">⌘N</span>
    </ui-menu-item>

    <!-- Trigger item for submenu -->
    <ui-menu-item id="export-trigger" submenu="export-submenu">
      <ui-icon slot="start">file_export</ui-icon>
      Export As...
    </ui-menu-item>
  </ui-menu-group>

  <ui-menu-group aria-label="Danger Zone">
    <ui-menu-item value="delete">
      <ui-icon slot="start">delete</ui-icon>
      Delete
    </ui-menu-item>
  </ui-menu-group>

  <!-- Submenu defined as sibling inside <ui-menu> -->
  <ui-sub-menu id="export-submenu" anchor="export-trigger">
    <ui-menu-item value="pdf">PDF Document</ui-menu-item>
    <ui-menu-item value="png">PNG Image</ui-menu-item>
  </ui-sub-menu>
</ui-menu>
```

### 3. Floating Action Button & Speed-Dial Menu (`<ui-fab>`)

`<ui-fab>` is a compositional container. Place the primary trigger (`<ui-icon-button>` or `<ui-button>`) in the default slot, and optional speed-dial actions in `slot="menu"`.

```html
<ui-fab
  placement="bottom-end"
  @change="${(e: CustomEvent<{ open: boolean }>) => (this.fabOpen = e.detail.open)}"
  @select="${(e: CustomEvent<{ item: HTMLElement }>) => this.handleFabAction(e.detail.item)}"
>
  <!-- Trigger button -->
  <ui-icon-button color="filled" size="m" aria-label="${this.fabOpen ? 'Close actions' : 'Quick actions'}">
    <ui-icon>${this.fabOpen ? 'close' : 'add'}</ui-icon>
  </ui-icon-button>

  <!-- Expandable speed-dial menu items -->
  <ui-button slot="menu" role="menuitem" color="tonal">
    <ui-icon slot="icon">edit</ui-icon>
    Create Document
  </ui-button>
  <ui-button slot="menu" role="menuitem" color="tonal">
    <ui-icon slot="icon">share</ui-icon>
    Share with Team
  </ui-button>
</ui-fab>
```

### 4. Expressive & Collapsible Lists (`<ui-expressive-list>` + `<ui-expressive-list-item>`)

Use `collapsible` on `<ui-list>` or `<ui-expressive-list>` to create parent/child collapsible groups by setting `id="<group-id>"` on the parent item and `parent="<group-id>"` on child items.

```html
<ui-expressive-list collapsible selectActive density="0">
  <!-- Parent Group Item -->
  <ui-expressive-list-item id="grp-dev" open>
    <ui-icon slot="start">code</ui-icon>
    Development Tools
    <ui-icon-button slot="end" width="narrow">
      <ui-icon aria-hidden="true">keyboard_arrow_up</ui-icon>
    </ui-icon-button>
  </ui-expressive-list-item>

  <!-- Child Items linked via parent="grp-dev" -->
  <ui-expressive-list-item parent="grp-dev">
    <ui-icon slot="start">terminal</ui-icon>
    Terminal Configuration
  </ui-expressive-list-item>
  <ui-expressive-list-item parent="grp-dev">
    <ui-icon slot="start">source</ui-icon>
    Git Repositories
  </ui-expressive-list-item>
</ui-expressive-list>
```

---

## Anti-Patterns (NEVER Do These)

- **NEVER mix `@material/web` (`<md-*>`) or `@material/mdc-*` with `@pawel-up/md`**: Always use `<ui-*>` elements from `@pawel-up/md`.
- **NEVER use barrel imports or `/components/` in import paths**: Import `@pawel-up/md/button/ui-button.js`, NOT `@pawel-up/md` and NOT `@pawel-up/md/components/button/ui-button.js`.
- **NEVER use `--md-sys-typescale-*-line-height`**: In `@pawel-up/md`, the line-height token is `--md-sys-typescale-*-height` (e.g., `var(--md-sys-typescale-body-large-height)`).
- **NEVER hardcode hex/rgb colors or arbitrary border-radius**: Always use `var(--md-sys-color-*)` and `var(--md-sys-shape-corner-*)` tokens with proper tonal pairing (`primary` with `on-primary`, `surface-container` with `on-surface`).
- **NEVER nest `<ui-sub-menu>` inside `<ui-menu-item>`**: Place `<ui-sub-menu id="sub" anchor="item-id">` as a direct child of `<ui-menu>` and reference it via `<ui-menu-item id="item-id" submenu="sub">`.
- **NEVER use `outline` for decorative dividers**: Use `--md-sys-color-outline-variant` (or `<ui-divider>`) for dividers; `--md-sys-color-outline` is reserved for interactive boundaries requiring 3:1 contrast.

---

## MD3 Compliance Audit

When asked to audit or review a page/application for MD3 compliance, follow the procedure, checklist, and 100-point scoring rubric in [`references/compliance-audit.md`](./references/compliance-audit.md).

## Reference Documents

- [`references/component-catalog.md`](./references/component-catalog.md) — Exhaustive API reference (imports, attributes, properties, slots, events, CSS hooks, and composite examples) for all 43 `@pawel-up/md` components and controllers
- [`references/color-system.md`](./references/color-system.md) — Color roles, tonal palettes, pairing rules, dynamic color
- [`references/typography-and-shape.md`](./references/typography-and-shape.md) — Type scale (`tokens.css` variables and `typography.module.js` classes), shape corners, elevation, motion
- [`references/theming-and-dynamic-color.md`](./references/theming-and-dynamic-color.md) — Theme setup (`theme-light` / `theme-dark`), dynamic color generation, component CSS variable overrides
- [`references/layout-and-responsive.md`](./references/layout-and-responsive.md) — Window size classes, canonical layouts (Feed, List-Detail, Supporting Pane), foldables
- [`references/compliance-audit.md`](./references/compliance-audit.md) — Complete MD3 compliance audit procedure and scoring guide
