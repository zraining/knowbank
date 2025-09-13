# 可重用的自定义指令

自定义指令使您能够定义通用指南和规则，这些规则会自动影响 AI 生成代码和处理其他开发任务的方式。

## 指令

### Git提交描述生成

```
Generate commit messages following the Conventional Commits format."

Use the following type prefixes: feat (new feature), fix (bug fix), docs (documentation), style (formatting), refactor (refactoring), perf (performance optimization), test (testing), chore (build/dependencies)."

The first line of the commit message should be concise and clear, not exceeding 72 characters."

Use the format: <type>(<optional scope>): <description>"

In the body, provide detailed explanations of the changes and context, with each line not exceeding 72 characters."

For bug-fix commits, reference the issue number in the footer: Fixes #123"

For breaking changes, use the BREAKING CHANGE: prefix in the footer."

Use present tense, e.g., 'Add feature' instead of 'Added feature'."

Analyze the code changes and extract the core modifications for the commit message."

If the changes involve multiple modules, specify the scope: feat(auth): Add login feature"
```

这个自定义指令用于生成符合 [Conventional Commits 规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83) 的 Git 提交消息。它确保提交消息具有一致的格式和清晰的结构，包括类型前缀、可选的作用域、简洁的描述以及详细的正文说明。该指令特别适用于团队协作项目，有助于维护清晰的项目历史记录和自动化工具的集成。

