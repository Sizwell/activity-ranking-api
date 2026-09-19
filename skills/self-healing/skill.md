# Self-Healing Skill

## Purpose

Propose a safe correction to an automated test based on failure analysis.

## Inputs

- Failed test
- Failure analysis
- Original test intent

## Actions

- Determine whether automated healing is appropriate
- Identify the smallest reasonable change
- Preserve the original test intent
- Generate the proposed updated test

## Rules

- Do not change acceptance criteria to make a test pass.
- Do not hide genuine application failures.
- Do not remove meaningful assertions.
- The updated test must be executed again.

## Output

- Proposed change
- Updated TypeScript test
- Reason for the change