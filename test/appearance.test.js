import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAppearance } from '../src/appearance.js';

const defaultAppearance = {
  fontFamily: 'system-ui',
  fontSize: 16,
  body: { fontFamily: 'system-ui' },
  code: { fontFamily: 'system-ui' },
  terminal: { fontFamily: 'system-ui' },
};

test('normalizes a valid global font preference without mutating the input', () => {
  const input = { fontFamily: '  Fira Code  ', fontSize: '18' };
  assert.deepEqual(normalizeAppearance(input), {
    fontFamily: 'Fira Code',
    fontSize: 18,
    body: { fontFamily: 'Fira Code' },
    code: { fontFamily: 'Fira Code' },
    terminal: { fontFamily: 'Fira Code' },
  });
  assert.deepEqual(input, { fontFamily: '  Fira Code  ', fontSize: '18' });
});

test('uses defaults for missing or invalid preferences', () => {
  assert.deepEqual(normalizeAppearance(), defaultAppearance);
  assert.deepEqual(normalizeAppearance({ fontFamily: '', fontSize: 'invalid' }), defaultAppearance);
  assert.deepEqual(normalizeAppearance(null), defaultAppearance);
});

test('bounds font sizes and rounds fractional values', () => {
  assert.equal(normalizeAppearance({ fontSize: 1 }).fontSize, 8);
  assert.equal(normalizeAppearance({ fontSize: 100 }).fontSize, 40);
  assert.equal(normalizeAppearance({ fontSize: 17.8 }).fontSize, 18);
});

test('normalizes independent body, code and terminal font families', () => {
  const appearance = normalizeAppearance({
    fontFamily: '  Global Sans  ',
    body: { fontFamily: '  Charter  ' },
    code: { fontFamily: ' Fira Code ' },
    terminal: { fontFamily: 'Menlo' },
  });
  assert.equal(appearance.fontFamily, 'Global Sans');
  assert.deepEqual(appearance.body, { fontFamily: 'Charter' });
  assert.deepEqual(appearance.code, { fontFamily: 'Fira Code' });
  assert.deepEqual(appearance.terminal, { fontFamily: 'Menlo' });
});

test('independent preferences fall back to the global font family', () => {
  const appearance = normalizeAppearance({
    fontFamily: 'Global Sans',
    body: {},
    code: { fontFamily: '  ' },
    terminal: { fontFamily: 42 },
  });
  assert.deepEqual(appearance.body, { fontFamily: 'Global Sans' });
  assert.deepEqual(appearance.code, { fontFamily: 'Global Sans' });
  assert.deepEqual(appearance.terminal, { fontFamily: 'Global Sans' });
});

test('returns independent preference objects instead of shared references', () => {
  const appearance = normalizeAppearance({ fontFamily: 'Global Sans' });
  appearance.body.fontFamily = 'Changed';
  assert.deepEqual(appearance.code, { fontFamily: 'Global Sans' });
  assert.deepEqual(appearance.terminal, { fontFamily: 'Global Sans' });
});

test('does not mutate or reuse nested independent preferences', () => {
  const body = { fontFamily: '  Georgia  ' };
  const input = { body };
  const appearance = normalizeAppearance(input);
  assert.deepEqual(appearance.body, { fontFamily: 'Georgia' });
  assert.deepEqual(input, { body: { fontFamily: '  Georgia  ' } });
  assert.notEqual(appearance.body, body);
});

test('projects only the legacy global fields to confirm unchanged values and fallbacks', () => {
  const legacyFields = ({ fontFamily, fontSize }) => ({ fontFamily, fontSize });
  assert.deepEqual(
    legacyFields(normalizeAppearance({ fontFamily: '  Fira Code  ', fontSize: '18' })),
    { fontFamily: 'Fira Code', fontSize: 18 },
  );
  assert.deepEqual(
    legacyFields(normalizeAppearance({ fontFamily: '', fontSize: 'invalid' })),
    { fontFamily: 'system-ui', fontSize: 16 },
  );
  assert.deepEqual(legacyFields(normalizeAppearance()), { fontFamily: 'system-ui', fontSize: 16 });
});
