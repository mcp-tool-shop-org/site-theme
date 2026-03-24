# Task Packet

## Task ID
{{task_id}}

## Title
{{title}}

## Requested Outcome
What should exist or be true when this is done?

## User Intent
Why does this matter?

## Scope
What is in bounds?

## Non-Goals
What is explicitly out of bounds?

## Inputs
Files, docs, context, links, prior handoffs.

**Verification requirement:** All referenced files, classes, and modules must be verified as live and relevant to the current product before the packet is finalized. If a file belongs to a fork ancestor or deprecated system, it must not appear as an input unless the task is explicitly about removing or migrating it.

## Constraints
Tech, product, legal, timeline, quality, compatibility.

## Deliverable Type
Plan | Design | Code | Test | Copy | Review

## Assigned Role
{{role_name}}

## Upstream Dependencies
What must already be true before this role should proceed?

**Verification requirement:** Each dependency must be confirmed against repo truth (file exists, interface is accessible, state is reachable), not assumed from documentation or memory. If a dependency cannot be verified, mark it as `unverified` and flag for Orchestrator review before decomposition proceeds.

## Done Definition
How do we know this role completed successfully?

## Open Questions
Unknowns that may block execution.
