import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import path from 'path';

describe('CLI render (dev mode)', () => {
    const cli = path.resolve(__dirname, '../../src/bin/cli.ts');
    const fixture = path.resolve(__dirname, 'fixtures/HelloWorld.vue');

    it('renders HelloWorld.vue via stdin in dev mode', async () => {
        const payload = JSON.stringify({
            component: fixture,
            props: { message: 'CLI Fixture' },
        });
        const { stdout, stderr, exitCode } = await execa(
            'tsx',
            [
                cli,
                'render',
                '--devRoot',
                path.resolve(__dirname, '../../playgrounds/vue'),
                '--devEntryServer',
                './src/entry-server.ts',
                '--serverEntry',
                './src/entry-server.ts',
            ],
            { input: payload, env: { ...process.env, TEST_MODE: 'true' } },
        );

        if (stderr) {
            // console.error('STDERR:', stderr);
        }

        expect(exitCode).toBe(0);
        expect(stdout).toContain('CLI Fixture');
    });
});
