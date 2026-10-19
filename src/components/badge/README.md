# Badge (`<ui-badge>`)

Material Design 3 badge web component for displaying notifications, counts, or status information on navigation items, tabs, and icons.

## Specification Compliance

Complies strictly with [Material Design 3 Badge Specifications](https://m3.material.io/components/badges/specs):

- **Small Badge (Dot Indicator)**:
  - 6dp × 6dp size
  - 3dp corner radius (circular dot)
  - Color role: `var(--md-sys-color-error)`
- **Large Badge (Numeric Count / Label)**:
  - 16dp height
  - 16dp minimum width
  - 8dp corner radius
  - 4dp horizontal padding
  - Typography: Label Small (`var(--md-sys-typescale-label-small-*)` — 11sp, 500 weight, 16sp line-height, 0.5px tracking)
  - Color role: `var(--md-sys-color-error)` (background) and `var(--md-sys-color-on-error)` (label text)
- **Positioning**:
  - In `attached` mode, the badge is centered over the top-trailing corner of its relative container (`inset-inline-end: 0; top: 0;` with logical bidirectional RTL support).
  - Fine-tune horizontal and vertical translation using `--ui-badge-offset-x` and `--ui-badge-offset-y`.

## Usage

```typescript
import '@pawel-up/md/badge/ui-badge.js'
```

### Small Dot Badge
```html
<ui-badge></ui-badge>
```

### Large Badge with Slotted Content
```html
<ui-badge>3</ui-badge>
```

### Custom Formatted Overflow Counts
```html
<!-- The author specifies the exact label or overflow format -->
<ui-badge>99+</ui-badge>
<ui-badge>999+</ui-badge>
<ui-badge>NEW</ui-badge>
```

### Force Dot Indicator
```html
<!-- Renders as 6x6dp dot even if content is slotted -->
<ui-badge dot>5</ui-badge>
```

### Attached / Overlay Mode
```html
<div style="position: relative; display: inline-flex;">
  <ui-icon>mail</ui-icon>
  <ui-badge attached>5</ui-badge>
</div>
```

## API

### Properties / Attributes

| Property | Attribute | Type | Default | Description |
|---|---|---|---|---|
| `dot` | `dot` | `boolean` | `false` | When true, forces the badge to render as a small dot indicator (6dp × 6dp). |
| `attached` | `attached` | `boolean` | `false` | When true, positions the badge absolutely at the top-trailing corner of its container. |

### Slots

| Slot | Description |
|---|---|
| `(default)` | The badge content (numeric count, label text, or custom nodes). If empty, badge renders in small dot mode. |

### CSS Custom Properties

| Custom Property | Default | Description |
|---|---|---|
| `--ui-badge-color` | `var(--md-sys-color-error)` | Fill background color. |
| `--ui-badge-label-color` | `var(--md-sys-color-on-error)` | Label text color for large badges. |
| `--ui-badge-shape-small` | `3px` | Corner radius for small dot badges. |
| `--ui-badge-shape-large` | `var(--md-sys-shape-corner-small, 8px)` | Corner radius for large badges. |
| `--ui-badge-size-small` | `6px` | Dimensions (width/height) of small dot badges. |
| `--ui-badge-size-large` | `16px` | Height and min-width of large badges. |
| `--ui-badge-offset-x` | `0px` | Horizontal translation offset when `attached` is set. |
| `--ui-badge-offset-y` | `0px` | Vertical translation offset when `attached` is set. |

### CSS Parts

| Part | Description |
|---|---|
| `badge` | The outer badge container. |
| `label` | The label text wrapper (rendered in large badge mode). |
