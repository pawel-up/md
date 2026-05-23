# MD3 Component Catalog

## Actions

### Buttons

**Import:**
```javascript
import '@pawel-up/md/button/ui-button.js';
```

MD3 has 5 button types ordered by emphasis: Filled > Filled Tonal > Elevated > Outlined > Text.

#### Filled Button

The Filled button provides high emphasis and represents the primary action of a screen. It should be used for the most important actions in a user flow, such as "Save", "Submit", or "Confirm".

**Visuals & Tokens:**
- **Container Color**: `primary` (`--md-sys-color-primary`)
- **Label Text Color**: `on-primary` (`--md-sys-color-on-primary`)
- **Container Shape**: `full` (`--md-sys-shape-corner-full`)
- **Typography**: `label-large` (`--md-sys-typescale-label-large`)
- **Elevation**: 
  - Resting: Level 0 (no shadow)
  - Hover/Focus/Pressed: Level 1

**When to use:**
- Only use one primary (filled) button per screen or context to avoid diluting emphasis.
- Use for the final or most critical action of a user flow.

**Example usage (base-ui):**
```html
<!-- In base-ui, the 'filled' style is the default color attribute -->
<ui-button color="filled">Save Changes</ui-button>
<ui-button>Submit</ui-button> <!-- Also defaults to filled -->
```

#### Filled Tonal Button

The Filled Tonal button provides medium emphasis. It represents secondary actions that are important but not the primary focus of the screen.

**Visuals & Tokens:**
- **Container Color**: `secondary-container` (`--md-sys-color-secondary-container`)
- **Label Text Color**: `on-secondary-container` (`--md-sys-color-on-secondary-container`)
- **Container Shape**: `full` (`--md-sys-shape-corner-full`)
- **Typography**: `label-large` (`--md-sys-typescale-label-large`)
- **Elevation**: 
  - Resting: Level 0 (no shadow)
  - Hover/Focus/Pressed: Level 1

**When to use:**
- Use for secondary actions alongside a primary (filled) button.
- Good for repeated actions in lists or cards where a filled button would be too visually heavy.

**Example usage (base-ui):**
```html
<ui-button color="tonal">Cancel</ui-button>
```

#### Elevated Button

The Elevated button provides medium emphasis. It is essentially a tonal button with a shadow, meant to be used when a button needs to stand out against a busy or patterned background.

**Visuals & Tokens:**
- **Container Color**: `surface-container-low` (`--md-sys-color-surface-container-low`)
- **Label Text Color**: `primary` (`--md-sys-color-primary`)
- **Container Shape**: `full` (`--md-sys-shape-corner-full`)
- **Typography**: `label-large` (`--md-sys-typescale-label-large`)
- **Elevation**: 
  - Resting: Level 1
  - Hover/Focus/Pressed: Level 2

**When to use:**
- Use on top of images, varied backgrounds, or scrolling content to ensure the button remains visible and clearly distinct from the background.

**Example usage (base-ui):**
```html
<ui-button color="elevated">View Options</ui-button>
```

#### Outlined Button

The Outlined button provides medium-low emphasis. It relies on its border to define its shape and is used for secondary actions where a lighter visual weight is desired.

**Visuals & Tokens:**
- **Container Color**: Transparent
- **Outline Color**: `outline` (`--md-sys-color-outline`)
- **Label Text Color**: `primary` (`--md-sys-color-primary`)
- **Container Shape**: `full` (`--md-sys-shape-corner-full`)
- **Typography**: `label-large` (`--md-sys-typescale-label-large`)
- **Elevation**: Level 0 (no shadow)

**When to use:**
- Use for alternative actions or secondary choices.
- Often paired with filled buttons to offer an alternative, less prominent action (e.g., "Back" or "Cancel").

**Example usage (base-ui):**
```html
<ui-button color="outlined">Back</ui-button>
```

#### Text Button

The Text button provides the lowest emphasis. It appears as text without a container or outline at rest, relying on its position and text color to signify interactivity.

**Visuals & Tokens:**
- **Container Color**: Transparent
- **Label Text Color**: `primary` (`--md-sys-color-primary`)
- **Container Shape**: `full` (`--md-sys-shape-corner-full`)
- **Typography**: `label-large` (`--md-sys-typescale-label-large`)
- **Elevation**: Level 0 (no shadow)

**When to use:**
- Use for less critical actions, especially when space is limited.
- Ideal for dialog actions (e.g., "Agree", "Decline") or within cards.

**Example usage (base-ui):**
```html
<ui-button color="text">Learn More</ui-button>
```

### Button Group

**Import:**
```javascript
import '@pawel-up/md/button/ui-button-group.js';
import '@pawel-up/md/button/ui-button.js'; // Needed for the inner buttons
```

Button groups (or Segmented Buttons in MD3) are used to group related choices or actions together. 

The `base-ui` implementation uses the `<ui-button-group>` component to manage the layout, shape, size, and selection state of the buttons it contains. Inner buttons must have the `toggle` attribute to participate in selection state management.

**Properties & Configuration:**
- **Type (`type`)**: 
  - `standard` (default): Buttons are spaced apart with their normal rounded shapes.
  - `connected`: Buttons are visually joined together (squared edges) into a single continuous segmented control.
- **Selection (`multiple`)**: 
  - Single selection (default): Acts like radio buttons. Selecting one button automatically deselects the others.
  - Multi-selection (`multiple` attribute): Allows selecting more than one button simultaneously.
- **Size (`size`)**: Automatically propagates the size (e.g., `s`, `m`, `l`) to all buttons in the group.

**When to use:**
- To select options, switch views, or apply filters/sorting.
- Typically contains 2-5 segments.

