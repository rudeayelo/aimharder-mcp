CREATE TABLE portal_aimharder_connection (
  userId TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
  revision TEXT NOT NULL,
  envelope TEXT NOT NULL,
  updatedAt INTEGER NOT NULL
);
