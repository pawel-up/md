---
name: review-staged
description: Generate structured code review for staged files AND all branch commits since main. Provides full PR-equivalent coverage before pushing.
---

# Review Staged Files Skill

Generate AI-powered code review comments covering **both** your currently staged changes and all commits on the branch since it diverged from `main`. This gives the same full-branch view that Copilot and other PR reviewers see — not just what you're about to commit.

## Usage

```bash
/review-staged              # Review staged changes + full branch diff against main
/review-staged --verbose    # Show detailed analysis
```

Examples:
- `/review-staged` - Review staged changes and all branch commits not yet on main
- `/review-staged --verbose` - Show detailed analysis with full context

## What this skill does

1. **Checks for staged files** using `git diff --staged --name-only`
2. **Fetches staged changes** using `git diff --staged`
3. **Fetches full branch diff** using `git diff $(git merge-base HEAD origin/main)...HEAD` — covers all commits on the branch, not just staged files. This prevents issues in prior commits from going unreviewed.
4. **Combines both diffs** for review: staged diff = what you're about to add; branch diff = full PR picture that Copilot will see
5. **Performs architectural review**: Questions design decisions, checks for scope creep, validates use cases
6. **Analyzes changes** for security, testing, design patterns, and code quality issues
7. **Creates actionable feedback**: Specific refactoring suggestions based on file names and patterns
8. **Generates structured review document** saved to a markdown file
9. **Shows summary** of all issues found organized by severity

## Engineering Review Principles

### Architectural Review
- **Design Decision Validation**: Questions "why" before reviewing "how"
- **Use Case Validation**: Requires concrete scenarios for new features
- **YAGNI Enforcement**: Questions features without documented need

### Design Patterns
- **KISS (Keep It Simple, Stupid)**: Prefers simple, straightforward solutions
- **DRY (Don't Repeat Yourself)**: Identifies code duplication
- **SOLID principles**: Especially Single Responsibility Principle
- **YAGNI (You Aren't Gonna Need It)**: Avoids over-engineering
- **One class per file**: Enforces clean code organization

### Code Quality
- **No large files**: Flags files over 500 additions
- **Function reuse**: Encourages reusing functions across commands
- **Self-documenting code**: Prefers clear code over excessive comments
- **Minimal changes**: Makes only necessary changes to solve the problem

### Testing Standards
- **Framework**: Japa for Node environment, Lupa for browser environment.
- **Quality over quantity**: Focus on critical paths and edge cases
- **Code reliability**: Code without tests is BLOCKING
- **Mock external dependencies**: Proper mocking patterns

### Security
- **No hardcoded secrets**: Use environment variables

## Review Output

Generated review is saved to:
```
.codereviews/staged-review-<timestamp>.md
```

The review includes:
- **Summary**: Overview of changes and key concerns — includes both staged and branch coverage
- **Critical Issues**: Blocking issues that must be fixed (labeled `[staged]` or `[branch]`)
- **High Priority**: Important issues that should be addressed
- **Medium Priority**: Issues that improve code quality
- **Low Priority**: Suggestions for enhancement
- **Informational**: Best practices and recommendations
