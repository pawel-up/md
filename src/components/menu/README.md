# UI Menu Components

A set of accessible, themeable, and modern menu components for the web, built as Lit web components. This package includes `<ui-menu>`, `<ui-menu-item>`, and `<ui-sub-menu>` to create simple dropdowns or complex, deeply-nested contextual menus.

The implementation leverages modern web platform features like the **Popover API** for overlay management and the **CSS Anchor Positioning API** for robust submenu placement, with built-in fallbacks for older browsers.

## Features

- **Modern & Performant**: Built on top of the native Popover API.
- **Flexible Positioning**: Uses the CSS Anchor Positioning API for precise submenu placement, avoiding complex JavaScript calculations.
- **Clean HTML Structure**: Submenus are linked via attributes (`id`, `submenu`, `anchor`), not nested in slots, leading to a flatter and more maintainable DOM.
- **Deep Nesting**: Supports multiple levels of submenus out of the box.
- **Accessible**: Follows WAI-ARIA patterns for menus, with full keyboard navigation support.
- **Themeable**: Style the components using CSS Custom Properties to match your design system.

## Usage

### Basic Menu

To create a simple menu, use a trigger element (like `<ui-button>`) and a `<ui-menu>` element. The trigger connects to the menu by setting its `popovertarget` attribute to the `id` of the menu.

```html
<!-- Trigger Button -->
<ui-button id="basic-menu-trigger" popovertarget="basic-menu">
  Open Menu
</ui-button>

<!-- Menu -->
<ui-menu id="basic-menu">
  <ui-menu-item>
    <span slot="start"><ui-icon>add</ui-icon></span>
    <span>New</span>
  </ui-menu-item>
  <ui-menu-item>
    <span slot="start"><ui-icon>folder</ui-icon></span>
    <span>Open</span>
  </ui-menu-item>
  <ui-menu-item disabled>
    <span slot="start"><ui-icon>save</ui-icon></span>
    <span>Save (Disabled)</span>
  </ui-menu-item>
  <div role="separator" style="height: 1px; background: #ccc; margin: 8px 0;"></div>
  <ui-menu-item>
    <span slot="start"><ui-icon>print</ui-icon></span>
    <span>Print</span>
  </ui-menu-item>
</ui-menu>

<script>
  document.querySelector('#basic-menu').addEventListener('select', (e) => {
    const { item, index } = e.detail;
    console.log(`Selected: "${item.textContent.trim()}" at index ${index}`);
  });
</script>
```

### Menu with Submenus

For menus with nested submenus, the components use an attribute-based relationship for a clean and flexible structure.

1. Give the parent `<ui-menu-item>` an `id`.
2. Add a `submenu` attribute to the `<ui-menu-item>` pointing to the id of the `<ui-sub-menu>`.
3. Add an `anchor` attribute to the `<ui-sub-menu>` pointing back to the id of its parent `<ui-menu-item>`.
4. **Important**: Place the `<ui-sub-menu>` elements inside the light DOM of the parent `<ui-menu>` (as children of the main menu element), not as separate standalone elements.

This approach allows for deep nesting and ensures proper keyboard event propagation. The submenus must be children of the parent menu for keyboard navigation to work correctly across menu levels.

```html
<!-- Trigger Button -->
<ui-button id="submenu-trigger" popovertarget="submenu-demo">
  Open Menu
</ui-button>

<!-- Main Menu -->
<ui-menu id="submenu-demo" @select="handleNestedMenuSelect">
  <!-- Menu Item with a Submenu -->
  <ui-menu-item id="file-item" submenu="file-submenu">
    <span slot="start"><ui-icon>docs</ui-icon></span>
    <span>File</span>
  </ui-menu-item>
  <ui-menu-item id="edit-item" submenu="edit-submenu">
    <span slot="start"><ui-icon>edit</ui-icon></span>
    <span>Edit</span>
  </ui-menu-item>
  <ui-menu-item>
    <span slot="start"><ui-icon>visibility</ui-icon></span>
    <span>View</span>
  </ui-menu-item>

  <!-- File Submenu (inside the main menu's light DOM) -->
  <ui-sub-menu id="file-submenu" anchor="file-item">
    <ui-menu-item>New File</ui-menu-item>
    <ui-menu-item>Open File</ui-menu-item>
    <!-- Nested Submenu Item -->
    <ui-menu-item id="export-item" submenu="export-submenu">
      <span slot="start"><ui-icon>file_export</ui-icon></span>
      <span>Export</span>
    </ui-menu-item>

    <!-- Deeply Nested Export Submenu (inside the file submenu) -->
    <ui-sub-menu id="export-submenu" anchor="export-item">
      <ui-menu-item>Export as PDF</ui-menu-item>
      <ui-menu-item>Export as PNG</ui-menu-item>
    </ui-sub-menu>
  </ui-sub-menu>

  <!-- Edit Submenu (inside the main menu's light DOM) -->
  <ui-sub-menu id="edit-submenu" anchor="edit-item">
    <ui-menu-item>Undo</ui-menu-item>
    <ui-menu-item>Redo</ui-menu-item>
    <ui-menu-item>Cut</ui-menu-item>
  </ui-sub-menu>
</ui-menu>
```

