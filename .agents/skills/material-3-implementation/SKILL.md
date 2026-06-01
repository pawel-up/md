---
name: material-3-implementation
description: >
  MANDATORY: You must trigger this skill whenever the user mentions Material Design, MD3, 
  Material You, MaterialTheme, material component, or asks to create/modify any UI component 
  using the design system.
---

# Material Design 3

This skill guides implementation of Google's Material Design 3 (MD3) — a personal, adaptive, expressive design system. MD3 uses dynamic color, tonal surfaces, rounded shapes, and spring-based motion to create UIs that feel alive and personal.

## Philosophy

MD3 is built on three principles:
- **Personal**: Dynamic color adapts UI to the user's wallpaper or content. Theming is individual, not one-size-fits-all.
- **Adaptive**: Layouts transform across 5 window size classes. Components resize, reposition, and change form factor responsively.
- **Expressive**: Shape morphing, spring physics, and emphasized typography create moments of delight without sacrificing usability.

**Key differences from MD2:**
- Tonal surfaces replace elevation shadows as the primary depth cue
- Dynamic color generates full schemes from a single seed color
- Fully rounded corners by default (not slightly rounded)
- Spring-based motion physics replace fixed easing curves for components
- 3 levels of user-controlled contrast (standard/medium/high)

**Relationship with frontend-design skill:**
When both skills are active, MD3 provides the design system (tokens, components, layout rules) and frontend-design provides creative direction within those constraints. MD3 rules take precedence for component structure and token usage. Note: Roboto/Roboto Flex IS the correct default typeface in MD3 — the frontend-design guidance to avoid Roboto does not apply when implementing MD3.

## Design Token System

All MD3 tokens use the `md.sys` namespace. **On the web**, these map to CSS custom properties (`--md-sys-*`):