**Example usage (base-ui):**
```html
<!-- Connected, single-selection (MD3 Segmented Button) -->
<ui-button-group type="connected">
  <ui-button toggle selected>Day</ui-button>
  <ui-button toggle>Week</ui-button>
  <ui-button toggle>Month</ui-button>
</ui-button-group>

<!-- Standard, multi-selection -->
<ui-button-group type="standard" multiple>
  <ui-button toggle>Bold</ui-button>
  <ui-button toggle>Italic</ui-button>
  <ui-button toggle>Underline</ui-button>
</ui-button-group>
```

### Icon Button

**Import:**
```javascript
import '@pawel-up/md/icon-button/ui-icon-button.js';
// Usually you will also need the icon component itself
import '@pawel-up/md/icons/ui-icon.js';
```

Icon buttons help people take supplementary actions with a single tap. They're used when a compact button is required, such as in toolbars, app bars, or alongside text.

**Properties & Configuration:**
- **Color Variant (`color`)**:
  - `standard` (default): A flat, uncontained icon. Highest utility, lowest emphasis.
  - `filled`: High emphasis. Contains the icon in a solid background.
  - `tonal` (Filled Tonal): Medium emphasis. Contains the icon in a secondary-container background.
  - `outlined`: Medium-low emphasis. Contains the icon within an outline boundary.
- **Width (`width`)**:
  - `default` (default): The standard circular shape.
  - `narrow`: A compressed, capsule-like shape horizontally.
  - `wide`: An expanded, capsule-like shape horizontally.
- **Toggle State**: Like standard buttons, icon buttons can act as toggles by adding the `toggle` attribute.

**Visuals & Tokens:**
- **Container Shape**: `full` (`--md-sys-shape-corner-full`) by default, though it adapts if `width` is changed.
- **Elevation**: Follows the same elevation patterns as their standard button counterparts.

**When to use:**
- Use for actions where an icon alone is widely understood (like search, settings, or favorite).
- Use `standard` for app bars and list items.
- Use `filled`, `tonal`, or `outlined` when the action needs more emphasis or separation from the background.

**Example usage (base-ui):**
```html
<!-- Standard (default) icon button -->
<ui-icon-button>
  <ui-icon>search</ui-icon>
</ui-icon-button>

<!-- Filled icon button -->
<ui-icon-button color="filled">
  <ui-icon>add</ui-icon>
</ui-icon-button>

<!-- Tonal, wide icon button -->
<ui-icon-button color="tonal" width="wide">
  <ui-icon>settings</ui-icon>
</ui-icon-button>
```

### Segmented Button

**Import:**
```javascript
import '@pawel-up/md/segmented-button/ui-segmented-button-set.js';
import '@pawel-up/md/segmented-button/ui-segmented-button.js';
```

While `ui-button-group` can group standard buttons together, the `<ui-segmented-button-set>` component implements the precise Material Design 3 Segmented Button specification. This includes the signature behavior of animating a checkmark in place of the leading icon when a segment is selected.

**Properties & Configuration:**
- **Set (`<ui-segmented-button-set>`)**:
  - `multiselect`: When true, allows selecting multiple segments simultaneously. By default, it operates in single-selection mode (acting like radio buttons).
- **Button (`<ui-segmented-button>`)**:
  - `selected`: Indicates if the segment is currently active.
  - `disabled`: Disables the specific segment.
  - `icon` (slot): Optional slot for a leading icon. When the button is selected, this icon is temporarily hidden and replaced by a checkmark.

**Visuals & Tokens:**
- **Container**: Segments are visually connected, with rounded outer edges and straight inner borders.
- **Typography**: `label-large` (`--md-sys-typescale-label-large`)

**When to use:**
- To select options, switch views, or apply filters/sorting where the explicit "checked" state is required by design.
- Typically contains 2-5 segments.

**Example usage (base-ui):**
```html
<!-- Single-selection (default) Segmented Button -->
<ui-segmented-button-set>
  <ui-segmented-button selected>
    <ui-icon slot="icon">calendar_view_day</ui-icon>
    Day
  </ui-segmented-button>
  <ui-segmented-button>
    <ui-icon slot="icon">calendar_view_week</ui-icon>
    Week
  </ui-segmented-button>
  <ui-segmented-button>
    <ui-icon slot="icon">calendar_view_month</ui-icon>
    Month
  </ui-segmented-button>
</ui-segmented-button-set>

<!-- Multi-selection Segmented Button without icons -->
<ui-segmented-button-set multiselect>
  <ui-segmented-button>Walking</ui-segmented-button>
  <ui-segmented-button>Transit</ui-segmented-button>
  <ui-segmented-button>Driving</ui-segmented-button>
</ui-segmented-button-set>
```

### Progress Indicators

**Import:**
```javascript
// Linear Progress
import '@pawel-up/md/progress/ui-progress.js';
// Circular Progress
import '@pawel-up/md/progress/ui-circular-progress.js';
```

Progress indicators inform users about the status of ongoing processes, such as loading an app, submitting a form, or saving updates.

**Types:**
1. **Linear (`<ui-progress>`)**: A horizontal progress bar.
2. **Circular (`<ui-circular-progress>`)**: A spinning circular indicator.

**Shared Properties (`UiRange`):**
- `value`: The current progress amount.
- `min` (default `0`) & `max` (default `100`): The lower and upper bounds of the progress range.
- `indeterminate`: A boolean attribute. When present, the indicator shows a continuous animation instead of a specific value (useful when the exact completion time is unknown).

**Specific Properties:**
- **Linear (`<ui-progress>`)**:
  - `secondaryProgress`: A numeric value that displays a secondary, distinct track. This is typically used to represent a background operation (like media buffering behind the active playhead).
- **Circular (`<ui-circular-progress>`)**:
  - `fourColor` (`fourcolor` attribute): When `indeterminate` is also true, the circular spinner cycles through 4 colors (Primary, Primary Container, Tertiary, Tertiary Container) instead of a single static color.

