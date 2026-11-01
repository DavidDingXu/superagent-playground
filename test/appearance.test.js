import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAppearance } from '../src/appearance.js';

test('normalizes a valid global font preference without mutating the input', () => {
  const input = { fontFamily: '  Fira Code  ', fontSize: '18' };
  assert.deepEqual(normalizeAppearance(input), { fontFamily: 'Fira Code', fontSize: 18 });
  assert.deepEqual(input, { fontFamily: '  Fira Code  ', fontSize: '18' });
});

test('uses defaults for missing or invalid preferences', () => {
  assert.deepEqual(normalizeAppearance(), { fontFamily: 'system-ui', fontSize: 16 });
  assert.deepEqual(normalizeAppearance({ fontFamily: '', fontSize: 'invalid' }), { fontFamily: 'system-ui', fontSize: 16 });
  assert.deepEqual(normalizeAppearance(null), { fontFamily: 'system-ui', fontSize: 16 });
});

test('bounds font sizes and rounds fractional values', () => {
  assert.equal(normalizeAppearance({ fontSize: 1 }).fontSize, 8);
  assert.equal(normalizeAppearance({ fontSize: 100 }).fontSize, 40);
  assert.equal(normalizeAppearance({ fontSize: 17.8 }).fontSize, 18);
});
