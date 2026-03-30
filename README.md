# My Cursor setup

Personal workspace for a Cursor-focused blog and a small full-stack demo used in those posts.

## Contents

| Path               | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `WPM test/`        | Typing-speed (WPM) app: **Vite + React + TypeScript** frontend, **NestJS** API |
| `project-setup.md` | Original brief: stack, flows, backend/frontend expectations                    |
| `demo.mp4`         | Short demo recording of the project behavior                                   |
| `blog-res/`        | Draft assets and screenshots for posts                                         |
| `.cursor/rules/`   | Cursor rules (e.g. NestJS feature scaffold for `/nestjs-feature`)              |

## WPM test app

**Prerequisites:** Node.js compatible with the projects’ `package.json` files.

### Backend (`WPM test/backend`)

```bash
cd "WPM test/backend"
npm install
npm run start:dev
```

Defaults to **http://localhost:3000**. CORS allows the Vite dev origin (`http://localhost:5173`).

**Useful commands:** `npm run build`, `npm run test`, `npm run test:e2e`

### Frontend (`WPM test/frontend`)

```bash
cd "WPM test/frontend"
npm install
npm run dev
```

Open the URL Vite prints (typically **http://localhost:5173**).

**Useful commands:** `npm run build`, `npm run test`, `npm run lint`

### API overview (in-memory)

- **Paragraphs** — random typing text
- **Results** — submit and list recent runs
- **Personal best** — `POST/GET /personal-best` (and `PATCH /personal-best/:id`); state resets on server restart

## Cursor: NestJS feature scaffold

The rule `.cursor/rules/nestjs-feature-create.mdc` describes the layout for new Nest features. In chat you can invoke it as **`/nestjs-feature <Name>`** to match that structure.