**When to use:**
- **Linear**: For major transitions (page loads, file uploads) where the indicator can be pinned to the edge of a container or page.
- **Circular**: For localized loading states (e.g., inside a button, next to an item in a list, or centered in an empty container).
- **Determinate**: When you can calculate how long an operation will take.
- **Indeterminate**: When the progress isn't measurable or the delay is expected to be short.

**Example usage (base-ui):**
```html
<!-- Determinate linear progress (e.g., 50%) -->
<ui-progress value="50" max="100"></ui-progress>

<!-- Indeterminate linear progress -->
<ui-progress indeterminate></ui-progress>

<!-- Determinate linear progress with secondary track (e.g., video buffering) -->
<ui-progress value="30" secondaryProgress="60" max="100"></ui-progress>

<!-- Determinate circular progress -->
<ui-circular-progress value="75" max="100"></ui-circular-progress>

<!-- Indeterminate circular progress with 4-color animation -->
<ui-circular-progress indeterminate fourcolor></ui-circular-progress>
```



### Dialog

**Import:**
```javascript
// Base Dialog
import '@pawel-up/md/dialog/ui-dialog.js';
// Pre-configured Confirm Dialog (helper)
import '@pawel-up/md/dialog/ui-confirm-dialog.js';
```

Dialogs provide important prompts in a user flow. They can require an action, communicate information, or help users complete a task. The `base-ui` implementation uses the native HTML `<dialog>` element under the hood, meaning it renders in the top layer and provides excellent accessibility and focus management out of the box.

**Properties & Configuration:**
- `open`: Boolean that controls the visibility of the dialog.
- `modal`: Boolean (default `false` on base dialog). When true, opens as a modal (blocking interaction with the rest of the page). `<ui-confirm-dialog>` defaults this to `true`.
- `constrain`: Boolean. When true, constrains the dialog's content to a maximum width/height and forces a scrollbar if the content overflows.
- `confirmLabel` / `dismissLabel`: Strings that automatically generate text buttons in the action area without needing manual slots.
- `destructive`: Boolean. When true, styles the generated confirm button with error colors to indicate a dangerous action (e.g., delete).
- `submitClose`: Boolean. When true and the dialog is wrapped in a `<form>`, the dialog automatically closes upon successful form submission.

**Slots:**
- `(default)`: The main body content.
- `title`: Text for the dialog's title.
- `icon`: An optional `<ui-icon>` placed above the title.
- `button`: Custom actions area. Buttons placed here with `value="dismiss"` or `value="confirm"` will automatically trigger the close sequence.

**Events:**
- `@closing`: A cancellable event fired before the dialog closes. You can call `e.preventDefault()` to stop the dialog from closing (useful for async validation).
- `@close`: Fired after the dialog closes. `e.detail` contains `{ cancelled: boolean, value?: unknown }` indicating how the dialog was closed.

**When to use:**
- To interrupt the user for a critical decision or confirmation.
- Keep content concise. Avoid scrolling unless using the `constrain` property for lengthy content.

**Example usage (base-ui):**
```html
<!-- Custom Dialog with Slotted Buttons -->
<ui-dialog modal .open="${this.showDialog}">
  <ui-icon slot="icon">delete</ui-icon>
  <span slot="title">Delete photos?</span>
  <p>This action will permanently remove the selected pictures.</p>
  
  <ui-button slot="button" color="text" value="dismiss">Cancel</ui-button>
  <ui-button slot="button" color="text" value="confirm">Delete</ui-button>
</ui-dialog>

<!-- Declarative Confirm Dialog Helper -->
<ui-confirm-dialog 
  confirmLabel="Delete Account" 
  dismissLabel="Cancel"
  destructive
  .open="${this.showDeleteAccount}"
  @close="${this.handleDialogClose}"
>
  <span slot="title">Delete Account</span>
  <p>This will permanently delete your account. This action cannot be undone.</p>
</ui-confirm-dialog>
```

## Inputs

### Checkbox

**Import:**
```javascript
import '@pawel-up/md/checkbox/ui-checkbox.js';
```

Checkboxes allow users to select one or more items from a set. Checkboxes can turn an option on or off. The `base-ui` implementation is fully form-associated and acts exactly like a native `<input type="checkbox">`.

**Properties & Configuration:**
- `checked`: Boolean indicating whether the checkbox is checked.
- `indeterminate`: Boolean indicating whether the checkbox is in an indeterminate (mixed) state. When true, the checkbox renders with a dash icon, and its checked value is effectively ignored on form submission.
- `disabled`: Boolean. Disables interaction.
- `required`: Boolean. Marks the checkbox as required for form submission (useful for "accept terms" checkboxes).
- `name` / `value`: Form association attributes. `value` defaults to `"on"`.
- `invalid`: Boolean. Reflects the validation state. Updates when `reportValidity()` is called.

**Events:**
- `@change` / `@input`: Fired when the checked state changes via user interaction. Both events are dispatched simultaneously to match native input behavior.

**When to use:**
- When the user needs to select multiple options from a list.
- When there is a single "yes/no" or "on/off" decision (though a Switch might be better for immediate actions).

**Example usage (base-ui):**
```html
<!-- Basic unchecked and checked checkboxes -->
<ui-checkbox></ui-checkbox>
<ui-checkbox checked></ui-checkbox>

<!-- Indeterminate state -->
<ui-checkbox indeterminate></ui-checkbox>

<!-- Disabled variants -->
<ui-checkbox disabled></ui-checkbox>
<ui-checkbox checked disabled></ui-checkbox>

<!-- Form integration -->
<form>
  <label>
    <ui-checkbox name="terms" required></ui-checkbox>
    I agree to the terms and conditions
  </label>
  <button type="submit">Submit</button>
</form>
```

