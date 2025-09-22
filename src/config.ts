import path from 'path';
import { Env } from '@codemonster-ru/env';

export interface SsrConfig {
    CLIENT_PATH: string;
    SERVER_ENTRY: string;
    MANIFEST_PATH: string;
    DEV_ROOT?: string;
    DEV_ENTRY_SERVER: string;
    PORT: number;
    CLIENT_ENTRY: string;
    SCRIPT_ATTRS: string;
    DISABLE_PRELOAD: boolean;
    DISABLE_JS_PRELOAD: boolean;
    DISABLE_CSS_PRELOAD: boolean;
    DISABLE_FONT_PRELOAD: boolean;
    DISABLE_IMAGE_PRELOAD: boolean;
}

const env = new Env();

export function loadConfig(argv: any = {}): SsrConfig {
    return {
        CLIENT_PATH: path.resolve(process.cwd(), argv.clientPath || env.get('CLIENT_PATH', 'dist/client')),
        SERVER_ENTRY: path.resolve(
            process.cwd(),
            argv.serverEntry || env.get('SERVER_ENTRY', 'dist/server/entry-server.js'),
        ),
        MANIFEST_PATH: path.resolve(
            process.cwd(),
            argv.manifestPath || env.get('MANIFEST_PATH', 'dist/client/manifest.json'),
        ),
        DEV_ROOT: argv.devRoot || env.get('DEV_ROOT', ''),
        DEV_ENTRY_SERVER: argv.devEntryServer || env.get('DEV_ENTRY_SERVER', './src/entry-server.ts'),
        PORT: Number(argv.port || env.get('PORT', '3001')),
        CLIENT_ENTRY: argv.clientEntry || env.get('CLIENT_ENTRY', '/assets/entry-client.js'),
        SCRIPT_ATTRS: argv.scriptAttrs || env.get('SCRIPT_ATTRS', ''),
        DISABLE_PRELOAD: argv.disablePreload === true || env.get('DISABLE_PRELOAD') === 'true',
        DISABLE_JS_PRELOAD: argv.disableJsPreload === true || env.get('DISABLE_JS_PRELOAD') === 'true',
        DISABLE_CSS_PRELOAD: argv.disableCssPreload === true || env.get('DISABLE_CSS_PRELOAD') === 'true',
        DISABLE_FONT_PRELOAD: argv.disableFontPreload === true || env.get('DISABLE_FONT_PRELOAD') === 'true',
        DISABLE_IMAGE_PRELOAD: argv.disableImagePreload === true || env.get('DISABLE_IMAGE_PRELOAD') === 'true',
    };
}
