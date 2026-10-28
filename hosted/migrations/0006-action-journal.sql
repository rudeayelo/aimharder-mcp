CREATE TABLE portal_action_journal (
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  referenceDigest TEXT NOT NULL,
  revision TEXT NOT NULL,
  action TEXT NOT NULL,
  expires INTEGER NOT NULL,
  instance TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('consumed','possibly-sent','finished')),
  facts TEXT,
  PRIMARY KEY (userId,referenceDigest)
);
CREATE INDEX portal_action_journal_expiry ON portal_action_journal(expires);