### Chips

**Import:**
```javascript
import '@pawel-up/md/chip/ui-chip.js';
import '@pawel-up/md/chip/ui-chip-set.js';
```

Chips help people enter information, make selections, filter content, or trigger actions. While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

**Properties & Configuration (`<ui-chip>`):**
- `type`: Specifies the variant of the chip. Accepts `"assist" | "filter" | "input" | "suggestion"`. Defaults to `"assist"`.
- `elevated`: Boolean. When true, renders an elevated version of the chip instead of the default flat/tonal style.
- `checked`: Boolean. Only used visually. When `type="filter"`, this controls the visibility of the leading checkmark.
- `removable`: Boolean. When true and `type="input"`, the chip renders a trailing close icon.
- `list`: Boolean. When true and `type="filter"`, renders a trailing dropdown arrow icon.
- `disabled`: Boolean. Disables the chip.

**Slots (`<ui-chip>`):**
- `(default)`: The text label.
- `icon`: A leading icon, usually `<ui-icon>`. Designed for 18x18px.
- `avatar`: A leading image (like a user profile photo). Designed for 24x24px.

**Events (`<ui-chip>`):**
- `@select`: Fired when a `filter` chip is clicked and its `checked` state toggles.
- `@remove`: Fired when the trailing close icon of a `removable` `input` chip is clicked, or when Backspace is pressed while focused.

**Chip Set (`<ui-chip-set>`):**
Always group chips inside a `<ui-chip-set>`. The set automatically manages focus and keyboard navigation (Arrow keys, Home, End) between the grouped chips according to accessibility standards (`role="toolbar"`).

**Example usage (base-ui):**
```html
<ui-chip-set>
  <!-- Assist Chip (Trigger an action) -->
  <ui-chip type="assist">
    <ui-icon slot="icon">event</ui-icon>
    Add to calendar
  </ui-chip>

  <!-- Filter Chip (Toggle selection) -->
  <ui-chip type="filter" checked @select="${this.handleFilter}">
    Open Issues
  </ui-chip>

  <!-- Filter Chip with Dropdown -->
  <ui-chip type="filter" list>
    Assignee
  </ui-chip>

  <!-- Input Chip (Removable data entry) -->
  <ui-chip type="input" removable @remove="${this.handleRemove}">
    <img slot="avatar" src="/user.jpg" alt="User">
    Jane Doe
  </ui-chip>

  <!-- Suggestion Chip -->
  <ui-chip type="suggestion" elevated>
    Share location
  </ui-chip>
</ui-chip-set>
```

### Radio Button

**Import:**
```javascript
import '@pawel-up/md/radio/ui-radio.js';
```

Radio buttons allow users to select exactly one option from a set. The `base-ui` implementation is fully form-associated and acts exactly like a native `<input type="radio">`, including automatic grouping by `name` and full keyboard navigation (arrow keys).

**Properties & Configuration:**
- `checked`: Boolean indicating whether the radio button is selected. Note: selecting one radio button automatically deselects others with the same `name` within the same form boundary.
- `disabled`: Boolean. Disables interaction.
- `required`: Boolean. Marks the radio group as required for form submission.
- `name`: Form association grouping name. Critical for defining mutually exclusive sets of radio buttons.
- `value`: Form association attribute. The value submitted when this radio button is checked.
- `invalid`: Boolean. Reflects the validation state.

**Events:**
- `@change` / `@input`: Fired when the checked state changes via user interaction. Both events are dispatched simultaneously to match native input behavior.

**When to use:**
- When the user needs to select exactly one option from a list of mutually exclusive options.
- If the user can select multiple options, use Checkboxes instead.

**Example usage (base-ui):**
```html
<form>
  <!-- Mutually exclusive radio group -->
  <label>
    <ui-radio name="fruit" value="apple" checked></ui-radio>
    Apple
  </label>
  
  <label>
    <ui-radio name="fruit" value="banana"></ui-radio>
    Banana
  </label>
  
  <label>
    <ui-radio name="fruit" value="mango"></ui-radio>
    Mango
  </label>

  <!-- Disabled radio button -->
  <label>
    <ui-radio name="fruit" value="pear" disabled></ui-radio>
    Pear (Out of season)
  </label>
</form>
```

### Switch

**Import:**
```javascript
import '@pawel-up/md/switch/ui-switch.js';
```

Switches toggle the state of a single item on or off. They are the preferred way to adjust settings on mobile and tablet. Like Checkboxes and Radio Buttons, the `base-ui` implementation is fully form-associated.

**Properties & Configuration:**
- `checked`: Boolean indicating whether the switch is in the "on" state.
- `onIcon`: Boolean. When true, renders a checkmark icon on the switch thumb when checked.
- `offIcon`: Boolean. When true, renders an "X" (close) icon on the switch thumb when unchecked.
- `disabled`: Boolean. Disables interaction.
- `required`: Boolean. Marks the switch as required for form submission.
- `name` / `value`: Form association attributes. `value` defaults to `"on"`.

*Note: You can also override the default icons by passing Lit `SVGTemplateResult` objects to the `onIconInstance` and `offIconInstance` JavaScript properties (not available as HTML attributes).*

**Events:**
- `@change` / `@input`: Fired when the toggled state changes via user interaction. Both events are dispatched simultaneously to match native input behavior.

**When to use:**
- Best for settings or preferences where the effect of the toggle is immediately applied or clearly understood as an active/inactive state.
- For multiple selections in a list, prefer Checkboxes.

**Example usage (base-ui):**
```html
<!-- Basic Switch -->
<label>
  <ui-switch name="notifications"></ui-switch>
  Enable Notifications
</label>

<!-- Switch with ON icon -->
<ui-switch checked onIcon></ui-switch>

<!-- Switch with ON and OFF icons -->
<ui-switch onIcon offIcon></ui-switch>

<!-- Disabled Switch -->
<ui-switch disabled></ui-switch>
```

