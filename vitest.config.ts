import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        testTimeout: 20000,
        sequence: {
            concurrent: false,
        },
        exclude: ['tests/fixtures/*'],
    },
});
