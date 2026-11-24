// The module never imports from the lab, and the lab uses only the public API.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..');
/** Every static, dynamic and side-effect import specifier, in either quote style. */
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])([^'"]+)\1/g;
const imports = (dir: string) =>
  readdirSync(join(root, dir), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.ts'))
    .flatMap((file) =>
      [...readFileSync(join(root, dir, file), 'utf8').matchAll(SPECIFIER)].map((m) => ({
        file,
        spec: m[2]!,
        resolved: m[2]!.startsWith('.') ? normalize(join(dir, dirname(file), m[2]!)) : m[2]!,
      })),
    );

describe('module boundaries', () => {
  it('finds imports in both quote styles', () => {
    const sample = `import a from './a.ts';\nimport "./b.ts";\nexport { c } from "./c.ts";\nconst d = import('./d.ts');`;
    expect([...sample.matchAll(SPECIFIER)].map((m) => m[2])).toEqual(['./a.ts', './b.ts', './c.ts', './d.ts']);
  });

  it('keeps the module free of lab imports', () => {
    expect(imports('src').filter(({ resolved }) => resolved.startsWith('lab'))).toEqual([]);
  });

  it('lets every lab file reach the module only through its public index', () => {
    const intoModule = imports('lab').filter(({ resolved }) => resolved.startsWith('src'));
    expect(intoModule.length).toBeGreaterThan(0);
    expect(intoModule.filter(({ resolved }) => resolved !== join('src', 'index.ts'))).toEqual([]);
  });
});