### Text Field

**Import:**
```javascript
// For the filled style variant
import '@pawel-up/md/text-field/ui-filled-text-field.js';

// For the outlined style variant
import '@pawel-up/md/text-field/ui-outlined-text-field.js';
```

Text fields let users enter and edit text. The `base-ui` implementation provides both Material Design 3 variants: **Filled** and **Outlined**. They both share the exact same underlying logic and API, behaving as fully form-associated `<input>` elements.

**Properties & Configuration:**
- `label`: String. The floating label displayed inside the input (or above it when focused/filled).
- `type`: String. The HTML input type (e.g., `"text"`, `"password"`, `"email"`, `"number"`).
- `value`: String. The current value of the input.
- `supportingText`: String. Helper text displayed beneath the input field.
- `invalidText`: String. Error message displayed beneath the field when `invalid` is true (replaces `supportingText`).
- `invalid`: Boolean. Forces the field into an error state. This is also automatically updated when calling `reportValidity()`.
- `disabled` / `required` / `readOnly`: Standard boolean input attributes.
- `placeholder`: String. Shown when the field is empty and focused.
- `noFloating`: Boolean. When true, the label acts like a standard placeholder and disappears entirely when text is entered, rather than floating to the top.
- *Standard HTML `<input>` attributes are supported:* `max`, `maxLength`, `min`, `minLength`, `pattern`, `autocomplete`, `inputMode`, etc.

**Slots:**
- `prefix`: Renders content (like an `<ui-icon>`) at the leading edge of the input.
- `suffix`: Renders content (like an `<ui-icon-button>`) at the trailing edge of the input.

**When to use:**
- `ui-outlined-text-field`: Recommended for most forms in light interfaces as they have less visual dominance.
- `ui-filled-text-field`: Recommended when you need strong visual emphasis or when placed on top of complex backgrounds.

**Example usage (base-ui):**
```html
<!-- Outlined Text Field -->
<ui-outlined-text-field 
  label="Email Address" 
  type="email" 
  required
  supportingText="We'll never share your email."
>
  <ui-icon slot="prefix">mail</ui-icon>
</ui-outlined-text-field>

<!-- Filled Text Field with Error State -->
<ui-filled-text-field 
  label="Password" 
  type="password" 
  invalid
  invalidText="Password must be at least 8 characters."
>
  <ui-icon slot="prefix">lock</ui-icon>
</ui-filled-text-field>
```

### Select

**Import:**
```javascript
import '@pawel-up/md/select/ui-select.js';
import '@pawel-up/md/select/ui-option.js';
```

Select menus display a list of choices on temporary surfaces. The `base-ui` implementation mimics an outlined text field visually, but opens a `<ui-menu>` containing `<ui-option>` items. It is fully form-associated and supports type-ahead keyboard navigation.

**Properties & Configuration (`<ui-select>`):**
- `value`: String. The currently selected value. Setting this programmatically will update the visually selected option.
- `label`: String. The floating label displayed inside the select field.
- `name`: String. The name attribute for form submission.
- `supportingText`: String. Helper text displayed beneath the select field.
- `invalidText`: String. Error message displayed when `invalid` is true.
- `invalid`: Boolean. Forces the field into an error state. This updates automatically if `required` is true and `reportValidity()` is called.
- `disabled`: Boolean. Disables the select menu.
- `required`: Boolean. Marks the selection as required for form validation.
- `open`: Boolean. Reflects and controls whether the dropdown menu is currently open.

**Events (`<ui-select>`):**
- `@change`: Fired when the selection changes via user interaction. The `event.detail` contains `{ value, item }`, where `item` is the selected `<ui-option>` element.
- `@open` / `@close`: Fired when the dropdown opens or closes.

**Option Configuration (`<ui-option>`):**
`<ui-option>` extends the `UiListItem` component, meaning it supports the same rich layout slots:
- `value`: String. The underlying value of the option submitted with the form.
- `selected`: Boolean. Indicates if the option is currently chosen (managed automatically by `<ui-select>`).
- **Slots**:
  - `(default)`: The primary label text.
  - `start`: Leading visual (e.g., `<ui-icon>`).
  - `end`: Trailing visual.
  - `supporting-text`: Secondary text displayed below the primary label.

**Example usage (base-ui):**
```html
<ui-select label="Country" name="country" required>
  <!-- Basic Option -->
  <ui-option value="us">United States</ui-option>
  
  <!-- Pre-selected Option -->
  <ui-option value="ca" selected>Canada</ui-option>
  
  <!-- Option with icon and supporting text -->
  <ui-option value="mx">
    <ui-icon slot="start">flag</ui-icon>
    Mexico
    <span slot="supporting-text">North America</span>
  </ui-option>

  <!-- Disabled Option -->
  <ui-option value="uk" disabled>United Kingdom</ui-option>
</ui-select>
```

### Text Area

**Import:**
```javascript
import '@pawel-up/md/text-area/ui-text-area.js';
```

Text areas let users enter and edit multi-line text. The `base-ui` implementation uses the "Filled" visual style from Material Design 3 and behaves exactly like a native form-associated `<textarea>`.

**Properties & Configuration:**
- `<ui-text-area>` inherits all common configurations from Text Fields (`label`, `value`, `supportingText`, `invalidText`, `invalid`, `disabled`, `required`, `placeholder`, `noFloating`).
- `rows`: Number. The visible number of lines in the text control.
- `cols`: Number. The visible width of the text control (in average character widths).
- `wrap`: String. Indicates how the control wraps text (`"soft"` or `"hard"`).