### Color Tokens (`--md-sys-color-*`)
| Token | Purpose |
|-------|---------|
| `primary` | High-emphasis fills, text, icons against surface |
| `on-primary` | Text/icons on primary |
| `primary-container` | Standout fill for key components (FAB, etc.) |
| `on-primary-container` | Text/icons on primary-container |
| `secondary` / `on-secondary` | Less prominent accents |
| `secondary-container` / `on-secondary-container` | Recessive components (tonal buttons) |
| `tertiary` / `on-tertiary` | Contrasting accents |
| `tertiary-container` / `on-tertiary-container` | Complementary containers |
| `error` / `on-error` | Error states (static — doesn't change with dynamic color) |
| `error-container` / `on-error-container` | Error container fills |
| `surface` | Default background |
| `on-surface` | Text/icons on any surface |
| `on-surface-variant` | Lower-emphasis text/icons on surface |
| `surface-container-lowest` | Lowest-emphasis container |
| `surface-container-low` | Low-emphasis container |
| `surface-container` | Default container (nav areas) |
| `surface-container-high` | High-emphasis container |
| `surface-container-highest` | Highest-emphasis container |
| `surface-dim` / `surface-bright` | Maintain relative brightness across light/dark |
| `inverse-surface` / `inverse-on-surface` / `inverse-primary` | Contrasting elements (snackbars) |
| `outline` | Important boundaries (text field borders) |
| `outline-variant` | Decorative elements (dividers) |

Full details: `references/color-system.md`

### Typography Tokens (`--md-sys-typescale-*`)
| Scale | Sizes | Use |
|-------|-------|-----|
| Display | L / M / S | Hero text, large numbers |
| Headline | L / M / S | Section headers |
| Title | L / M / S | Smaller headers, card titles |
| Body | L / M / S | Paragraph text, descriptions |
| Label | L / M / S | Buttons, chips, captions |

Each style has tokens for: `-font`, `-weight`, `-size`, `-line-height`, `-tracking`
Plus 15 **emphasized** variants (higher weight) via `--md-sys-typescale-emphasized-*`

Full details: `references/typography-and-shape.md`

### Shape Tokens (`--md-sys-shape-corner-*`)
| Token | Value | Example components |
|-------|-------|-------------------|
| `none` | 0dp | — |
| `extra-small` | 4dp | Chips, snackbars |
| `small` | 8dp | Text fields, menus |
| `medium` | 12dp | Cards |
| `large` | 16dp | FABs, navigation drawer |
| `large-increased` | 20dp | (Expressive) |
| `extra-large` | 28dp | Dialogs, bottom sheets |
| `extra-large-increased` | 32dp | (Expressive) |
| `extra-extra-large` | 48dp | (Expressive) |
| `full` | 9999px | Buttons, chips, badges |

### Elevation Levels
| Level | DP | Tonal offset | Use |
|-------|-----|-------------|-----|
| 0 | 0dp | None | Flat surfaces, most components at rest |
| 1 | 1dp | +5% primary | Elevated cards, modal sheets |
| 2 | 3dp | +8% primary | Menus, nav bar, scrolled app bar |
| 3 | 6dp | +11% primary | FAB, dialogs, search, date/time pickers |
| 4 | 8dp | +12% primary | (hover/focus increase only) |
| 5 | 12dp | +14% primary | (hover/focus increase only) |

Elevation in MD3 is communicated through **tonal surface color**, not shadows. Shadows are only used when needed for additional protection against busy backgrounds.

### Motion
MD3 Expressive (May 2025) introduced **spring-based motion physics** for components. The legacy easing/duration system is still used for **transitions** (enter/exit/shared-axis):

| Easing | Duration | Transition type |
|--------|----------|-----------------|
| Emphasized | 500ms | Begin and end on screen |
| Emphasized decelerate | 400ms | Enter the screen |
| Emphasized accelerate | 200ms | Exit the screen |
| Standard | 300ms | Begin and end on screen (utility) |
| Standard decelerate | 250ms | Enter screen (utility) |
| Standard accelerate | 200ms | Exit screen (utility) |

CSS easing values:
- Emphasized: `cubic-bezier(0.2, 0, 0, 1)`
- Emphasized decelerate: `cubic-bezier(0.05, 0.7, 0.1, 1)`
- Emphasized accelerate: `cubic-bezier(0.3, 0, 0.8, 0.15)`
- Standard: `cubic-bezier(0.2, 0, 0, 1)`
- Standard decelerate: `cubic-bezier(0, 0, 0, 1)`
- Standard accelerate: `cubic-bezier(0.3, 0, 1, 1)`

## Component Quick Reference

| Component | Web Element | Key Variants / Notes | Category |
|-----------|-------------|----------------------|----------|
| Button | `ui-button` | Filled, Outlined, Text, Elevated, Tonal (Sizes: XS–XL) | Actions |
| Button group | `ui-button-group` | Standard, Connected | Actions |
| Icon Button | `ui-icon-button` | Standard, Filled, Tonal, Outlined | Actions |
| Segmented Button | `ui-segmented-button` | Single-select, Multi-select | Actions |
| Progress Indicators | `ui-progress`, `ui-circular-progress` | Linear, Circular (Determinate, Indeterminate) | Actions |
| Dialog | `ui-dialog` | Standard alert/modal dialogs | Actions |
| Checkbox | `ui-checkbox` | Standard, Indeterminate | Inputs |
| Chips | `ui-chip`, `ui-chip-set` | Input, Filter, Suggestion, Action | Inputs |
| Radio Button | `ui-radio` | Standard single-choice selection | Inputs |
| Switch | `ui-switch` | Standard, With icon | Inputs |
| Text Field | `ui-text-field` | Filled, Outlined (Prefix/Suffix) | Inputs |
| Select | `ui-select`, `ui-option` | Form-associated dropdown selection | Inputs |
| Text Area | `ui-text-area` | Multi-line input (Rows, Cols) | Inputs |
| Date Picker | `ui-date-picker-input`, `...modal`, `...modal-input` | Dropdown Input, Full-screen Modal | Inputs |
| List | `ui-list`, `ui-expressive-list` | Standard, Expressive (Lines, Images) | Data Display |
| Listbox | `ui-listbox` | Accessible container for selectable options | Data Display |
| Menu | `ui-menu`, `ui-sub-menu`, `ui-menu-item` | ID-anchored popover menus | Data Display |
| Dropdown List | `ui-dropdown-list` | Trigger-based generic list overlay wrapper | Data Display |
| Snackbar | `ui-snackbar` | Notifications via `SnackNotifications` API | Data Display |
| Collapse | `ui-collapse` | Vertical and Horizontal expand/collapse | Data Display |
| Divider | `ui-divider` | Full, Inset, Middle | Data Display |
| Date | `date-time` | `<time>` element with `Intl.DateTimeFormat` | Data Display |
| Tabs | `ui-tabs`, `ui-tab` | Primary, Secondary navigation tabs | Navigation |
| Focus Ring | `ui-focus-ring` | Accessibility helper (Inward, Outward) | Utilities |
| Ripple | `ui-ripple` | Programmatic MD3 ink effect | Utilities |

Full component details with code examples: `references/component-catalog.md`

## Themes

The `base-ui` package uses CSS class-based theming applied to the `html` element. The theme classes map to the MD3 design system tokens and swap the underlying values.

To activate a theme, apply one of the following classes to the `html` element:
- `theme-light`: Activates the light color scheme.
- `theme-dark`: Activates the dark color scheme.

When a theme is active, all components relying on `--md-sys-color-*` variables will automatically adapt to the correct color palette.

## Design System Tokens

The MD3 tokens are implemented as CSS custom properties and are injected into the design via the `@pawel-up/md/styles/` stylesheets (`tokens.ts`, `theme.ts`, `typography.module.ts`, etc.). 

To use these tokens in your custom components, reference the CSS variables directly:

```css
.my-custom-element {
  /* Using color tokens */
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  
  /* Using typography tokens */
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);

  /* Using elevation/shadows */
  box-shadow: var(--md-sys-elevation-2);
}
```

**Note**: Always use the `--md-sys-*` variables (system tokens) rather than hardcoded colors or raw palette tokens, as the system tokens automatically handle light/dark mode switching based on the active `.theme-*` class.

## Anti-Patterns

**Never do these when implementing MD3:**

- **Mix material official libraries with the base UI library**: Don't use `@material/mdc-*` (MD2) or `@material/web` (MD3). We have developed our components library.
- **Hardcode colors**: Always use `var(--md-sys-color-*)` tokens, never raw hex/rgb values. Hardcoded colors break dynamic theming, dark mode, and contrast adjustment.
- **Ignore tonal pairing**: Only combine colors in their intended pairs (e.g., `primary` + `on-primary`, `surface-container` + `on-surface`). Arbitrary pairings break contrast in dynamic color and high contrast modes.
- **Use `outline` for dividers**: Use `outline-variant` for dividers. `outline` is for important boundaries like text field borders.
- **Import all of @pawel-up/md**: Always import individual component modules. Barrel imports include every component and destroy bundle size.
- **Use `border-radius` directly**: Use shape tokens (`var(--md-sys-shape-corner-medium)`) so shapes stay consistent with theming.
- **Use shadows for elevation by default**: MD3 communicates elevation through tonal surface color, not shadows. Only add shadows when elements need extra separation from busy backgrounds.
- **Apply frontend-design "avoid Roboto" rule**: On **Android**, **Roboto** is the default Material typeface; **web** often uses Roboto or Roboto Flex with MD3 tokens. Replace only when intentionally customizing the type scale.
- **Ignore foldables and large screens**: MD3 is designed for all screen sizes. Don't ship phone-only layouts — use canonical layouts, multi-pane at 600dp+, and test on foldable/tablet emulators. Place no interactive content across the fold/hinge.
- **Stretch content to fill wide screens**: On Large (1200dp+) and Extra-large (1600dp+) windows, constrain content to a max width (840–1040dp). Endless-width text lines are unreadable.

## Building New Components

If the user requests a component that does not exist in the `@pawel-up/md` catalog, you must build it yourself. Follow these steps:

1. **Scaffold the Component**: Always use the templates defined in `.agent/rules/ui-templates.md`. Do not start from scratch or guess the Lit boilerplate.
2. **Use MD3 Tokens**: Apply the `md.sys` tokens (colors, typography, shape, elevation) as described in this skill.
3. **Avoid External Material Libraries**: Build the component natively using Lit (`@lit/reactive-element`, `lit-html`). Never import from `@material/mdc-*` or `@material/web`.
4. **Follow Progressive Enhancement**: Start with semantic HTML structure and ARIA attributes before applying styles and dynamic behavior.


## MD3 Compliance Audit

When invoked with `audit` as the argument (e.g., `/material-3 audit`), or when asked to audit/review MD3 compliance, analyze the target app or page and produce a compliance report.

Read `references/compliance-audit.md` for the full audit procedure, checklists, and scoring guide.

## Reference Documents

- `references/color-system.md` — Color roles, tonal palettes, dynamic color
- `references/typography-and-shape.md` — Type scale, shape corners, elevation, motion, Expressive notes
- `references/component-catalog.md` — Complete reference for `@pawel-up/md/md` components
- `references/layout-and-responsive.md` — Breakpoints, canonical layouts, insets, foldables
- `references/theming-and-dynamic-color.md` — Theming via CSS classes and dynamic color
- `references/compliance-audit.md` — Complete audit procedure and scoring guide
