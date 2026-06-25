/** Returns true if it is currently before (or exactly) 10:00 in Europe/Prague. */
export function isBeforeOrderCutoff(): boolean {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('cs-CZ', {
    timeZone: 'Europe/Prague',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now)
  const hour = parseInt(parts.find((p) => p.type === 'hour')!.value, 10)
  const minute = parseInt(parts.find((p) => p.type === 'minute')!.value, 10)
  return hour < 10 || (hour === 10 && minute === 0)
}

/**
 * Start of the current Prague day, as a UTC ISO string. Used to scope the
 * kitchen board to today's orders regardless of the server's own timezone.
 */
export function pragueDayStartISO(): string {
  const now = new Date()
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  // Offset between UTC and Prague at this instant (CET +1h / CEST +2h).
  const utcWall = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
  const pragueWall = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Prague' })
  )
  const offsetMs = pragueWall.getTime() - utcWall.getTime()

  // Prague midnight expressed in UTC = that wall-clock instant minus the offset.
  return new Date(Date.parse(`${ymd}T00:00:00Z`) - offsetMs).toISOString()
}