### Grouped Menus (MD3 Expressive Gaps)

Material Design 3 introduces **Grouped Menus**, organizing related actions into separate elevated card containers separated by 8dp expressive gaps instead of traditional line dividers.

Wrap menu items in `<ui-menu-group>` elements with optional `header` text or slot:

```html
<ui-button popovertarget="grouped-menu">Open Grouped Menu</ui-button>

<ui-menu id="grouped-menu">
  <ui-menu-group header="Actions" aria-label="Actions">
    <ui-menu-item>
      <span slot="start"><ui-icon>edit</ui-icon></span>
      <span>Edit</span>
    </ui-menu-item>
    <ui-menu-item>
      <span slot="start"><ui-icon>share</ui-icon></span>
      <span>Share</span>
    </ui-menu-item>
  </ui-menu-group>

  <ui-menu-group header="Manage" aria-label="Manage">
    <ui-menu-item>
      <span slot="start"><ui-icon>archive</ui-icon></span>
      <span>Archive</span>
    </ui-menu-item>
    <ui-menu-item>
      <span slot="start"><ui-icon>delete</ui-icon></span>
      <span>Delete</span>
    </ui-menu-item>
  </ui-menu-group>
</ui-menu>
```

**Seamless Single-List Keyboard Navigation**:
The parent `<ui-menu>` automatically detects `<ui-menu-group>` children, flattens all nested items into a unified list, and synchronizes `density` and `variant`. Users can press <kbd>↓</kbd> or <kbd>↑</kbd> to seamlessly transition across group boundaries without interruptions or extra keystrokes.

### Multi-Select Menus

Set `multiselect` (or `multiSelect`) on `<ui-menu>` to allow multiple selections. In multi-select mode:
- Selecting an item toggles its `selected` attribute without automatically closing the popover.
- Items automatically adopt `role="menuitemcheckbox"` and `aria-checked="true|false"`.
- Selected items display the MD3 pill-shaped selection background highlight.
- Access currently selected items at any time via the `.selectedItems` property.

```html
<ui-menu id="filter-menu" multiselect>
  <ui-menu-item selected>Status: Active</ui-menu-item>
  <ui-menu-item>Status: Pending</ui-menu-item>
  <ui-menu-item>Status: Archived</ui-menu-item>
</ui-menu>
```

### Variants and Density

Menus support standard and vibrant color variants, as well as MD3 density scale (0 to -3):

```html
<!-- Vibrant Variant -->
<ui-menu variant="vibrant">
  <ui-menu-item>Featured Action</ui-menu-item>
</ui-menu>

<!-- Density Scale: 0 (48px), -1 (44px), -2 (40px), -3 (36px) -->
<ui-menu density="-2">
  <ui-menu-item>Compact item</ui-menu-item>
</ui-menu>
```

## Components

### `<ui-menu>`

The main menu container that holds menu items, groups, and submenus.

#### Menu Attributes

- `open` (boolean) - Whether the menu is currently open
- `disabled` (boolean) - Whether the menu is disabled
- `popover` (string) - Native popover attribute, typically set to "auto"
- `id` (string) - Required for popover targeting
- `multiselect` / `multiSelect` (boolean) - Enables multi-selection mode
- `variant` (`'standard' | 'vibrant'`) - Color variant (default: `'standard'`)
- `density` (`'0' | '-1' | '-2' | '-3'`) - Density scale (default: `'0'`)

#### Menu Properties

- `selectedItems` (`UiMenuItem[]`) - Array of currently selected items in the menu

#### Menu Events

- `select` - Dispatched when a menu item is selected. Event detail contains `{ item, index }`
- `open` - Dispatched when the menu is opened
- `close` - Dispatched when the menu is closed

#### Menu Methods

- `show()` - Programmatically show the menu
- `hide()` - Programmatically hide the menu
- `togglePopover(force?)` - Toggle the menu's popover state

### `<ui-menu-group>`

Container for visual and semantic grouping inside `<ui-menu>` with 8dp expressive gaps.

