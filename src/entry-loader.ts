import path from 'path';
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

const loadEntryDev = async (cfg: SsrConfig): Promise<RenderFnWithVite> => {
    const { createServer } = await import('vite');
    const vite = await createServer({
        root: cfg.DEV_ROOT,
        appType: 'custom',
        server: {
            middlewareMode: true,
            hmr: process.env.TEST_MODE === 'true' ? false : true,
        },
    });

    const entry = await vite.ssrLoadModule(cfg.DEV_ENTRY_SERVER);
    const fn = normalizeEntry(entry, cfg.DEV_ENTRY_SERVER) as RenderFnWithVite;

    if (process.env.TEST_MODE === 'true') {
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
