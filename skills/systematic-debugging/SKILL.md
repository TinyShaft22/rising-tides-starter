---
name: systematic-debugging
description: "4-phase root cause debugging methodology. Use when debugging any issue - web apps, APIs, scripts, or system problems. Prevents 'random stabbing' at fixes. Triggers on: 'debug', 'fix bug', 'error', 'not working', 'investigate issue', 'troubleshoot'."
---

# Systematic Debugging

A 4-phase methodology for finding and fixing bugs at their root cause.

## The Problem This Solves

Most debugging fails because developers:
1. Jump to conclusions without evidence
2. Fix symptoms instead of causes
3. Make changes without understanding the system
4. Don't verify fixes actually work

This skill enforces a disciplined approach.

---

## The 4 Phases

### Phase 1: Investigation

**Goal:** Understand what's actually happening before changing anything.

1. **Reproduce the bug** — Can you trigger it reliably?
2. **Gather evidence** — Logs, error messages, stack traces
3. **Identify the scope** — When did it start? What changed?
4. **Map the data flow** — Trace inputs through the system

**Key Questions:**
- What is the expected behavior?
- What is the actual behavior?
- What are the exact steps to reproduce?
- What environment/conditions trigger it?

```bash
# Useful commands for investigation
git log --oneline -20        # Recent changes
git diff HEAD~5              # What changed
grep -r "error" logs/        # Search logs
```

### Phase 2: Pattern Analysis

**Goal:** Find patterns that reveal the root cause.

1. **When does it happen?** — Time-based patterns
2. **Where does it happen?** — Location patterns (files, functions)
3. **Who triggers it?** — User/input patterns
4. **What's common?** — Shared factors across occurrences

**Techniques:**
- Binary search through commits (`git bisect`)
- Isolate variables (disable features one by one)
- Compare working vs. broken states
- Review recent changes in affected areas

### Phase 3: Hypothesis Testing

**Goal:** Form a theory and test it with evidence.

1. **State the hypothesis clearly** — "The bug occurs because X"
2. **Predict the outcome** — "If X is the cause, then Y should be true"
3. **Design a test** — How to verify/falsify the hypothesis
4. **Run the test** — Observe actual results
5. **Iterate** — Refine or reject hypothesis based on evidence

**Rules:**
- One hypothesis at a time
- Test must be falsifiable
- Don't skip steps (even if you're "sure")
- Document what you tried

### Phase 4: Implementation

**Goal:** Fix the root cause, not just the symptom.

1. **Minimal fix** — Change only what's necessary
2. **Verify the fix** — Does it actually resolve the issue?
3. **Check for regressions** — Did the fix break anything else?
4. **Add defense** — Prevent similar bugs (tests, validation)

**Deliverables:**
- The actual fix
- A test that would have caught this bug
- Documentation of what was wrong and why

---

## Quick Checklist

```
[ ] Can I reproduce the bug reliably?
[ ] Do I have the exact error message/logs?
[ ] Do I know when this started happening?
[ ] Have I traced the data flow?
[ ] Do I have a clear hypothesis?
[ ] Did I test the hypothesis before fixing?
[ ] Did I verify the fix works?
[ ] Did I add a test to prevent regression?
```

---

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Make random changes hoping something works | Form a hypothesis first |
| Fix the symptom | Find the root cause |
| Assume you know the answer | Verify with evidence |
| Skip testing the fix | Always verify |
| Forget to prevent recurrence | Add tests/validation |

---

## Reference Files

- `references/root-cause-tracing.md` — Trace backward through call stack
- `references/defense-in-depth.md` — Add validation at multiple layers
- `references/hypothesis-testing.md` — Form theory, test with evidence

---

## When to Use

Any debugging scenario:
- Application crashes or errors
- Features not working as expected
- Performance issues
- Integration failures
- Flaky tests
- Production incidents

The more serious the bug, the more important to follow this methodology.