> **Accessibility**: `<ui-menu-group>` sets `role="group"`. Consumers must provide `aria-label` or `aria-labelledby` directly on `<ui-menu-group>` to ensure screen readers and accessibility evaluators (such as axe-core) can properly identify the group name.

#### Menu Group Attributes

- `aria-label` (string) - Accessible label for the group (consumer-provided)
- `variant` (`'standard' | 'vibrant'`) - Inherited automatically from parent `<ui-menu>`
- `density` (`'0' | '-1' | '-2' | '-3'`) - Inherited automatically from parent `<ui-menu>`

#### Menu Group Slots

- Default slot - Child `<ui-menu-item>` elements
- `header` - Custom header content (overrides `header` attribute)

#### Menu Group Properties

- `items` (`UiMenuItem[]`) - Child menu items within this group

### `<ui-menu-item>`

Individual menu items that can trigger actions or open submenus.

#### Menu Item Attributes

- `disabled` (boolean) - Whether the menu item is disabled
- `selected` (boolean) - Whether the item is selected
- `submenu` (string) - ID of the associated submenu element
- `id` (string) - Required when the item has a submenu (for anchoring)
- `variant` (`'standard' | 'vibrant'`) - Inherited automatically
- `density` (`'0' | '-1' | '-2' | '-3'`) - Inherited automatically

#### Menu Item Slots

- Default slot - The main content of the menu item
- `start` - Content before the main text (e.g., icons)
- `end` - Content after the main text
- `end-text` - Supporting text at the end

#### Menu Item Events

- `select` - Dispatched when the menu item is clicked (if no submenu)
- `submenu-open` - Dispatched when a submenu is opened

### `<ui-sub-menu>`

Submenu containers that extend the main menu component with additional positioning logic.

#### Sub-menu Attributes

- `anchor` (string) - ID of the parent menu item that this submenu is anchored to
- `open` (boolean) - Whether the submenu is currently open
- `disabled` (boolean) - Whether the submenu is disabled
- `popover` (string) - Native popover attribute, typically set to "auto"
- `id` (string) - Required for menu item targeting

#### Sub-menu Events

- `select` - Dispatched when a submenu item is selected
- `open` - Dispatched when the submenu is opened  
- `close` - Dispatched when the submenu is closed

#### Sub-menu Methods

- `show()` - Programmatically show the submenu
- `hide()` - Programmatically hide the submenu
- `setParentMenu(menu)` - Set the parent menu for proper event handling


## Keyboard Navigation

The menu components support full keyboard navigation:

- **Arrow Keys**: Navigate between menu items
- **Enter/Space**: Select a menu item or open a submenu
- **Arrow Right**: Open a submenu (when focused on an item with submenu)
- **Arrow Left**: Close current submenu and return to parent
- **Escape**: Close the current menu/submenu
- **Home/End**: Jump to first/last menu item

## Styling

The components can be styled using CSS Custom Properties. Key styling hooks include:

```css
ui-menu {
  --md-menu-container-color: white;
  --md-menu-container-elevation: 2;
  --md-menu-item-height: 48px;
  /* ... other custom properties */
}
```

## Accessibility

The menu components follow WAI-ARIA best practices:

- Menu containers have `role="menu"`
- Menu items have `role="menuitem"`
- Items with submenus have `aria-haspopup="true"` and `aria-expanded` attributes
- Full keyboard navigation is supported
- Proper focus management when opening/closing menus
- Screen reader announcements for menu state changes

## Best Practices

### Structure Requirements

1. **Light DOM Placement**: Always place `<ui-sub-menu>` elements inside the light DOM of their parent `<ui-menu>` or `<ui-sub-menu>`. This ensures proper keyboard event propagation.

2. **ID Management**: Ensure menu items that have submenus have unique `id` attributes, and their corresponding submenus reference them via the `anchor` attribute.

3. **Popover Attributes**: Include `popover="auto"` on both `<ui-menu>` and `<ui-sub-menu>` elements for proper native popover behavior.

### Event Handling

```javascript
// Listen for menu selections
document.querySelector('#my-menu').addEventListener('select', (e) => {
  const { item, index } = e.detail;
  console.log(`Selected: "${item.textContent.trim()}" at index ${index}`);
});
```

### Trigger Connection

Connect triggers to menus using the native `popovertarget` attribute:

```html
<ui-button popovertarget="my-menu">Open Menu</ui-button>
<ui-menu id="my-menu">
  <!-- menu items -->
</ui-menu>
```

This leverages the native Popover API for optimal performance and browser integration.
