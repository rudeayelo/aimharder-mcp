// A substitute brand bundled in place of src/brand.ts by tests/brand.test.ts.
import type { Brand } from '../src/brand.js';
export const brand: Brand = {
  name: 'Zentrovia',
  slug: 'zentrovia',
  domain: 'zentrovia.example',
  supportEmail: 'help@zentrovia.example',
  colors: { ink: '#101010', surface: '#202020', primary: '#303030', onPrimary: '#404040', border: '#505050', track: '#606060', thumb: '#707070' },
};
