# Security scope

The fixture code has no credentials, network access or background execution. The optional lab workflow can post predefined issue/PR comments when a maintainer manually dispatches it.

The upstream agent is a separate program with substantially broader privileges. Its default worker directories and CLI wrappers are not an OS sandbox. Use a restricted, separate execution identity and environment for unattended operation, scope the listened repository and admitted senders, and keep model and GitHub credentials outside tracked files.

The one-time experiment's use of the operator's existing account is not a production deployment recommendation. Pause processing after a bounded test. Do not use this fixture to evaluate untrusted code on a personal or production machine.

If you find a secret accidentally committed here, do not copy it into a public issue. Report the location privately to the repository owner and revoke the affected credential through its provider.
