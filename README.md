# Superagent Playground

A disposable repository for validating coding-agent requests, pull requests, review follow-ups and CI. This is a test fixture, not a Super-agent implementation or an official DeepSeek product.

The initial fixture normalizes one global font preference. It has no dependencies, credentials, network calls or background jobs.

```sh
npm test
```

Node.js 24+ is required. GitHub Actions runs the same tests on Linux, macOS and Windows.

The `main` branch retains the starting fixture. [PR #2](https://github.com/DavidDingXu/superagent-playground/pull/2) records the real model-generated font change and its same-PR review follow-up. See the [reproduction guide](docs/REPRODUCE.md) for the exact scope, the controlled event workflow and the upstream companion patch. A ready draft is not a merged or production-validated result.

## Suggested live acceptance task

1. From an allowed human account, ask the configured agent to support independent `body`, `code` and `terminal` font preferences while preserving existing global preferences.
2. Verify that one task creates one PR, with tests for compatibility and independent configuration.
3. Leave a review asking for independent font sizes. The same task should update the same PR.
4. Repeat the same incoming event and restart the agent host. Check that it neither opens another PR nor repeats an external operation.
5. Merge as the human reviewer and verify that a concise result returns to the original request thread.

Do not count a manually prepared PR as proof that the upstream agent executed this chain. A real model provider and distinct requester/agent identities are required for that acceptance test.

## 中文说明

这是验证研发协作流程的专用测试仓库。初始代码只支持一套全局字体设置，可用“增加正文、代码、终端的独立字体与字号”作为真实 Agent 的验收任务。代码修改、评审跟进和合并应沿同一个任务、同一个 PR 推进。

仓库可以由当前已登录的账号创建和维护；持续监听的机器人应使用独立身份。不要在这里上传密钥、个人资料或真实业务代码。
