# @codemonster-ru/ssr

[![npm
version](https://img.shields.io/npm/v/@codemonster-ru/ssr.svg?style=flat-square)](https://www.npmjs.com/package/@codemonster-ru/ssr)
[![Tests](https://github.com/codemonster-ru/ssr/actions/workflows/tests.yml/badge.svg)](https://github.com/codemonster-ru/ssr/actions)
[![License](https://img.shields.io/npm/l/@codemonster-ru/ssr.svg?style=flat-square)](LICENSE)

🚀 A universal SSR service for [Annabel Framework](https://github.com/codemonster-ru/annabel) **and standalone use**.

Allows you to render Vue (and potentially React, Svelte, Solid, etc.) components on the server (Server-Side Rendering) and use them in PHP applications via SSR Bridge or as a separate Node.js SSR service.

## ✨ Possibilities

-   Rendering Vue components (and other frameworks via Vite) on the server (Node.js).
-   `POST /render` API for getting the finished HTML.
-   Automatic HTML assembly:
    -   Injects `<script type="module">` for entry and chunks.
    -   Injects `<link rel="stylesheet">` for CSS.
    -   Adds `<link rel="modulepreload">` and `<link rel="preload">` for JS, CSS, fonts, images (configurable).
-   Easy integration with PHP via [`Annabel\SSR\Bridge`](https://github.com/codemonster-ru/annabel).
-   Can be run:
    -   Locally inside [Annabel Skeleton](https://github.com/codemonster-ru/annabel-skeleton).
    -   As a standalone server (Node.js, Docker, PM2, systemd).

## 📦 Installation

Global:

```bash
npm install -g @codemonster-ru/ssr
```

Or locally in the project:

```bash
npm install @codemonster-ru/ssr
```

## 🚀 Launch

### Via CLI

```bash
ssr server
```

By default the service runs at `http://localhost:3001`.

Options:

```bash
ssr server --port 4000 --serverEntry ./dist/server/entry-server.js
```

### Via Node.js (locally)

```bash
npx ssr server
```

### In development mode (tsx/ts-node)

```bash
cross-env DEV_ROOT=./playgrounds/vue DEV_ENTRY_SERVER=./src/entry-server.ts tsx src/server.ts
```

### In production

```bash
npm run build
npm start
```

## 🔧 Configuration

All parameters can be set via **CLI**, **.env** or directly via `loadConfig`.

| Param                   | Default                       | Description                                                                |
| ----------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| `MODE`                  | `production`                  | Development or production or test                                          |
| `CLI_MODE`              | `false`                       | To complete SSR correctly in CLI                                           |
| `CLIENT_PATH`           | `dist/client`                 | Path to client build (static files)                                        |
| `SERVER_ENTRY`          | `dist/server/entry-server.js` | Path to server entry (SSR build)                                           |
| `MANIFEST_PATH`         | `dist/client/manifest.json`   | Path to `manifest.json`                                                    |
| `DEV_ROOT`              | —                             | Project root for dev-mode (where `vite.config.ts` is)                      |
| `DEV_ENTRY_SERVER`      | `./src/entry-server.ts`       | Entry for dev SSR                                                          |
| `PORT`                  | `3001`                        | SSR server port                                                            |
| `CLIENT_ENTRY`          | `/assets/entry-client.js`     | Fallback client entry if no manifest.json                                  |
| `SCRIPT_ATTRS`          | `""`                          | Attributes for all `<script>` tags (`defer`, `async`, `crossorigin`, etc.) |
| `DISABLE_PRELOAD`       | `false`                       | Disable all preloads                                                       |
| `DISABLE_JS_PRELOAD`    | `false`                       | Disable only JS preload                                                    |
| `DISABLE_CSS_PRELOAD`   | `false`                       | Disable only CSS preload                                                   |
| `DISABLE_FONT_PRELOAD`  | `false`                       | Disable only font preload                                                  |
| `DISABLE_IMAGE_PRELOAD` | `false`                       | Disable only image preload                                                 |

## 🔗 Using with PHP (via Bridge)

```php
// Local
$bridge = new \Annabel\SSR\Bridge('local');
$html = $bridge->render('<h1>{{ title }}</h1>', ['title' => 'Hello from PHP']);

// Remote
$bridge = new \Annabel\SSR\Bridge('http', 'http://127.0.0.1:3001');
$html = $bridge->render('<h1>{{ title }}</h1>', ['title' => 'Hello from PHP']);
```

## 📑 Example HTML Output

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Vue SSR playground</title>

        <meta name="description" content="Description of the page" />
        <meta property="og:title" content="Vue SSR playground" />

        <link rel="modulepreload" href="/assets/entry-client.abc.js" />
        <link rel="modulepreload" href="/assets/chunk-xyz.def.js" />
        <link rel="preload" as="style" href="/assets/style.css" />
        <link rel="preload" as="font" href="/assets/font.woff2" crossorigin />
        <link rel="preload" as="image" href="/assets/logo.png" />

        <link rel="stylesheet" href="/assets/style.css" />
        <link rel="stylesheet" href="/assets/chunk-xyz.css" />
    </head>
    <body>
        <div id="app"><!-- SSR HTML --></div>
        <script>
            window.__COMPONENT__ = 'App';
            window.__PROPS__ = { message: 'Hello' };
        </script>
        <script type="module" defer src="/assets/entry-client.abc.js"></script>
        <script type="module" defer src="/assets/chunk-xyz.def.js"></script>
    </body>
</html>
```

## 📖 Documentation

-   [Annabel Framework](https://github.com/codemonster-ru/annabel)
-   [Annabel Skeleton](https://github.com/codemonster-ru/annabel-skeleton)

## 👨‍💻 Author

[**Kirill Kolesnikov**](https://github.com/KolesnikovKirill)

## 📜 License

[MIT](https://github.com/codemonster-ru/ssr/blob/main/LICENSE)
