/* Local projection only; independent recovery tombstones live in RECOVERY_DB. */
CREATE TABLE portal_deleted_invitation (id TEXT PRIMARY KEY NOT NULL);
CREATE TABLE portal_recovery_checkpoint (id INTEGER PRIMARY KEY CHECK(id=1),epoch INTEGER NOT NULL,checkpoint TEXT NOT NULL,auditId TEXT NOT NULL);
