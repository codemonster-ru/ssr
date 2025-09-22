import path from 'path';
import fs from 'fs';
import { SsrConfig } from './config.js';

interface Manifest {
    file: string;
    css?: string[];
    isEntry?: boolean;
    imports?: string[];
    assets?: string[];
}

function buildScriptTag(file: string, attrs: string) {
    return `<script type="module" ${attrs} src="/${file}"></script>`;
}

function getAsAttribute(file: string): string | null {
    if (file.endsWith('.css')) return 'style';
    if (file.endsWith('.woff') || file.endsWith('.woff2')) return 'font';
    if (file.endsWith('.ttf') || file.endsWith('.otf')) return 'font';
    if (file.match(/\.(png|jpe?g|gif|webp|avif|svg)$/)) return 'image';
    if (file.endsWith('.js')) return 'script';
    return null;
}

export function renderPage(
    appHtml: string,
    component: string,
    props: Record<string, any>,
    head: any = {},
    cfg: SsrConfig,
) {
    const title = head.title || component;
    const metaTags = (head.meta || [])
        .map(
            (m: Record<string, string>) =>
                `<meta ${Object.entries(m)
                    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
                    .join(' ')}>`,
        )
        .join('\n');
    const scriptAttrs = cfg.SCRIPT_ATTRS || '';
    let scriptTags = buildScriptTag(cfg.CLIENT_ENTRY || 'assets/entry-client.js', scriptAttrs);
    let cssLinks = '';
    let preloadLinks = '';

    if (cfg.DEV_ROOT) {
        scriptTags = `<script type="module" ${scriptAttrs} src="/src/entry-client.ts"></script>`;
    } else {
        try {
            const manifestPath = path.resolve(cfg.MANIFEST_PATH);
            const manifest: Record<string, Manifest> = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            const entries: Manifest[] = Object.values(manifest).filter(e => e.isEntry);

            if (entries.length > 0) {
                const scripts = new Set<string>();
                const styles = new Set<string>();
                const preloads = new Set<string>();

                const processFile = (file: string) => {
                    const asAttr = getAsAttribute(file);

                    if (asAttr === 'style') {
                        styles.add(`<link rel="stylesheet" href="/${file}">`);
                        if (!cfg.DISABLE_PRELOAD && !cfg.DISABLE_CSS_PRELOAD) {
                            preloads.add(`<link rel="preload" as="style" href="/${file}">`);
                        }
                    } else if (asAttr === 'font') {
                        if (!cfg.DISABLE_PRELOAD && !cfg.DISABLE_FONT_PRELOAD) {
                            preloads.add(`<link rel="preload" as="font" href="/${file}" crossorigin>`);
                        }
                    } else if (asAttr === 'image') {
                        if (!cfg.DISABLE_PRELOAD && !cfg.DISABLE_IMAGE_PRELOAD) {
                            preloads.add(`<link rel="preload" as="image" href="/${file}">`);
                        }
                    } else if (asAttr === 'script') {
                        if (!cfg.DISABLE_PRELOAD && !cfg.DISABLE_JS_PRELOAD) {
                            preloads.add(`<link rel="modulepreload" href="/${file}">`);
                        }
                    }
                };

                const processEntry = (entry: Manifest) => {
                    scripts.add(buildScriptTag(entry.file, scriptAttrs));
                    if (!cfg.DISABLE_PRELOAD && !cfg.DISABLE_JS_PRELOAD) {
                        preloads.add(`<link rel="modulepreload" href="/${entry.file}">`);
                    }

                    entry.css?.forEach(processFile);
                    entry.assets?.forEach(processFile);

                    if (entry.imports) {
                        for (const imp of entry.imports) {
                            const imported = manifest[imp];
                            if (imported) {
                                scripts.add(buildScriptTag(imported.file, scriptAttrs));
                                if (!cfg.DISABLE_PRELOAD && !cfg.DISABLE_JS_PRELOAD) {
                                    preloads.add(`<link rel="modulepreload" href="/${imported.file}">`);
                                }
                                imported.css?.forEach(processFile);
                                imported.assets?.forEach(processFile);
                            }
                        }
                    }
                };

                for (const entry of entries) {
                    processEntry(entry);
                }

                scriptTags = [...scripts].join('\n');
                cssLinks = [...styles].join('\n');
                preloadLinks = [...preloads].join('\n');
            } else {
                console.warn('⚠️ manifest.json found, but no isEntry → use fallback');
            }
        } catch {
            console.warn('⚠️ manifest.json is missing → use fallback');
        }
    }

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>${title}</title>
    ${metaTags}
    ${preloadLinks}
    ${cssLinks}
  </head>
  <body>
    <div id="app">${appHtml}</div>
    <script>
      window.__COMPONENT__=${JSON.stringify(component)};
      window.__PROPS__=${JSON.stringify(props)};
    </script>
    ${scriptTags}
  </body>
</html>`;
}
