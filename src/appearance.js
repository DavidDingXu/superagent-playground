const DEFAULT_FONT_FAMILY = 'system-ui';
const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 40;

function normalizeFontFamily(value, fallback) {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

function normalizeFontSize(value) {
  const size = typeof value === 'number' || (typeof value === 'string' && value.trim())
    ? Number(value)
    : Number.NaN;
  return Number.isFinite(size)
    ? Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, Math.round(size)))
    : DEFAULT_FONT_SIZE;
}

function normalizeIndependentFamily(preference, fallback) {
  const requested = preference && typeof preference === 'object'
    ? preference.fontFamily
    : undefined;
  return { fontFamily: normalizeFontFamily(requested, fallback) };
}

/**
 * Normalize the fixture's font preferences.
 *
 * `fontFamily` and `fontSize` remain the global preferences. Each of `body`,
 * `code` and `terminal` may independently override the family with a
 * `{ fontFamily }` preference; missing or invalid overrides fall back to the
 * normalized global `fontFamily`. The input is never mutated and every call
 * returns fresh preference objects.
 */
export function normalizeAppearance(input) {
  const preferences = input && typeof input === 'object' ? input : {};
  const fontFamily = normalizeFontFamily(preferences.fontFamily, DEFAULT_FONT_FAMILY);
  return {
    fontFamily,
    fontSize: normalizeFontSize(preferences.fontSize),
    body: normalizeIndependentFamily(preferences.body, fontFamily),
    code: normalizeIndependentFamily(preferences.code, fontFamily),
    terminal: normalizeIndependentFamily(preferences.terminal, fontFamily),
  };
}
