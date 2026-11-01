# Reproduce the bounded GitHub experiment

This is an educational test fixture for the official [dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype), not a replacement agent framework. The upstream is MIT-licensed research code. The validated upstream commit is `6337fc823ce20251c8de8085948165c81aaa701e`.

## What was actually run

1. The upstream plugin was built and mounted in a separate, task-local Harness profile (`@deepseek-ai/dsh@0.2.1-rc.3`).
2. The real Router answered a minimal connectivity request using an existing DeepSeek account login.
3. A manually dispatched `Controlled lab event` workflow posted one predefined bot comment on Issue #1.
4. The configured GitHub Source polled it. A narrowly scoped rule accepted the listed bot's exact task marker as an **inferred** request.
5. One real Worker prepared an isolated Git worktree, changed the fixture's source/tests/README, ran tests and created draft PR #2.
6. A second controlled bot comment requested a compatibility note and a legacy-field projection test. The same Worker automatically updated the same PR with a second commit.
7. The final head `140491003f542db4dd5eed9c80d92bf88f47ad8b` passed 8 local tests and CI on Linux, macOS and Windows. A separate read-only review checked the three changed files.
8. The PR remained draft/open, and the agent's task processing was paused again.

No live Feishu conversation, merge, full Harness-host crash, cross-device daemon or fault-recovery benchmark was tested. Separate local experiments cover Engine/SQLite replay and a real sender-process kill with simulated remote transport; their results must not be described as live platform behavior.

The fixture was private while this experiment ran. It was prepared for public release after reviewing the code, issue/PR content and tracked files for credentials and personal paths.

## Start with the official runtime

Use upstream [SETUP.md](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/SETUP.md) and its deployment guide to create a dedicated profile. Keep model/account credentials out of the repository. Do not reset an existing profile with `--from-default-profile`.

Create your own disposable test repository from this fixture, configure that repository in the GitHub Source, and use a dedicated agent account for unattended work. The one-time experiment used the operator's existing login as execution identity and GitHub Actions as the distinct event identity. This convenience is not an execution-security boundary.

Upstream's service manager uses POSIX shell, Python `fcntl` and tmux. The fixture's three-platform CI does not establish that the upstream service runs natively on Windows.

## Restrict the test before enabling it

In the Superagent panel:

- Configure the test repository and the intended `gh` CLI.
- Set worker concurrency to 1, and prepare a separate worktree per task using the upstream documented prepare command.
- List your allowed human account and `github-actions[bot]` under the GitHub policy.
- Add one rule limited to the exact `[SUPERAGENT-LIVE-TEST]` marker and the predefined font task in your test repository. Allow only source, focused tests and README changes. Do not admit unrelated comments.
- Use automatic assessment only for that rule, and receive repository comments. A bot remains inferred; it does not gain the power to issue arbitrary human requests or stop a task.
- Require a draft PR and passing tests. For this experiment, forbid merge, issue closure, dependency changes, workflow changes, new reviewers and other repositories.

Inspect the configured scope before resuming processing. Upstream workers run with the OS user's permissions by default; enforce a separate OS/container/VM boundary for unattended use.

## Send controlled events

Create a test issue and manually dispatch the workflow. It defaults the recipient to the repository owner. Set the repository variable `SUPERAGENT_AGENT_LOGIN` if the configured agent has another login.

```sh
gh workflow run lab-event.yml --repo YOUR_OWNER/YOUR_TEST_REPO \
  -f target=ISSUE_NUMBER -f phase=initial
```

After a PR is created and bound to the same task, request the compatibility follow-up:

```sh
gh workflow run lab-event.yml --repo YOUR_OWNER/YOUR_TEST_REPO \
  -f target=PR_NUMBER -f phase=compatibility
```

These are command templates: replace the owner, repository and numeric IDs. The workflow can only post predefined messages and requires a maintainer's manual dispatch. Its ephemeral token has repository-local issue/PR permissions; the CI workflow has only content-read permission.

Check workflow completion and the actual GitHub comment before attributing any result to routing. GitHub polling has a minimum 60-second interval in this upstream version.

## Check the result

- One accepted task, one PR, one branch across the follow-up.
- The first change adds independent font families while preserving global values and fallback behavior.
- The follow-up explicitly documents the widened return shape. Exact equality or snapshots of the old two-field result need migration.
- Relevant tests pass on the actual PR head. Inspect the diff independently.
- Stop at a reviewable draft and pause processing again; do not infer approval to merge.

The optional `review` workflow phase asks for an example/non-mutation check that a model may already have produced. An accurate no-op is valid; use `compatibility` for the more specific, observed follow-up.

The [selected operational trace](evidence/review-followup.json) records a useful detail: subscription delivery reached the Worker at 04:16:08.793 UTC, it read the trigger at 04:16:11.244, and the Router attached the same event with a note at 04:16:21.572. This was an automatic Router tool call, not operator forwarding. Event deduplication and additional routing notes are distinct; this one trace does not establish a throughput result or show that all later assessment can be removed.

## Upstream companion patch

[`upstream-companion.patch`](upstream-companion.patch) contains the local Git-language test fix, a credential-free Engine/SQLite replay, a sender-process crash experiment, reproduction notes, and an **unimplemented** reliable-publication design. It does not replace the upstream engine.

Apply it to the fixed upstream commit:

```sh
git clone https://github.com/deepseek-ai/dsh-superagent-prototype.git
cd dsh-superagent-prototype
git switch --detach 6337fc823ce20251c8de8085948165c81aaa701e
git apply /PATH/TO/upstream-companion.patch
pnpm install --frozen-lockfile --ignore-scripts
pnpm check
```

The patched upstream passed typechecking, build and 1201 tests in 61 files on macOS. The patch was checked against a clean copy of the pinned source. Its architecture proposal has not been implemented or compared with upstream; it is not evidence of superior quality, cost or latency.

## Reproduce the sender crash window

After applying the patch, run:

```sh
pnpm exec vitest run tests/outbox-crash.spec.ts
```

The real child runs upstream Store/Effects/Outbox/SourceRegistry and the GitHub reply adapter. The CLI transport talks only to a loopback probe. Kill occurs after the probe has saved a comment, before the local receipt settles; the test asserts the requested kill and actual exit signal on POSIX, then starts a new process against the same SQLite file.

| Same crash point, different sender condition | Total simulated remote POSTs |
| --- | --- |
| Upstream GitHub adapter, stable marker still visible | 1 |
| Same durable queue, deliberately naive sender | 2 |
| Upstream adapter, only the hidden marker removed before restart | 2 |

Each case ends with a persisted sent receipt and no pending reply effect. This verifies the adapter's existing reconciliation and its assumptions; it does not add that mechanism. The probe's reads are immediately consistent, and its comment state survives in the independent parent process. Real GitHub failures, concurrent senders, visibility delays, Worker-issued Git/PR writes and full Harness-host recovery remain outside this experiment.

[The observed crash report](evidence/outbox-crash.json) retains the termination signals and operation counts. The test and fixture are in the companion patch.

Upstream attribution and MIT licensing remain intact. The diagram template's attribution and MIT notice are embedded in its HTML.
