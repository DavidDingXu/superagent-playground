/** Normalize the fixture's current single global font preference. */
export function normalizeAppearance(input) {
  const preferences = input && typeof input === 'object' ? input : {};
  const fontFamily = typeof preferences.fontFamily === 'string'
    ? preferences.fontFamily.trim() || 'system-ui'
    : 'system-ui';
  const value = preferences.fontSize;
  const size = typeof value === 'number' || (typeof value === 'string' && value.trim())
    ? Number(value)
    : Number.NaN;
  return {
    fontFamily,
    fontSize: Number.isFinite(size) ? Math.max(8, Math.min(40, Math.round(size))) : 16,
  };
}
