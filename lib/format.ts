// Locale-correct formatting (guideline: use Intl, never hardcoded formats).
// Intl.NumberFormat for currency also inserts the number↔unit non-breaking space.

const czk = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
});

/** "289 Kč" with a non-breaking space, localized. */
export const formatKc = (amount: number) => czk.format(amount);

const fullDate = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dayMonth = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
});

/** "21. 06. 2026" */
export const formatDate = (d: Date) => fullDate.format(d);
/** "21. 06." */
export const formatDayMonth = (d: Date) => dayMonth.format(d);
