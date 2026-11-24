// The SOG reader fails with a clear error on damaged or mismatched assets
// instead of decoding garbage into the body.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { decodeSog, parseSogMeta, readStoredZip, type Pixels } from '../src/sog.ts';

const asset = new Uint8Array(readFileSync(join(import.meta.dirname, '../../design/assets/kettle/kettle-body-32k.sog')));
const meta = () => JSON.parse(new TextDecoder().decode(readStoredZip(asset).get('meta.json'))) as Record<string, any>;
const pixels = (width: number, height: number): Pixels => ({ width, height, data: new Uint8Array(width * height * 4) });

describe('SOG reader', () => {
  it('reads the shipped asset and rejects truncated, mismatched or unsupported ones', () => {
    expect(parseSogMeta(JSON.stringify(meta())).count).toBe(32768);
    expect(() => readStoredZip(asset.subarray(0, asset.length - 100))).toThrow(/SOG: .*(truncated|end record)/);
    expect(() => readStoredZip(asset.subarray(0, 200_000))).toThrow(/SOG: /);

    const small = { means_l: pixels(100, 100), means_u: pixels(100, 100), quats: pixels(100, 100), scales: pixels(100, 100), sh0: pixels(100, 100) };
    expect(() => decodeSog(parseSogMeta(JSON.stringify(meta())), small)).toThrow(/SOG: means_l texture .* too small for 32768/);
    const swapped = { means_l: pixels(184, 180), means_u: pixels(184, 180), quats: pixels(180, 184), scales: pixels(184, 180), sh0: pixels(184, 180) };
    expect(() => decodeSog(parseSogMeta(JSON.stringify(meta())), swapped)).toThrow(/SOG: quats texture is 180 × 184; means_l is 184 × 180/);

    const shortBook = meta();
    shortBook.scales.codebook = shortBook.scales.codebook.slice(0, 10);
    expect(() => parseSogMeta(JSON.stringify(shortBook))).toThrow(/SOG: scales codebook/);
    const badCount = { ...meta(), count: -1 };
    expect(() => parseSogMeta(JSON.stringify(badCount))).toThrow(/SOG: count/);
    const higherBands = { ...meta(), shN: { files: ['shN_centroids.webp', 'shN_labels.webp'] } };
    expect(() => parseSogMeta(JSON.stringify(higherBands))).toThrow(/SOG: higher spherical-harmonics bands/);
  });
});
