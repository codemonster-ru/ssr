# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/lang/en/).

## [Unreleased]

## [1.0.4] - 2025-09-24

### Fixed

-   Moved `vite` from `dependencies` to `peerDependencies` to ensure the project uses the same Vite instance as the consumer app. This prevents issues with `.vue` files being parsed by a different Vite version and fixes `module is not defined` errors during SSR.

## [1.0.3] - 2025-09-24

### Added

-   CLI: New `--mode` parameter (`development` | `production`), passed to `loadConfig`.

### Fixed

-   Unit tests: stabilized with the correct `vi.mock` path, no longer require a real `dist`.
-   CI: `playgrounds/vue` is now built before unit and e2e tests.
-   CI: Added dependency installation for `playgrounds/vue` via `npm install --prefix playgrounds/vue`.
-   Fixed crashes in GitHub Actions due to missing dependencies and mismatched `package-lock.json` in the playground.

## [1.0.2] - 2025-09-24

### Added

-   `MODE` field in config (`development` | `production`), support for `NODE_ENV=test` as `development`.
-   Support for the `--mode` CLI parameter and the `MODE` environment variable.

### Changed

-   In `entry-loader.ts`, dev mode now always uses `appType: 'custom'` for stable SSR.
-   In `loadEntryDev`, the path to `DEV_ENTRY_SERVER` is resolved relative to `DEV_ROOT`.

### Fixed

-   Fixed e2e test crashes due to incorrect entry selection when `NODE_ENV=test`.
-   Fixed a bug with searching for entry-server.ts when `--devRoot` is specified. - Unit tests now mock `entry-server.js` and no longer require a real `dist` build.

## [1.0.1] - 2025-09-23

### Changed

-   Updated package.json (added `bugs`, `homepage` fields, improved repository link).

## [1.0.0] - 2025-09-21

### Added

-   Initial CLI implementation (`server`, `render`) for SSR.
-   SSR pipeline with Vue support.
-   Configuration via `.env` and CLI arguments.
-   Support for `TEST_MODE` for dev-loading entries without port conflicts.
-   Basic structure of unit and e2e tests (`test:unit`, `test:e2e`).
-   CI (GitHub Actions) with unit/e2e separation and reporting artifacts.
-   Fixture `entry-server.fixture.ts` for unit tests.

### Changed

-   CLI tests (`cli-render`, `cli-server`) now use random ports.
-   Vitest config: disabled concurrent execution, increased timeout to 20s.
-   Test structure split into `tests/unit` and `tests/e2e`.

### Fixed

-   Port conflicts during parallel tests.
-   An error due to missing `.env` no longer blocks tests.
-   Correct termination of the Vite dev server during tests.