*Note: Since Text Areas are inherently multi-line, they do not typically utilize `prefix` or `suffix` slots for icon alignment like single-line Text Fields do.*

**Example usage (base-ui):**
```html
<ui-text-area 
  label="Description" 
  name="description" 
  rows="4" 
  required
  supportingText="Enter a detailed description."
></ui-text-area>
```

### Date Picker

**Import:**
```javascript
import '@pawel-up/md/date-picker/ui-date-picker-input.js';
import '@pawel-up/md/date-picker/ui-date-picker-modal.js';
import '@pawel-up/md/date-picker/ui-date-picker-modal-input.js';
```

A comprehensive date picker system with three variants.

**Variants:**
- `ui-date-picker-input`: A text field with dropdown calendar. Ideal for forms.
- `ui-date-picker-modal`: Full-screen modal for date range selection. Perfect for booking interfaces.
- `ui-date-picker-modal-input`: Manual date entry using keyboard input in a modal.

**Example usage (base-ui):**
```html
<ui-date-picker-input
  label="Select date"
  placeholder="MM/DD/YYYY"
></ui-date-picker-input>
```

## Data Display

### List

**Import:**
```javascript
// Expressive (Default MD3 design)
import '@pawel-up/md/list/ui-expressive-list.js';
import '@pawel-up/md/list/ui-expressive-list-item.js';

// Legacy/Standard
import '@pawel-up/md/list/ui-list.js';
import '@pawel-up/md/list/ui-list-item.js';
```

Lists are continuous, vertical indexes of text or images. The `base-ui` list implementation automatically handles complex accessibility requirements like roving tabindex and arrow-key navigation out of the box.

The library offers two visual variants:
- **Expressive List (`<ui-expressive-list>`)**: The modern default for Material Design 3.
- **Standard List (`<ui-list>`)**: The legacy tighter layout. 

Both variants share the exact same API and properties.

**List Container (`<ui-expressive-list>` / `<ui-list>`):**
- `delegateFocus`: Boolean. When true, the list delegates focus to the active child element (e.g. an embedded checkbox or radio) instead of the list item itself.
- `selectActive`: Boolean. When true, visually selects the last activated list item.
- `collapsible`: Boolean. When true, the list supports expanding and collapsing grouped items.

**Events (`<ui-expressive-list>` / `<ui-list>`):**
- `@select`: Fired when a list item is activated (clicked or Enter/Space is pressed). `event.detail` contains `{ item, index }`.

**List Item (`<ui-expressive-list-item>` / `<ui-list-item>`):**
- `lines`: Specifies the vertical height/layout. Accepts `"one"`, `"two"`, `"three"`, or `"auto"` (which automatically calculates lines based on slotted content).
- `image`: Specifies the padding/layout of the leading visual. Accepts `"icon"`, `"avatar"`, `"image"`, `"video"`, or `"auto"`.
- `disabled`: Boolean. Disables the list item.
- `static`: Boolean. Makes the list item non-interactive (removes hover effects, ripple, and keyboard focus).

**Slots (`<ui-expressive-list-item>` / `<ui-list-item>`):**
- `(default)`: The main text content (headline).
- `start`: Leading visual content (icons, avatars, checkboxes).
- `end`: Trailing visual content (icons, action buttons).
- `end-text`: Trailing text (e.g., timestamps or counts).
- `overline`: Small text displayed above the main content.
- `supporting-text`: Secondary descriptive text displayed below the main content.

**Example usage (base-ui):**
```html
<ui-expressive-list>
  <!-- Basic Single Line Item -->
  <ui-expressive-list-item>
    <ui-icon slot="start">inbox</ui-icon>
    Inbox
    <span slot="end-text">24</span>
  </ui-expressive-list-item>

  <!-- Two Line Item with Avatar -->
  <ui-expressive-list-item lines="two" image="avatar">
    <img slot="start" src="/user.jpg" alt="Jane">
    Jane Doe
    <span slot="supporting-text">Jane uploaded a new file.</span>
  </ui-expressive-list-item>

  <!-- Static Group Header -->
  <ui-expressive-list-item static>
    <span slot="overline">Archived Folders</span>
  </ui-expressive-list-item>
</ui-expressive-list>
```

### Listbox

**Import:**
```javascript
import '@pawel-up/md/listbox/ui-listbox.js';
// Note: Listboxes use standard ui-list-items (or ui-options) for their children
import '@pawel-up/md/list/ui-list-item.js';
```

The Listbox component (`<ui-listbox>`) extends the standard `<ui-list>` to explicitly support selection semantics. It is used when users must select one or more items from a static list (unlike an HTML `<select>`, these items can contain rich images and layouts). 

**Key Differences from `<ui-list>`:**
- Automatically sets `role="listbox"` on itself.
- Automatically forces `role="option"` on all valid children (like `<ui-list-item>`).
- Automatically manages `aria-selected` and `aria-activedescendant` states as the user navigates via keyboard or clicks.

Because it inherits from `<ui-list>`, it supports all standard list configurations (`delegateFocus`, `selectActive`, `collapsible`) and fires the same `@select` event.

**Example usage (base-ui):**
```html
<ui-listbox selectActive>
  <ui-list-item>
    <ui-icon slot="start">star</ui-icon>
    Favorites
  </ui-list-item>
  <ui-list-item>
    <ui-icon slot="start">schedule</ui-icon>
    Recent
  </ui-list-item>
</ui-listbox>
```

### Menu

**Import:**
```javascript
import '@pawel-up/md/menu/ui-menu.js';
import '@pawel-up/md/menu/ui-sub-menu.js';
import '@pawel-up/md/menu/ui-menu-item.js';
```

Menus display a list of choices on temporary surfaces. The `base-ui` implementation leverages the modern native **Popover API** for overlay management and the **CSS Anchor Positioning API** for precise placement without heavy JavaScript calculations. 

