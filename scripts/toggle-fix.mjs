// Usage: node scripts/toggle-fix.mjs on|off
// Applies the proposed `cleanupLView` fix to the installed @angular/core.
import {readFileSync, rmSync, writeFileSync} from 'node:fs';

const file = 'node_modules/@angular/core/fesm2022/_debug_node-chunk.mjs';

const original = `function cleanupLView(lView) {
  cleanupI18nHydrationData(lView);
  const tView = lView[TVIEW$1];
  for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
`;

const fixed = `${original}    const tNode = tView.data[i];
    if (isTNodeShape(tNode) && isLetDeclaration(tNode)) {
      continue;
    }
`;

const mode = process.argv[2];
if (mode !== 'on' && mode !== 'off') {
  throw new Error('Usage: node scripts/toggle-fix.mjs on|off');
}

let source = readFileSync(file, 'utf8');
if (!source.includes(original)) {
  throw new Error(`cleanupLView not found in ${file}`);
}

source = source.replace(fixed, original);
if (mode === 'on') {
  source = source.replace(original, fixed);
}

writeFileSync(file, source);
rmSync('.angular/cache', {recursive: true, force: true});
console.log(`cleanupLView fix: ${mode}`);
