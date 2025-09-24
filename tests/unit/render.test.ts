import { describe, it, expect, vi } from 'vitest';
import path from 'path';

const mockPath = path.resolve(__dirname, '../../playgrounds/vue/dist/server/entry-server.js');

vi.mock(mockPath, () => {
    return {
        render: async (component: string, props: Record<string, any>) => {
            return `<div>Unit render OK: ${component} - ${props.message}</div>`;
        },
    };
});

import { loadConfig } from '../../src/config';
import { loadEntry } from '../../src/entry-loader';

describe('render (unit)', () => {
    it('renders with mock entry', async () => {
        const unitConfig = loadConfig({
            mode: 'production',
            serverEntry: 'playgrounds/vue/dist/server/entry-server.js',
        });

        const render = await loadEntry(unitConfig);
        const html = await render('HelloWorld.vue', { message: 'Hi from test' });

        expect(html).toContain('Unit render OK');
        expect(html).toContain('Hi from test');
    });
});
