/** Returns true if it is currently before (or exactly) 10:00 in Europe/Prague. */
export function isBeforeOrderCutoff(): boolean {
  // TEMPORARY (showcase 2026-06-28): cutoff disabled so Objednávky + Kitchen
  // can be demoed after 10:00. RESTORE the block below to re-enable the cutoff.
  return true

  /* eslint-disable no-unreachable */
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
  /* eslint-enable no-unreachable */
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

/** Today's date in Europe/Prague as a YYYY-MM-DD string. */
export function pragueTodayYMD(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** UTC↔Prague offset (ms) at a given instant (CET +1h / CEST +2h). */
function pragueOffsetMsAt(instant: Date): number {
  const utcWall = new Date(instant.toLocaleString('en-US', { timeZone: 'UTC' }))
  const pragueWall = new Date(
    instant.toLocaleString('en-US', { timeZone: 'Europe/Prague' })
  )
  return pragueWall.getTime() - utcWall.getTime()
}

/** Start of the given Prague day (YYYY-MM-DD), as a UTC ISO string. */
function pragueDayStartISOForYMD(ymd: string): string {
  // Sample the offset at the day's noon so DST transitions resolve correctly.
  const offsetMs = pragueOffsetMsAt(new Date(`${ymd}T12:00:00Z`))
  return new Date(Date.parse(`${ymd}T00:00:00Z`) - offsetMs).toISOString()
}

/**
 * Half-open UTC bounds [start, nextStart) covering an arbitrary Prague day,
 * computed per-day so it stays correct across DST transitions. Used to scope
 * order history to a single calendar day in Prague time.
 */
export function pragueDayBoundsISO(ymd: string): {
  start: string
  nextStart: string
} {
  const start = pragueDayStartISOForYMD(ymd)
  const nextYmd = new Date(Date.parse(`${ymd}T00:00:00Z`) + 86_400_000)
    .toISOString()
    .slice(0, 10)
  return { start, nextStart: pragueDayStartISOForYMD(nextYmd) }
}
