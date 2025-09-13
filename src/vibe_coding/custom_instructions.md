# 可重用的自定义指令

自定义指令使您能够定义通用指南和规则，这些规则会自动影响 AI 生成代码和处理其他开发任务的方式。

## 指令

### 语言响应规则

```
Always respond in the same language that the user uses for their query. If the user asks in Chinese, respond in Chinese; if in English, respond in English, and so on.

Keep the comments in the generated code using English, even when responding in other languages. This maintains code readability while respecting the user's preferred language for explanations.
```

此指令确保AI助手能够根据用户的查询语言自动调整响应语言，提供更自然的交互体验。同时保持代码注释使用英文，确保代码的国际化可读性和专业性。这种双语策略既尊重了用户的语言偏好，又维护了代码的标准化。

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

### Pull Request 标题和描述生成
```
The PR title should concisely describe the changes, following the Conventional Commits format.

Generate the PR description using the following template:

## Changes\n[Briefly describe the main changes in this PR]

## Issues Addressed\n[Describe the problems solved or requirements implemented by this PR]

## Implementation\n[Briefly describe the technical implementation and key decisions]

## Testing\n[Describe how these changes were tested, including unit tests, integration tests, and manual testing]

## Related Links\n[Add relevant issue links, documentation, or other resources]

## Notes\n[Highlight areas requiring special attention from reviewers or potential issues]

## Screenshots (if applicable)\n[Add relevant screenshots, especially for UI changes]

Clearly indicate in the description if the PR includes database migrations, API changes, or configuration adjustments.

If the PR is a WIP (Work in Progress), prefix the title with [WIP].

If the PR depends on other PRs, note this in the description using the format Depends on #123.

Reference related issues using the Closes #123 format to automatically close them upon merge.
```

此指令规范了Pull Request的标题和描述格式，确保代码审查过程的标准化和高效性。通过结构化的模板，帮助开发者清晰地描述变更内容、解决的问题、实现方案和测试情况，提高团队协作效率和代码质量管理水平。