import path from 'path';
import { SsrConfig } from '../src/config';

export const unitConfig: SsrConfig = {
    CLIENT_PATH: 'dist/client',
    SERVER_ENTRY: 'dist/server/entry-server.js',
    MANIFEST_PATH: 'dist/client/manifest.json',
    DEV_ROOT: path.resolve(__dirname, 'fixtures'),
    DEV_ENTRY_SERVER: 'entry-server.test.ts',
    PORT: 3001,
    CLIENT_ENTRY: '/assets/entry-client.js',
    SCRIPT_ATTRS: '',
    DISABLE_PRELOAD: false,
    DISABLE_JS_PRELOAD: false,
    DISABLE_CSS_PRELOAD: false,
    DISABLE_FONT_PRELOAD: false,
    DISABLE_IMAGE_PRELOAD: false,
};
