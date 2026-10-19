# Hosted AimHarder connection

The [#74 account-boundary decision](adr/2026-10-19-encrypted-aimharder-account-boundary.md) implements initial encrypted AimHarder connection and verified gym configuration. This is one slice of [#69](https://github.com/rudeayelo/aimharder-mcp/issues/69); the production pilot, full tools, lifecycle, real clients, restore/retention and measured cost remain pending. Local fixtures do not establish actual AimHarder reachability from Cloudflare.

## Participant behavior

After portal sign-in, open **AimHarder connection**. Submit your own upstream credentials there; the AimHarder email may differ from the portal email. Credentials are encrypted and recoverable by the service. They never become MCP arguments or results. A portal password remains independent.

The connection first verifies login identity and current memberships. A sole gym is selected automatically. With several gyms, the page returns verified choices and asks for an explicit default and resubmission of credentials; no credentials were stored by that incomplete attempt. After connecting, change the default and optional IANA zones in the same page. A blank zone retains explicitly assumed Europe/Madrid. Confirmed zones are participant configuration, not an upstream zone field. A new configuration cannot manufacture a membership. Unsupported zones/defaults fail without changing the existing connection.

If memberships later change so that the saved default is inaccessible or a formerly sole gym now needs an explicit default, status becomes `selection-required` and the page keeps current verified choices/settings available. Choose a current default and optional confirmed zones without submitting stored credentials again. Missing selection retries retain that same settings form. MCP queries continue to reject missing/inaccessible defaults until repair; the service never guesses a replacement or changes upstream identity.

Only initial connection and gym settings are available here. A second account submission returns 409 and leaves the current connection intact. Replacement/password update, disconnect and account deletion are later lifecycle work. The administrator receives no credential viewing, impersonation or another participant’s private sporting data through these routes.

| Public route | Behavior |
| --- | --- |
| `GET /aimharder` | Admitted participant’s safe status and gym forms |
| `GET /api/portal/aimharder` | Own safe status and currently verified gym context |
| `POST /api/portal/aimharder` | Strict JSON username/password, optional defaultGym/gymTimeZones; initial connection only |
| `POST /api/portal/aimharder/settings` | Strict JSON optional defaultGym and gymTimeZones; no credentials/tenant selector |
| `POST /portal/aimharder` | Same-origin browser initial form |
| `POST /portal/aimharder/settings` | Same-origin browser gym form |

Mutation bodies are bounded at 16 KiB and require the exact portal Origin plus a maintained admitted session. No caller can select another portal subject. Responses/pages use no-store. Only `get_account_context` is exposed through authenticated HTTP MCP in this slice; its strict arguments still accept only an optional verified gym ID. No sporting-write or public actor/rotation route is added. Safe unavailable/authentication-required outcomes contain no raw upstream response, credential, cookie or numeric identity.

## Runtime setup

Preserve all existing auth/mail/Google bindings and the [#73 authorization migration/grants](hosted-mcp-authorization.md). Apply reviewed `0005-aimharder-connection.sql` once to the authorized D1 database, after migrations 0001–0004. Existing isolated migrations were applied through the direct API; do not blindly replay them through a different migration ledger.

Add private Durable Object binding `ACCOUNT_CONNECTIONS` to exported class `AccountConnection`, with a new uniquely tagged `new_sqlite_classes` migration. Do not use legacy `new_classes`, whose KV-backed namespace is not the selected Free-compatible candidate. The checked-in Wrangler example contains no actual account/database/namespace IDs. Root operator owns actual namespace activation and verifies read-back without purchases or plan changes.

Supply these through protected platform/operator configuration, never command arguments, logs, repository files or browser fields:

- `VAULT_KEYS`: JSON object mapping at most eight bounded key IDs to independent base64-encoded 32-byte AES keys.
- `VAULT_ACTIVE_KEY_ID`: the key ID used for new envelopes.

Generate keys securely in a trusted operator process and escrow them in authorized 1Password custody separate from D1/authentication secrets. The owner may generate and save the key directly in a Password item accessible to the existing read-only service account; operator tooling validates the decoded 32-byte format without creating an item or expanding permissions. Inject through a protected platform-secret path and read back binding names/types only. Never print or commit their values. The database row holds only portal ownership, semantic revision, encrypted version/key-ID/IV/ciphertext envelope and timestamp. Cookies/failure latch are in the owning object’s memory; restart reloads/decrypts the connection and authenticates an empty session against the pinned identity. Application admission and current MCP grants remain independent.

## Rotation and recovery

1. Generate/escrow a new independent key version. Deploy the ring containing both old/new keys and activate the new ID. Verify protected binding names, and keep old keys while active or retained ciphertext still needs them.
2. Read only `userId,revision,envelope` through the private D1 operator path. Keep the encrypted snapshot/output in fresh private files outside the checkout, or a trusted in-memory pipe; do not create a plaintext export.
3. Run `pnpm vault:prepare-rotation` in `hosted/`, with the protected key environment and encrypted-row JSON on stdin. It returns JSON with row count, active key ID and conditional SQL. It performs no provider mutation and emits no plaintext credentials or key values. A parse/decryption/validation failure emits only generic failure and prepares no output.
4. Review/apply that exact private SQL through authorized D1 operations. Each update compares original ownership, semantic revision and full envelope; a concurrent settings change wins over stale maintenance. Re-read active envelope key-ID inventory and conditional update results, retry preparation only for the currently read rows, and verify authenticated public account context after restart. Do not silently overwrite a conflict or infer completion from preparation alone.
5. Retire old runtime keys only after all active ciphertext has moved and the inventory of retained encrypted copies/recovery custody has been addressed. Keep separately authorized recovery keys for copies that still require them. Key rotation does not enforce the later <=30-day deletion/backup policy.
6. To recover, rebuild the authorized isolated runtime with persisted encrypted D1 and the escrowed correct key ring, then verify public sign-in/authorized MCP reads and pinned upstream identity. Missing/wrong keys must produce unavailable results without an upstream request. Never invent a new key for existing ciphertext, fall back to plaintext, or overwrite inaccessible connection rows. Restore must remain closed until the later independent deletion/revocation authority has been reapplied; this slice does not establish safe production backup restore.

The offline command is a trusted operator interface, not an application administrator capability. Provider key custody, actual encrypted-at-rest inspection, rotation inventory and a controlled platform recovery require separately recorded operator evidence before closing their acceptance gate.

## Operator predeployment status (2026-10-19)

Fresh Cloudflare/D1 read-back confirmed the seven existing bindings, an active verified owner with exactly one credential method and one Google method, the unique provider-subject index and MCP generation ledger. The #74 connection table was absent. A new pre-#74 baseline was captured for later comparison; this fresh observation does not reconstruct the unavailable earlier local baseline. At this predeployment observation the live bundle was still the #73 deployment `58354e4`.

A protected 1Password escrow-creation attempt was rejected with `Permission (101)`; fresh inspection found zero matching escrow items. No secret value was persisted or printed. No Durable Object namespace, vault binding, #74 migration or new code deployment was activated. At this preflight stage, key escrow access, separate custody, deployed encryption/rotation/recovery and target-runtime read-only AimHarder access were pending; #74 remained open. The subsequent activation below resolves the initial custody/deployment blockers. No purchase or plan change occurred. This preflight changes no architecture or acceptance requirement.

## Isolated platform activation (2026-10-19)

The owner manually created the recovery Password item. The existing read-only 1Password service account verified an independent base64-encoded 32-byte key without printing it or creating any item. The proposed additional provisioning token was withdrawn; no new service account, expanded token permission or service-account write was required. The key remains in separate owner-managed 1Password custody; its runtime ring and active identifier were supplied through protected Cloudflare `VAULT_KEYS` and `VAULT_ACTIVE_KEY_ID` secret bindings. An interrupted first secret operation was resolved by fresh provider read-back before continuing, without repeating a successful mutation.

The operator applied only reviewed `0005-aimharder-connection.sql`, once. Read-back confirmed the exact four connection columns, zero initial rows and an empty foreign-key check. Pinned Wrangler deployed the reviewed production bundle from integration `42929b0`. Fresh platform reads confirmed all ten binding names/types, the private `AccountConnection` SQLite namespace and its matching binding, preservation of the original seven auth/mail/Google bindings, disabled alternate origins and disabled observability. No initial migration was replayed. Wrangler reported a 4,551.37 KiB upload, 802.33 KiB gzip and 127 ms startup; these are deployment measurements, not request CPU, load or cost evidence.

All eleven configured-mail anonymous HTTPS checks passed without requesting mail. Both new connection routes returned 401 to anonymous requests. Maintained authorization metadata at `/.well-known/oauth-authorization-server/api/auth` retained the exact isolated issuer, S256 and refresh support without dynamic client registration. Fresh D1 comparison against the new pre-#74 baseline retained the owner's portal identity/profile, active verified administrator state, exactly one credential method and one Google method, and the existing unique provider-subject index and MCP generation ledger. No purchase, plan change, additional mail or sporting write occurred.

This establishes initial key custody and isolated schema/namespace/code activation. The owner has been asked to connect their own AimHarder account through the private signed-in portal; that target-runtime upstream journey is pending. Actual platform ciphertext inspection after connection, controlled key rotation/recovery, runtime CPU/load/cost and the later #69 features remain unverified. Synthetic restart/rotation evidence below does not close those deployed gates; #74 remains open.

## Local evidence (2026-10-19)

Seven public/operator journeys use the actual production portal entry, maintained sign-in/OAuth, SDK v2 over HTTP, real AimHarder client and workerd/D1/SQLite Durable Objects. External AimHarder HTTP is the only sporting substitute and unexpected outbound requests fail. Synthetic identities, credentials and keys are clearly artificial; no real account or provider is contacted.

Initial connection was red at HTTP 404, then passed with a different upstream email, verified own context and one-login cookie reuse. The gym-settings slice was red at missing route and invalid-zone behavior, then passed with explicit multi-gym default, confirmed/assumed zones and overlapping gym/boid isolation. Browser forms expose verified choices without credential echo, reject foreign Origin/invalid membership/zone and keep existing connection on unsupported replacement.

A held external response for account A does not block B. One expiry triggers one recovery; a second expiry stops. A later invalid login latches only A, while B retains its working cookie without a new login. Restart uses the pinned upstream numeric identity; a changed identity fails closed. Wrong keys and copying an authenticated envelope to another portal owner cause safe errors with no upstream request. Disposable D1/DO state actually persists across runtime disposal/recreation: the pinned Miniflare version uses `resourcePersistencePath`; ignored legacy persistence options were detected and corrected by the first restart assertion.

Review found that selected-gym query validation hid settings after a membership change. A new public regression was red at status 503 after restart with the saved default removed. Own-session verified discovery now returns current choices and an explicit selection-required form; the actual browser form repairs default/confirmed zone without credentials, while MCP keeps its original safe error until repair. A missing-selection form retry was also red before retaining the existing settings form. Foreign/removed gym selection and replacement still reject, and the other participant remains unaffected.

The separate operator exercise inspects synthetic encrypted rows in memory for plaintext credential/key canaries, then invokes the actual offline rotation command. Missing command was red before implementation. Conditional rewrap and active-key-only restart recover both public accounts; stale prepared SQL cannot overwrite a subsequent gym configuration. An empty ring fails closed without an upstream request. No plaintext database dump or secret output is retained. This is synthetic encryption/procedure evidence, not platform-secret escrow or deployed recovery evidence.

API research and existing sporting semantics are unchanged: no new external contract is inferred, and no upstream write was sent. The local stdio package keeps its entry point and eighteen public tools; the trusted client identity guard is used by the hosted account boundary. Full regression/check results are recorded in [validation](validation.md).
