# Date Picker Components

A comprehensive Material Design 3 styled date picker system with three variants to suit different use cases and screen sizes.

## Components

### 1. Docked Date Picker (`ui-date-picker-input`)

A text field with dropdown calendar, ideal for forms and medium to large layouts.

```html
<ui-date-picker-input
  label="Select date"
  placeholder="MM/DD/YYYY"
  .value=${new Date()}
  @change=${this.handleDateChange}
></ui-date-picker-input>
```

**Features:**

- Text input with calendar dropdown
- Keyboard and mouse input support
- Form integration
- Customizable date formatting

### 2. Modal Date Picker (`ui-date-picker-modal`)

Full-screen modal for date range selection, perfect for booking interfaces.

```html
<ui-date-picker-modal
  .open=${true}
  .selectedRange=${{ start: new Date(), end: null }}
  title="Select travel dates"
  startLabel="Check-in"
  endLabel="Check-out"
  @date-range-change=${this.handleRangeChange}
  @close=${this.handleClose}
></ui-date-picker-modal>
```

**Features:**

- Full-screen modal interface
- Date range selection
- Calendar/input mode toggle
- Mobile-optimized

### 3. Modal Input Date Picker (`ui-date-picker-modal-input`)

Manual date entry using keyboard input, ideal for compact layouts.

```html
<ui-date-picker-modal-input
  .open=${true}
  .rangeMode=${true}
  .selectedRange=${{ start: null, end: null }}
  @date-input-change=${this.handleInputChange}
  @modal-input-close=${this.handleClose}
></ui-date-picker-modal-input>
```

**Features:**

- Keyboard-focused input
- Single date or range mode
- Multiple date format support
- Validation and error handling

## Calendar Component (`ui-date-picker-calendar`)

The underlying calendar grid component used by other pickers.

```html
<ui-date-picker-calendar
  .selectedDate=${new Date()}
  .rangeSelection=${false}
  @date-select=${this.handleDateSelect}
></ui-date-picker-calendar>
```

## Utility Functions

The `DatePickerUtils` module provides helper functions for date operations:

```javascript
import { 
  formatDate, 
  parseDate, 
  generateCalendarMonth,
  isSameDay,
  addMonths 
} from './internals/DatePickerUtils.js'

// Format a date
const formatted = formatDate(new Date(), 'en-US')

// Parse user input
const date = parseDate('12/25/2024')

// Generate calendar data
const calendar = generateCalendarMonth(2024, 11) // December 2024
```

## Common Properties

### Date Constraints

```html
<!-- Minimum and maximum dates -->
<ui-date-picker-input
  .minDate=${new Date('2024-01-01')}
  .maxDate=${new Date('2024-12-31')}
></ui-date-picker-input>

<!-- Disabled specific dates -->
<ui-date-picker-input
  .disabledDates=${[new Date('2024-12-25'), new Date('2024-01-01')]}
></ui-date-picker-input>
```

### Localization

```html
<!-- Custom locale -->
<ui-date-picker-input
  locale="en-GB"
  .dateFormat=${date => date.toLocaleDateString('en-GB')}
></ui-date-picker-input>
```

## Styling

All components follow Material Design 3 guidelines and respect CSS custom properties:

```css
:root {
  --ui-color-primary: #6750a4;
  --ui-color-surface: #fff;
  --ui-color-on-surface: #1d1b20;
  --ui-border-radius-medium: 12px;
  --ui-elevation-level2: 0 2px 8px rgba(0,0,0,0.15);
}
```

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader compatible
- Focus management
- High contrast support

## Browser Support

- Modern browsers with ES2015+ support
- Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- Mobile browsers on iOS 14+ and Android 7+

## Events

### Docked Date Picker

- `change`: Fired when date selection changes

### Modal Date Picker

- `date-range-change`: Fired when date range changes
- `close`: Fired when modal closes

### Modal Input Date Picker

- `date-input-change`: Fired when input values change
- `modal-input-close`: Fired when modal closes

### Calendar Component

- `date-select`: Fired when single date is selected
- `date-range-select`: Fired when date range is selected

## Examples

See the demo files in `/demo/md/date-picker/` for complete usage examples.
