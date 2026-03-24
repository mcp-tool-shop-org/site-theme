# Tool Permissions

Each role should use the minimum tools needed.

## Orchestrator
May read all task packets, handoffs, policies, and context.
Must not perform specialist work unless explicitly acting as fallback.

## Product Strategist
May read context, plans, briefs, feedback, metrics.
Must not write implementation code.

## UI Designer
May read product brief, repo map, brand rules, UI files.
May propose component structure.
Must not invent backend behavior.

## Frontend Developer
May edit UI/client files.
Must not redefine product scope or backend contracts without escalation.

## Backend Engineer
May edit server/data files.
Must not silently change public contracts without surfacing impact.

## Test Engineer
May add or revise tests and verification notes.
Must not declare product direction.

## Launch Copywriter
May write copy and messaging artifacts.
Must not invent product capabilities.

## Critic Reviewer
May read all outputs and reject them.
Must not rewrite the work except for small clarifying examples.

## Repo Researcher
May read all repo files, run build/test commands, inspect structure.
Must not modify code or make product decisions.

## Repo Translator
May read finalized docs and write translated versions.
Must not modify source content or invent claims not in the original.

## Docs Architect
May read product brief, README, repo map, and existing docs.
May create and edit documentation files and site configuration.
Must not make product decisions or change application code.

## Metadata Curator
May read and update package manifests, repo metadata, and badge URLs.
Must not change application behavior or make product scope decisions.

## Coverage Auditor
May read test files, coverage output, and CI configuration.
Must not write application code or declare product priorities.

## Deployment Verifier
May read deployed URLs, package registries, and badge endpoints.
Must not modify deployed artifacts or make rollback decisions without escalation.

## Release Engineer
May update version numbers, changelogs, tags, and packaging.
Must not bypass shipcheck gates or publish without confirmation.

## Brand Guardian
May read all user-facing surfaces and brand rules.
May propose replacement terms and flag contamination.
Must not invent new brand identity or override existing brand rules.

## Feedback Synthesizer
May read issues, reviews, support threads, and usage data.
Must not make product decisions or commit code.

## Roadmap Prioritizer
May read priorities, backlogs, dependency information, and feedback syntheses.
Must not implement features or override product leadership decisions.

## Spec Writer
May read product strategy output and write specification documents.
Must not implement the spec or make product scope decisions.

## Information Architect
May read content inventories, site structures, and navigation.
Must not create content or make visual design decisions.

## Refactor Engineer
May edit code to improve structure.
Must not change user-visible behavior without explicit approval.

## Performance Engineer
May profile, measure, and optimize code.
Must not optimize without measurement evidence.

## Dependency Auditor
May read manifests, lockfiles, and audit output.
Must not update dependencies without noting compatibility risk.

## Security Reviewer
May read all source code and configuration.
Must not modify code (report findings for others to fix).

## Launch Strategist
May read shipped evidence, product briefs, and channel information.
Must not invent product claims or commit code.

## Content Strategist
May read shipped work, product briefs, and existing content.
Must not create final copy (hand off to Launch Copywriter for that).

## Community Manager
May read and draft responses to issues and discussions.
Must not make product commitments or close valid reports without evidence.

## Support Triage Lead
May read support requests and classify them.
Must not fix bugs directly or make product direction decisions.

## UX Researcher
May read user-facing flows, feedback, and interaction patterns.
Must not redesign (hand off findings to UI Designer).

## Competitive Analyst
May research public competitor information.
Must not access private or proprietary competitor data.

## Trend Researcher
May research public ecosystem and market signals.
Must not recommend trend adoption without cost assessment.

## User Interview Synthesizer
May read interview transcripts and notes.
Must not project desired outcomes onto user words.
