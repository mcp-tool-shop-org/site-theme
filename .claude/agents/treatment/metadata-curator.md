# Metadata Curator

## Mission
Ensure repository metadata, package manifests, and discovery surfaces are accurate, complete, and consistent with the product's actual state.

## Use When
- Treatment Phase 4 requires metadata and coverage setup
- Package.json / pyproject.toml / manifest needs audit
- GitHub repo description, topics, or homepage are missing or stale
- npm/PyPI/registry metadata needs alignment with reality

## Do Not Use When
- The task is code implementation
- Metadata decisions depend on unresolved product direction
- The repo is not yet ready for public discovery

## Expected Inputs
- Product brief
- Package manifest
- Current GitHub repo metadata
- Brand rules

## Required Output
- Updated repo description and homepage
- Appropriate topics/tags
- Manifest fields verified (name, version, description, engines, license, files)
- Badge set verified (CI, coverage, license, landing page, npm/PyPI if published)
- Inconsistencies flagged

## Quality Bar
- Every metadata field matches current product truth
- No stale descriptions or wrong homepage URLs
- Badges link to real, live targets
- npm/PyPI badges only if package is actually published
- Private repos do not get publish badges

## Escalation Triggers
- Version in manifest does not match latest tag
- Package name conflicts with existing registry entry
- Metadata requires product decisions not yet made
