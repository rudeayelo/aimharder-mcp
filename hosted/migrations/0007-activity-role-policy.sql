CREATE TABLE portal_activity_policy (
  role TEXT PRIMARY KEY CHECK (role IN ('admin','user')),
  publication INTEGER NOT NULL CHECK (publication IN (0,1)),
  deletion INTEGER NOT NULL CHECK (deletion IN (0,1))
);
INSERT INTO portal_activity_policy (role,publication,deletion) VALUES ('admin',1,1),('user',0,0);
