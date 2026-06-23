import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

test('index.html wires the drawing app shell', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<canvas[^>]+id="drawingCanvas"/);
  assert.match(html, /id="finishButton"/);
  assert.match(html, /id="resetButton"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /href="\.\/src\/styles\.css"/);
});
