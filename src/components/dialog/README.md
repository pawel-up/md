# UI Confirm Dialog

A simple Material Design 3 styled | Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls dialog visibility |
| `modal` | `boolean` | `true` | Whether dialog is modal (set by default) |
| `confirmLabel` | `string` | `'Confirm'` | Text for the confirm button |
| `dismissLabel` | `string` | `'Cancel'` | Text for the dismiss button |
| `destructive` | `boolean` | `false` | Styles confirm button with error colors for destructive actions |m dialog component for confirming user actions.

## Features

- **Material Design 3 Styling**: Follows MD3 design tokens and patterns
- **Customizable Button Labels**: Configure confirm and dismiss button text
- **Slot-based Content**: Flexible content structure with title and body slots
- **Modal by Default**: Designed for confirmation workflows
- **Accessible**: Supports keyboard navigation and screen readers
- **Built-in Event Handling**: Dispatches close events with detailed reason information

## Usage

### Basic Usage

```html
<ui-confirm-dialog .open="${showDialog}" @close="${handleClose}">
  <span slot="title">Confirm Action</span>
  <p>Are you sure you want to proceed with this action?</p>
</ui-confirm-dialog>
```

### Custom Button Labels

```html
<ui-confirm-dialog 
  confirmLabel="Delete" 
  dismissLabel="Keep"
  destructive
  .open="${showDialog}"
  @close="${handleClose}"
>
  <span slot="title">Delete Item</span>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
</ui-confirm-dialog>
```

### Event Handling

```javascript
function handleClose(e) {
  const { cancelled, value } = e.detail;
  if (!cancelled) {
    // User confirmed the action
    performAction();
  } else {
    // User dismissed the dialog
    console.log('Action cancelled');
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls dialog visibility |
| `modal` | `boolean` | `true` | Whether dialog is modal (set by default) |
| `confirmLabel` | `string` | `'Confirm'` | Text for the confirm button |
| `dismissLabel` | `string` | `'Cancel'` | Text for the dismiss button |

## Slots

| Slot | Description |
|------|-------------|
| `title` | Dialog title content |
| (default) | Main body content |

## Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `close` | `UiDialogClosingReason` | Fired when dialog is closed |

### UiDialogClosingReason

```typescript
interface UiDialogClosingReason {
  cancelled: boolean;  // true if dismissed, false if confirmed
  value?: unknown;     // optional value associated with the action
}
```

## Styling

The component uses Material Design 3 design tokens and can be styled using CSS custom properties:

```css
ui-confirm-dialog {
  --ui-dialog-max-width: 400px;
  --ui-dialog-max-height: 300px;
}
```

## Design Patterns

### Confirmation Workflows

Use this dialog when you need users to explicitly confirm an action:

- Deleting items
- Saving changes
- Leaving unsaved work
- Performing destructive actions

### Button Styling

The component follows Material Design patterns:

- **Dismiss button**: Text style (lower emphasis)
- **Confirm button**: Filled style (higher emphasis)

### Content Guidelines

- **Title**: Keep concise, use action-oriented language
- **Body**: Explain the consequence of the action
- **Button Labels**: Use specific, clear language

## Examples

### Delete Confirmation

```html
<ui-confirm-dialog 
  confirmLabel="Delete" 
  dismissLabel="Keep"
  destructive
  .open="${showDelete}"
>
  <span slot="title">Delete Item</span>
  <p>Are you sure you want to delete this item?</p>
  <p><strong>This action cannot be undone.</strong></p>
</ui-confirm-dialog>
```

### Save Changes

```html
<ui-confirm-dialog 
  confirmLabel="Save & Exit" 
  dismissLabel="Continue Editing"
  .open="${showSave}"
>
  <span slot="title">Save Changes</span>
  <p>You have unsaved changes in your document.</p>
  <p>Would you like to save your changes before exiting?</p>
</ui-confirm-dialog>
```

### Logout Confirmation

```html
<ui-confirm-dialog 
  confirmLabel="Logout" 
  dismissLabel="Stay Logged In"
  .open="${showLogout}"
>
  <span slot="title">Logout</span>
  <p>Are you sure you want to logout?</p>
</ui-confirm-dialog>
```

### Destructive Actions

Use the `destructive` attribute for actions that are permanent or could cause data loss:

- Deleting items
- Removing users
- Clearing data
- Resetting settings

The destructive styling uses Material Design error colors to provide clear visual feedback that the action is potentially harmful.

```html
<ui-confirm-dialog 
  confirmLabel="Delete Account" 
  dismissLabel="Cancel"
  destructive
  .open="${showDeleteAccount}"
>
  <span slot="title">Delete Account</span>
  <p>This will permanently delete your account and all associated data.</p>
  <p><strong>This action cannot be undone.</strong></p>
</ui-confirm-dialog>
```

## Accessibility

The component includes:

- Proper ARIA attributes
- Keyboard navigation support (ESC to dismiss)
- Focus management
- Screen reader compatibility

## Integration

To use in your project:

```typescript
import '../path/to/ui-confirm-dialog.js';
```

The component is available as `<ui-confirm-dialog>` in your HTML templates.
