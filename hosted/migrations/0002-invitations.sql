CREATE TABLE portal_invitation (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  tokenDigest TEXT UNIQUE NOT NULL,
  expiresAt INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  createdAt INTEGER NOT NULL,
  revokedAt INTEGER,
  acceptedAt INTEGER,
  acceptedUserId TEXT REFERENCES user(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX portal_owner_bootstrap ON portal_invitation(role) WHERE role = 'admin';
CREATE TABLE portal_pending_admission (
  userId TEXT PRIMARY KEY NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  invitationId TEXT NOT NULL REFERENCES portal_invitation(id)
);
CREATE TABLE portal_verification_delivery (
  tokenDigest TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  invitationId TEXT NOT NULL REFERENCES portal_invitation(id),
  expiresAt INTEGER NOT NULL
);
CREATE TABLE portal_participant (
  userId TEXT PRIMARY KEY NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  invitationId TEXT UNIQUE NOT NULL REFERENCES portal_invitation(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  admittedAt INTEGER NOT NULL
);
