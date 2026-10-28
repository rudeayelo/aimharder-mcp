/* Application invariant: one owner per provider subject, including one password
method per portal identity. Fail migration on unexpected existing duplicates;
do not delete or silently merge identities to make the index succeed. */
CREATE UNIQUE INDEX portal_account_method_subject ON account(providerId, accountId);
