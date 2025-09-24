import path from 'path';
import { createRequire } from 'module';
import { loadConfig, SsrConfig } from './config.js';
import { pathToFileURL } from 'url';

export type RenderFn = (component: string, props: Record<string, any>) => Promise<any> | any;
export type RenderFnWithVite = RenderFn & { vite?: any };

export const loadEntry = async (cfg: SsrConfig = loadConfig()): Promise<RenderFnWithVite> => {
    if (cfg.MODE === 'development') {
        return await loadEntryDev(cfg);
    }

    return await loadEntryProd(cfg);
};

const require = createRequire(import.meta.url);

const loadEntryDev = async (cfg: SsrConfig): Promise<RenderFnWithVite> => {
    const root = cfg.DEV_ROOT ?? process.cwd();
    const vitePath = require.resolve('vite', { paths: [root] });
    const viteUrl = pathToFileURL(vitePath).href;
    const viteModule = await import(viteUrl);
    const { createServer } = viteModule as typeof import('vite');
    const vite = await createServer({
        root: root,
        appType: 'custom',
        server: {
            middlewareMode: true,
            hmr: process.env.TEST_MODE === 'true' ? false : true,
        },
    });

    let entryPath = normalizeForVite(cfg.DEV_ENTRY_SERVER, root);
    const entry = await vite.ssrLoadModule(entryPath);
    const fn = normalizeEntry(entry, cfg.DEV_ENTRY_SERVER) as RenderFnWithVite;

    if (process.env.TEST_MODE === 'true' || cfg.CLI_MODE) {
        await vite.close();
    } else {
        process.on('SIGINT', async () => {
            await vite.close();

            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            await vite.close();

            process.exit(0);
        });

        fn.vite = vite;
    }

    return fn;
};

const loadEntryProd = async (cfg: SsrConfig): Promise<RenderFnWithVite> => {
    const fullPath = path.resolve(cfg.SERVER_ENTRY);
    const entry = await import(pathToFileURL(fullPath).href);

    return normalizeEntry(entry, fullPath) as RenderFnWithVite;
};

const normalizeEntry = (entry: any, source: string) => {
    if (typeof entry.render === 'function') {
        return entry.render;
    }

    if (typeof entry.default === 'function') {
        return entry.default;
    }

    throw new Error(`❌ Entry file ${source} must export a "render" function (found: ${Object.keys(entry)})`);
};

const normalizeForVite = (entryPath: string, root: string) => {
    if (entryPath.startsWith('/')) {
        return entryPath.replace(/\\/g, '/');
    }

    if (path.isAbsolute(entryPath)) {
        const relative = path.relative(root, entryPath).replace(/\\/g, '/');

        return '/' + relative;
    }

    return '/' + entryPath.replace(/\\/g, '/');
};
