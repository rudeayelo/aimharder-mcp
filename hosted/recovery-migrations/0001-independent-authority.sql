CREATE TABLE recovery_head (authorityId TEXT PRIMARY KEY, epoch INTEGER NOT NULL, gate TEXT NOT NULL CHECK(gate IN ('open','closed')), closedAt INTEGER, checkpoint TEXT NOT NULL);
CREATE TABLE recovery_lease (id TEXT PRIMARY KEY, epoch INTEGER NOT NULL, startedAt INTEGER NOT NULL);
CREATE TABLE recovery_deleted (userId TEXT PRIMARY KEY, deletedAt INTEGER NOT NULL);
CREATE TABLE recovery_invitation (id TEXT PRIMARY KEY);
CREATE TABLE recovery_snapshot (checkpoint TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE recovery_restore (checkpoint TEXT PRIMARY KEY, bookmark TEXT NOT NULL, targetAt INTEGER NOT NULL, authorizedAt INTEGER NOT NULL);
CREATE TABLE recovery_interval (epoch INTEGER PRIMARY KEY, closedAt INTEGER NOT NULL, openedAt INTEGER);
