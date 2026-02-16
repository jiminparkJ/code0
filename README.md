# Crypto Foundations Learning Report (GitHub Pages Ready)

A multi-page interactive learning-report website built with **Vite + vanilla JS**. It teaches core crypto concepts in a guided sequence with practical simulations and concise mentor-facing summaries.

## Features

- Multi-page static site (Home, Learning Path, Glossary, Mentor Summary, Reflection)
- Responsive, keyboard-accessible layout with high-contrast dark theme
- Required educational simulations:
  - Linked-block blockchain immutability demo
  - Public/private key + signature verification simulator
  - Mempool to block inclusion simulator (fee-based prioritization)
  - Ethereum gas/fee intuition widget
  - On-chain vs off-chain comparison toggle
  - Wallet safety readiness module
  - Explorer walkthrough mock transaction details
- GitHub Pages deployment workflow included

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── src/
│   ├── learning.js
│   ├── shared.js
│   └── styles.css
├── glossary.html
├── index.html
├── learning-path.html
├── mentor-summary.html
├── reflection.html
├── package.json
├── vite.config.js
└── README.md
```

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL Vite prints in the terminal.

## Build for production

```bash
npm run build
```

The static output is generated into `dist/`.

## Deploy to GitHub Pages (GitHub Actions)

This repo includes `.github/workflows/deploy-pages.yml`.

1. Push this project to GitHub.
2. In GitHub repo settings:
   - Go to **Settings → Pages**
   - Set **Source** to **GitHub Actions**.
3. Push to `main` (or your default branch).
4. The workflow builds and publishes `dist/` to GitHub Pages.

## Edit content

- Main guided content: `learning-path.html`
- Concept map + home intro: `index.html`
- Definitions: `glossary.html`
- Mentor short read: `mentor-summary.html`
- Reflection: `reflection.html`
- Shared visual styling: `src/styles.css`
- Interactive module logic: `src/learning.js`

## Notes

- This project is fully static (no backend, no database).
- The signature and chain demos are **educational simulations**, not production cryptographic tooling.
