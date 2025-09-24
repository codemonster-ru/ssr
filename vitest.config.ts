import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@mock-entry': path.resolve(__dirname, 'playgrounds/vue/dist/server/entry-server.js'),
        },
    },
    test: {
        testTimeout: 20000,
        sequence: {
            concurrent: false,
        },
        exclude: ['tests/fixtures/*'],
    },
});
