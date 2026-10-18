CREATE TABLE portal_mcp_grant (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  clientId TEXT NOT NULL REFERENCES oauthClient(clientId) ON DELETE CASCADE,
  revocationGeneration INTEGER NOT NULL,
  revokedAt INTEGER
);
CREATE INDEX portal_mcp_grant_owner_client ON portal_mcp_grant(userId,clientId);
CREATE TABLE portal_mcp_revocation (
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  clientId TEXT NOT NULL REFERENCES oauthClient(clientId) ON DELETE CASCADE,
  generation INTEGER NOT NULL,
  PRIMARY KEY (userId,clientId)
);
