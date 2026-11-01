# Contributing

Keep changes focused on a reproducible coding-agent acceptance scenario, its fixture or its verification. This repository is not a general-purpose agent platform.

- Use Node.js 24+ and run `npm test` before proposing a fixture change.
- Describe the intended behavior, the previous behavior and how it was verified.
- Separate deterministic replay, live model/tool execution and unimplemented design proposals in every claim.
- For a new scenario, define its input, observable result, permissions and failure boundary. Avoid assertions that merely repeat implementation constants.
- Preserve the global font preference contract or document any migration explicitly.
- Keep tokens, model credentials, machine-specific paths and generated runtime state out of commits.
- Do not change workflow permissions or add dependencies without explaining why the scenario needs them.
- Propose a pull request; acceptance of an agent result still requires review.

The upstream companion patch is a generated artifact of a separate pinned checkout. If it changes, recheck clean application and the upstream's `pnpm check`; do not hand-edit it into a different implementation.
