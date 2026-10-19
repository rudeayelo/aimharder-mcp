CREATE TABLE recovery_head (authorityId TEXT PRIMARY KEY, epoch INTEGER NOT NULL, gate TEXT NOT NULL CHECK(gate IN ('open','closed')), closedAt INTEGER, checkpoint TEXT NOT NULL);
CREATE TABLE recovery_lease (id TEXT PRIMARY KEY, epoch INTEGER NOT NULL, startedAt INTEGER NOT NULL);
CREATE TABLE recovery_deleted (userId TEXT PRIMARY KEY, deletedAt INTEGER NOT NULL, cleanupDeadline INTEGER NOT NULL, purgePending INTEGER NOT NULL DEFAULT 1 CHECK(purgePending IN (0,1)), purgedAt INTEGER, memoryClearedAt INTEGER, lastAttemptAt INTEGER, lastSuccessAt INTEGER, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','cleaned','failed','overdue')));
CREATE TABLE recovery_invitation (id TEXT PRIMARY KEY,userId TEXT NOT NULL);
CREATE TABLE recovery_snapshot (checkpoint TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE recovery_restore (checkpoint TEXT PRIMARY KEY, bookmark TEXT NOT NULL, targetAt INTEGER NOT NULL, authorizedAt INTEGER NOT NULL);
CREATE TABLE recovery_projection_audit (checkpoint TEXT PRIMARY KEY,auditId TEXT NOT NULL,startedAt INTEGER NOT NULL,completedAt INTEGER);
CREATE TABLE recovery_watchdog (id INTEGER PRIMARY KEY CHECK(id=1),lastAttemptAt INTEGER NOT NULL,lastSuccessAt INTEGER,status TEXT NOT NULL,lastPurgedCount INTEGER NOT NULL DEFAULT 0);
CREATE TABLE recovery_interval (epoch INTEGER PRIMARY KEY, closedAt INTEGER NOT NULL, openedAt INTEGER);