It supports deep, accessible sub-menus out of the box using a flattened, ID-reference DOM structure instead of deep slot nesting.

**Properties & Attributes (`<ui-menu>` & `<ui-sub-menu>`):**
- `id`: Required. Used as the target for `popovertarget` on trigger elements.
- `open`: Boolean. Reflects whether the menu is open.
- `anchor`: String (Sub-menu only). The ID of the parent `ui-menu-item` to position against.

**Properties & Attributes (`<ui-menu-item>`):**
- `submenu`: String. The ID of the `<ui-sub-menu>` it controls.
- `id`: String. Required if it controls a submenu, so the submenu can `anchor` to it.
- `disabled`: Boolean. Disables the item.

**Slots (`<ui-menu-item>`):**
- `(default)`: The main menu item text.
- `start`: Leading visual (e.g. icons).
- `end`: Trailing visual.
- `end-text`: Secondary text displayed at the end.

**Events:**
- `@select`: Fired by the menu when an item is selected via click or keyboard. Contains `{ item, index }`.
- `@open` / `@close`: Fired on the menu elements during state changes.

**Important Structural Rule for Sub-menus:**
For deep keyboard navigation to work correctly across menu levels, `<ui-sub-menu>` elements *must* be placed as direct children (light DOM) of the main `<ui-menu>`, rather than nested inside the `<ui-menu-item>` that triggers them.

**Example usage (base-ui):**
```html
<!-- Trigger Button -->
<ui-button id="menu-trigger" popovertarget="demo-menu">
  Options
</ui-button>

<!-- Main Menu -->
<ui-menu id="demo-menu">
  <ui-menu-item>
    <ui-icon slot="start">add</ui-icon>
    New File
  </ui-menu-item>
  
  <!-- Item with a Sub-menu -->
  <ui-menu-item id="export-item" submenu="export-submenu">
    <ui-icon slot="start">share</ui-icon>
    Export...
  </ui-menu-item>

  <!-- Sub-menu defined in the same root level -->
  <ui-sub-menu id="export-submenu" anchor="export-item">
    <ui-menu-item>PDF Document</ui-menu-item>
    <ui-menu-item>PNG Image</ui-menu-item>
  </ui-sub-menu>
</ui-menu>
```

### Dropdown List

**Import:**
```javascript
import '@pawel-up/md/dropdown-list/ui-dropdown-list.js';
// Usually used in combination with lists or buttons
import '@pawel-up/md/list/ui-list.js';
import '@pawel-up/md/list/ui-list-item.js';
```

While the `<ui-menu>` component uses the native Popover API for structural independence, the `<ui-dropdown-list>` component acts as a structural **wrapper**. It wraps both a trigger element and a dropdown content element, manually managing focus, keyboard accessibility (Esc/Tab to close), and JavaScript-based overlay positioning.

Because it is highly generic, it is classified under Data Display as a utility container for any list-based overlay.

**Properties & Configuration:**
- `open`: Boolean. Controls whether the dropdown is visible.
- `verticalAlign` / `horizontalAlign`: String (`"top"`, `"bottom"`, `"middle"`). Configures how the dropdown aligns against the trigger.
- `noOverlap`: Boolean. Ensures the dropdown renders adjacent to the trigger without covering it.
- `matchTriggerWidth`: Boolean. Forces the dropdown to be exactly as wide as the trigger.
- `closeOnOutsideClick`: Boolean. Automatically closes the list when clicking outside.
- `closeOnTab`: Boolean. Automatically closes the list when pressing the `Tab` key.

**Slots:**
- `(default)`: The trigger element (e.g. a `<ui-button>`).
- `dropdown`: The content to display in the overlay (e.g. a `<ui-list>`).

**Events:**
- `@select`: Fired when an item inside the dropdown is selected. `event.detail.item` contains the selected element.
- `@open`: Fired when the dropdown toggles open or closed.

**Example usage (base-ui):**
```html
<ui-dropdown-list closeOnOutsideClick noOverlap matchTriggerWidth>
  <!-- Default Slot = Trigger -->
  <ui-button color="filled">
    Assign To...
    <ui-icon slot="trailing-icon">arrow_drop_down</ui-icon>
  </ui-button>
  
  <!-- Dropdown Slot = Content -->
  <ui-list slot="dropdown" role="menu">
    <ui-list-item role="menuitem">Pawel</ui-list-item>
    <ui-list-item role="menuitem">Admin</ui-list-item>
  </ui-list>
</ui-dropdown-list>
```

### Snackbar (Notifications)

**Import:**
```javascript
import { SnackNotifications } from '@pawel-up/md/notification/SnackNotifications.js';
// The custom element is loaded automatically by the controller, but if needed directly:
import '@pawel-up/md/snackbar/ui-snackbar.js';
```

Snackbars provide brief messages about app processes at the bottom of the screen. Material Design 3 guidelines dictate that **only one snackbar may be displayed at a time**.

Because of this queuing requirement, `base-ui` provides the `SnackNotifications` controller class to globally manage the notification stack. **It is highly recommended to use the programmatic `SnackNotifications.notify()` API rather than manually rendering `<ui-snackbar>` elements in your HTML.**

**Properties & Configuration (`ISnackInit`):**
- `timeout`: Time in milliseconds before the snackbar auto-dismisses (default: `5000`).
- `persistent`: If `true`, the snackbar ignores the timeout and must be dismissed by the user or programmatically.
- `cancellable`: If `true` (default), the user can dismiss the snackbar by swiping it away on touch devices.
- `actionLabel`: Text for an optional action button (e.g., "Undo" or "Retry").
- `actionCallback`: A function executed when the action button is clicked.
- `close`: If `true`, renders an explicit "X" (close) icon button.
- `closed`: A callback executed when the snackbar is dismissed via timeout or user interaction (but not when closed programmatically).

