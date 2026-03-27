# SIROS ID Wallet Landing
[![Test](https://github.com/sirosfoundation/wallet-landing/actions/workflows/test.yml/badge.svg)](https://github.com/sirosfoundation/wallet-landing/actions/workflows/test.yml)
[![Lint](https://github.com/sirosfoundation/wallet-landing/actions/workflows/lint.yml/badge.svg)](https://github.com/sirosfoundation/wallet-landing/actions/workflows/lint.yml)
[![License](https://img.shields.io/github/license/sirosfoundation/wallet-landing)](LICENSE)
[![Docker Image](https://img.shields.io/badge/ghcr.io-wallet--landing-blue?logo=docker)](https://ghcr.io/sirosfoundation/wallet-landing)

Landing page for the [SIROS ID Wallet](https://id.siros.org). Handles the initial entry point, routing returning users to their tenant, presenting tenant selection for multi-tenant users, or showing the welcome page for new visitors.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+

## Getting Started

```sh
pnpm install
make dev
```

## Scripts

| Command | Description |
|---|---|
| `make dev` | Start the Vite dev server |
| `make build` | Production build |
| `make preview` | Preview the production build |
| `make lint` | Run Biome linter |
| `make lint-fix` | Auto-fix lint issues |
| `make test-unit` | Run unit tests (Vitest) |
| `make test-e2e` | Run e2e tests (Playwright + Chromium) |

## Deployment

Docker images are available at `ghcr.io/sirosfoundation/wallet-landing`. No environment variables or other configuration is required.

```yaml
services:
  wallet-landing:
    image: ghcr.io/sirosfoundation/wallet-landing:latest
    ports:
      - "127.0.0.1:4000:80"
```

The container runs NGINX on port 80 and serves the static app.

## License

[BSD-2-Clause](LICENSE) — Copyright (c) 2026, SIROS Foundation
