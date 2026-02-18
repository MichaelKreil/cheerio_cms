# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-18

### Features

- add CI workflow for continuous integration with Node.js versions 20, 22, and 24
- add dependabot configuration for npm and GitHub Actions updates
- add LICENSE file to clarify software usage and rights
- add exports, engines, repository, bugs, homepage, and keywords fields to package.json

### Bug Fixes

- setBaseUrl upgrades head attributes
- update version to 1.0.1 in package.json and package-lock.json
- correct script names in package.json for consistency
- update check script in package.json for consistency

### Documentation

- add dependency graph section to README.md

### Tests

- add mock for fetch in fromURL test case

### Chores

- update dependencies and devDependencies in package.json
- update dependencies and improve upgrade script
- migrate testing framework from Jest to Vitest and update dependencies
- add groups configuration for npm and GitHub Actions in dependabot.yml
- update release and upgrade scripts to use vrt tool
- upgrade vitest to version 4.0.18 in package.json and package-lock.json
- update build script and add documentation generation commands in package.json
- update .gitignore to include docs directory and enhance documentation generation scripts in package.json
- update CI workflow to include permissions and concurrency settings for GitHub Pages deployment
- **deps:** bump the all group across 1 directory with 3 updates
- remove unused CI permissions and concurrency settings; add deploy-docs workflow
- update ESLint config to simplify ignore patterns for coverage, dist, docs, and node_modules

### Other Changes

- initial commit
- add readme