**When to use:**
- To inform users of a process that an app has performed or will perform (e.g., "Message sent", "File deleted").
- Snackbars communicate messages that are minimally interruptive and don't require user action to disappear.

**Example usage (base-ui):**
```javascript
// 1. Simple notification (auto-dismisses after 5s)
SnackNotifications.notify('Draft saved successfully');

// 2. Notification with a custom timeout
SnackNotifications.notify('Connecting to server...', 10000);

// 3. Notification with an Action and Close button
SnackNotifications.notify('Image deleted', {
  timeout: 6000,
  actionLabel: 'Undo',
  actionCallback: () => restoreImage(),
  close: true
});

// 4. Persistent notification requiring user interaction
SnackNotifications.notify('Update downloaded. Restart required.', {
  persistent: true,
  close: true,
  actionLabel: 'Restart Now',
  actionCallback: () => performRestart()
});
```

### Collapse

**Import:**
```javascript
import '@pawel-up/md/collapse/ui-collapse.js';
```

A container that expands and collapses its content either vertically or horizontally.

**Properties:**
- `open`: Boolean. Set to `true` to expand.
- `horizontal`: Boolean. Expands horizontally instead of vertically.
- `noAnimation`: Boolean. Disables transition animations.
- `disabled`: Boolean. Disables interactions.

**Events:**
- `@toggle`: Fired when `toggle()` is called.
- `@transitioning`: Fired when an animation starts/ends.
- `@resize`: Fired when size updates.

**Example usage (base-ui):**
```html
<ui-collapse .open=${this.isExpanded}>
  <div style="padding: 16px;">
    Collapsible content goes here...
  </div>
</ui-collapse>
```

### Divider

**Import:**
```javascript
import '@pawel-up/md/divider/ui-divider.js';
```

A visual rule used to separate content.

**Properties:**
- `type`: `"full"` (default), `"inset"`, or `"middle"`.
- `vertical`: Boolean. Renders the divider vertically instead of horizontally.

**Example usage (base-ui):**
```html
<ui-divider type="inset"></ui-divider>
```

### Date

**Import:**
```javascript
import '@pawel-up/md/date/ui-date-time.js';
```

An accessibility-friendly element (`<time>`) to display a formatted date and time using `Intl.DateTimeFormat`.

**Properties:**
- `date`: A `Date` object, timestamp number, or string.
- Formatting options: `year`, `month`, `day`, `hour`, `minute`, `second`, `weekday`, `era`, `timeZoneName`, `timeZone`.
- `locales`: BCP 47 language tag (e.g., `"en-US"`).
- `hour12`: Boolean. Uses 12-hour time instead of 24-hour time.

**Example usage (base-ui):**
```html
<date-time date="2010-12-10T11:50:45Z" year="numeric" month="long" day="numeric"></date-time>
```

## Navigation

### Tabs

**Import:**
```javascript
import '@pawel-up/md/tabs/ui-tabs.js';
import '@pawel-up/md/tabs/ui-tab.js';
```

Organizes content across different screens, data sets, and other interactions. Tabs manage keyboard navigation natively (`ArrowLeft` / `ArrowRight`, `Home`, `End`).

**`<ui-tabs>` Properties:**
- `priority`: `"primary"` (default) or `"secondary"`.
- `activeTabIndex`: Number. Sets the currently active tab.
- `autoActivate`: Boolean. When true, navigating with keyboard automatically selects the focused tab.

**`<ui-tabs>` Events:**
- `@change`: Fired when selection changes. `event.detail.item` contains the selected `<ui-tab>`, and `event.detail.index` its index.

**`<ui-tab>` Properties:**
- `disabled`: Boolean. Disables the tab.
- Slots: `(default)` for the label, `icon` for the icon.

**Example usage (base-ui):**
```html
<ui-tabs priority="primary" @change="${this.onTabChange}">
  <ui-tab>
    <ui-icon slot="icon">home</ui-icon>
    Home
  </ui-tab>
  <ui-tab>
    <ui-icon slot="icon">settings</ui-icon>
    Settings
  </ui-tab>
</ui-tabs>
```

## Utilities

### Focus Ring

**Import:**
```javascript
import '@pawel-up/md/focus-ring/ui-focus-ring.js';
```

A helper component that automatically manages and renders an accessible visual focus indicator based on keyboard interaction. 

**Properties:**
- `control`: An `HTMLElement` reference to watch for focus.
- `for`: An element ID to watch for focus (alternative to `control`). If neither is provided, it watches its parent element.
- `inward`: Boolean. Draws the focus ring inside the control's bounds rather than outside.

**Example usage (base-ui):**
```html
<button class="my-custom-button">
  Click me
  <ui-focus-ring inward></ui-focus-ring>
</button>
```

### Ripple

**Import:**
```javascript
import '@pawel-up/md/ripple/ui-ripple.js';
```

A helper component that renders Material Design 3 ripple animations for touch, mouse, and keyboard interactions. 

Unlike standard interactive elements, `<ui-ripple>` does not handle event listening by itself. It expects to be driven programmatically (typically via an `ActionController` or directly by the parent element) to synchronize its states with the host component.

**Properties:**
- `unbounded`: Boolean. If true, the ripple can expand beyond the bounds of its container.
- `disabled`: Boolean. Disables ripple animations and effects.

**Programmatic API:**
- `beginHover(e)` / `endHover()`
- `beginFocus()` / `endFocus()`
- `beginPress(e)` / `endPress()`

**Example usage (base-ui):**
```html
<!-- Usually managed by the parent component's ActionController -->
<button class="my-custom-button" @pointerdown="${this.onPointerDown}" @pointerup="${this.onPointerUp}">
  Click me
  <ui-ripple></ui-ripple>
</button>
```
