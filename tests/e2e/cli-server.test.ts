import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execa } from 'execa';
import fetch from 'node-fetch';
import path from 'path';

describe('CLI server', () => {
    const cli = path.resolve(__dirname, '../../src/bin/cli.ts');
    let server: any;
    let port: number;

    beforeAll(async () => {
        port = 3000 + Math.floor(Math.random() * 6000);

        server = execa(
            'node',
            [
                '--loader',
                'ts-node/esm',
                cli,
                'server',
                '--port',
                String(port),
                '--devRoot',
                path.resolve(__dirname, '../../playgrounds/vue'),
                '--devEntryServer',
                'src/entry-server.ts',
            ],
            {
                stdout: 'pipe',
                stderr: 'pipe',
            },
        );

        await new Promise<void>((resolve, reject) => {
            let resolved = false;

            server.stdout?.on('data', (chunk: string) => {
                const msg = chunk.toString();

                // console.log('CLI stdout:', msg);

                if (msg.toLowerCase().includes('ssr server started')) {
                    resolved = true;

                    resolve();
                }
            });

            server.stderr?.on('data', (chunk: string) => {
                // console.error('CLI stderr:', chunk.toString());
            });

            server.once('exit', (code: string) => {
                if (!resolved) {
                    reject(new Error(`CLI exited early with code ${code}`));
                }
            });
            server.once('error', reject);
        });
    }, 20000);

    afterAll(() => {
        if (server) {
            server.kill('SIGTERM');
        }
    });

    it('responds to POST /render', async () => {
        const res = await fetch(`http://localhost:${port}/render`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                component: path.resolve(__dirname, 'fixtures/HelloWorld.vue'),
                props: { message: 'From server test' },
            }),
        });

        const text = await res.text();

        expect(text).toContain('From server test');
    });
});
