export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isDisabled: boolean
}

export interface CalendarMonth {
  year: number
  month: number // 0-indexed (0 = January)
  days: CalendarDay[]
  weekdays: string[]
}

/**
 * Get the current date with time set to midnight
 */
export function today(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/**
 * Create a new date with time set to midnight
 */
export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Check if a date is between two other dates (inclusive)
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
  const normalizedDate = normalizeDate(date)
  const normalizedStart = normalizeDate(start)
  const normalizedEnd = normalizeDate(end)
  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Get the first day of the month
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1)
}

/**
 * Get the last day of the month
 */
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0)
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Get weekday names for the current locale
 */
export function getWeekdayNames(locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const days: string[] = []

  // Start from Sunday and get all 7 days
  const date = new Date(2024, 0, 7) // January 7, 2024 is a Sunday
  for (let i = 0; i < 7; i++) {
    days.push(formatter.format(new Date(date.getTime() + i * 24 * 60 * 60 * 1000)))
  }

  return days
}

/**
 * Get month names for the current locale
 */
export function getMonthNames(locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short' })
  const months: string[] = []

  for (let i = 0; i < 12; i++) {
    months.push(formatter.format(new Date(2024, i, 1)))
  }

  return months
}

/**
 * Format a date according to locale
 */
export function formatDate(date: Date, locale?: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date)
}

/**
 * Parse a date string in various formats
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null

  // Try ISO format first
  const isoDate = new Date(dateString)
  if (!isNaN(isoDate.getTime())) {
    return normalizeDate(isoDate)
  }

  // Try other common formats
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or M/D/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY or M-D-YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD or YYYY-M-D
  ]

  for (const format of formats) {
    const match = dateString.match(format)
    if (match) {
      const [, part1, part2, part3] = match
      let year: number, month: number, day: number

      if (format === formats[2]) {
        // YYYY-MM-DD
        year = parseInt(part1, 10)
        month = parseInt(part2, 10) - 1 // Convert to 0-indexed
        day = parseInt(part3, 10)
      } else {
        // MM/DD/YYYY or MM-DD-YYYY
        year = parseInt(part3, 10)
        month = parseInt(part1, 10) - 1 // Convert to 0-indexed
        day = parseInt(part2, 10)
      }

      const date = new Date(year, month, day)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  }

  return null
}

/**
 * Generate calendar data for a specific month
 */
export function generateCalendarMonth(
  year: number,
  month: number,
  selectedDate?: Date | null,
  selectedRange?: DateRange | null,
  disabledDates?: Date[],
  locale?: string
): CalendarMonth {
  const firstDay = getFirstDayOfMonth(year, month)
  const todayDate = today()

  // Get the first day of the week (0 = Sunday, 1 = Monday)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate start date (might be from previous month)
  const startDate = addDays(firstDay, -firstDayOfWeek)

  // Calculate end date (might be from next month)
  const daysToShow = 42 // 6 weeks * 7 days
  const endDate = addDays(startDate, daysToShow - 1)

  const days: CalendarDay[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const isCurrentMonth = currentDate.getMonth() === month
    const isToday = isSameDay(currentDate, todayDate)
    const isSelected = selectedDate ? isSameDay(currentDate, selectedDate) : false

    let isInRange = false
    let isRangeStart = false
    let isRangeEnd = false

    if (selectedRange?.start && selectedRange?.end) {
      isRangeStart = isSameDay(currentDate, selectedRange.start)
      isRangeEnd = isSameDay(currentDate, selectedRange.end)
      isInRange = isBetween(currentDate, selectedRange.start, selectedRange.end)
    }

    const isDisabled = disabledDates?.some((disabledDate) => isSameDay(currentDate, disabledDate)) || false

    days.push({
      date: new Date(currentDate),
      isCurrentMonth,
      isToday,
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isDisabled,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return {
    year,
    month,
    days,
    weekdays: getWeekdayNames(locale),
  }
}

/**
 * Get the ISO string for a date (YYYY-MM-DD format)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Create a date from ISO string (YYYY-MM-DD format)
 */
export function fromISODateString(isoString: string): Date | null {
  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const [, year, month, day] = match
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
}

/**
 * Validate if a date range is valid (start <= end)
 */
export function isValidRange(range: DateRange): boolean {
  if (!range.start || !range.end) return true
  return range.start <= range.end
}

/**
 * Get the number of days between two dates
 */
export function getDaysBetween(start: Date, end: Date): number {
  const startTime = normalizeDate(start).getTime()
  const endTime = normalizeDate(end).getTime()
  return Math.abs(Math.floor((endTime - startTime) / (24 * 60 * 60 * 1000)))
}
