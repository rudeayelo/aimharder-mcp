// The module never imports from the lab, and the lab uses only the public API.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..');
const imports = (dir: string) =>
  readdirSync(join(root, dir), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.ts'))
    .flatMap((file) => [...readFileSync(join(root, dir, file), 'utf8').matchAll(/(?:from|import)\s*\(?\s*'([^']+)'/g)].map((m) => ({ file, spec: m[1]! })));

describe('module boundaries', () => {
  it('keeps the module free of lab imports', () => {
    expect(imports('src').filter(({ spec }) => spec.includes('lab'))).toEqual([]);
  });

  it('lets lab pages reach the module only through its public index', () => {
    const pages = imports('lab').filter(({ file }) => file === 'main.ts' || file === 'harness.ts');
    const intoModule = pages.filter(({ spec }) => spec.includes('/src/'));
    expect(intoModule.length).toBeGreaterThan(0);
    expect(intoModule.filter(({ spec }) => spec !== '../src/index.ts')).toEqual([]);
  });
});
