import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '../../src/render';
import path from 'path';

const unitConfig = {
    CLIENT_PATH: 'dist/client',
    SERVER_ENTRY: 'dist/server/entry-server.js',
    MANIFEST_PATH: 'dist/client/manifest.json',
    DEV_ROOT: path.resolve(__dirname, '../fixtures'),
    DEV_ENTRY_SERVER: 'entry-server.fixture.ts',
    PORT: 3001,
    CLIENT_ENTRY: '/assets/entry-client.js',
    SCRIPT_ATTRS: '',
    DISABLE_PRELOAD: false,
    DISABLE_JS_PRELOAD: false,
    DISABLE_CSS_PRELOAD: false,
    DISABLE_FONT_PRELOAD: false,
    DISABLE_IMAGE_PRELOAD: false,
};

describe('render (unit)', () => {
    beforeAll(() => {
        process.env.TEST_MODE = 'true';
    });

    it('renders with mock entry', async () => {
        const html = await render('HelloWorld.vue', { message: 'Hi from test' }, unitConfig);
        expect(html).toContain('Unit render OK');
        expect(html).toContain('Hi from test');
    });
});
