/**
 * The product brand shown to users. This is the only place in the hosted
 * service that names the product, its domain, its support address or its
 * colors; every page, email, consent screen and MCP server description reads
 * from here. The brand is provisional (docs/adr/2026-11-24-provisional-product-name-and-domain.md),
 * so a rebrand of user-facing text is meant to be a change to this file only.
 *
 * Live hostnames are deployment configuration, not brand: the portal origin
 * comes from BASE_URL and the mail sender from MAIL_FROM. The OAuth grant claim
 * (oauth-grants.ts) and the smoke-test origin also contain the domain but are
 * fixed deployment identifiers; moving them is a host switch like issue #142,
 * not a rebrand. `aimharder-mcp` stays the package and repository name.
 */
export type Brand = {
  name: string;
  slug: string;
  domain: string;
  supportEmail: string;
  colors: { ink: string; surface: string; primary: string; onPrimary: string; border: string; track: string; thumb: string };
};
export const brand: Brand = {
  name: 'AskHarder',
  /** Lowercase identifier for places that need one, such as the MCP server name. */
  slug: 'askharder',
  domain: 'askharder.com',
  supportEmail: 'support@askharder.com',
  /** Portal palette. Figma's Brand variables stay the design source of truth. */
  colors: {
    ink: '#172f37',
    surface: '#f6faf9',
    primary: '#145d54',
    onPrimary: '#ffffff',
    border: '#52686d',
    track: '#d9e1df',
    thumb: '#ffffff',
  },
};
