#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import express from 'express';
import { loadConfig } from '../config.js';
import { render } from '../render.js';
import fs from 'fs';

const addCommonOptions = (y: any) =>
    y
        .option('mode', { type: 'string', choices: ['development', 'production'] })
        .option('cliMode', { type: 'boolean' })
        .option('clientPath', { type: 'string' })
        .option('clientEntry', { type: 'string' })
        .option('serverEntry', { type: 'string' })
        .option('manifestPath', { type: 'string' })
        .option('devRoot', { type: 'string' })
        .option('devEntryServer', { type: 'string' })
        .option('scriptAttrs', { type: 'string' })
        .option('port', { type: 'number' })
        .option('disablePreload', { type: 'boolean' })
        .option('disableJsPreload', { type: 'boolean' })
        .option('disableCssPreload', { type: 'boolean' })
        .option('disableFontPreload', { type: 'boolean' })
        .option('disableImagePreload', { type: 'boolean' });

yargs(hideBin(process.argv))
    .command('server', 'Start the SSR server', addCommonOptions, async argv => {
        const cfg = loadConfig(argv);
        const app = express();

        app.use(express.json());
        app.post('/render', async (req, res) => {
            try {
                const { component, props } = req.body;
                const result = await render(component, props || {}, cfg);

                res.send(result);
            } catch (err: any) {
                console.error('❌ SSR render error:', err);

                res.status(500).send({ error: err.message });
            }
        });
        app.listen(cfg.PORT, () => {
            console.log('✅ SSR server started with config:');
            console.log(cfg);
        });
    })
    .command('render', 'Renders the component via stdin/stdout', addCommonOptions, async argv => {
        try {
            const input = fs.readFileSync(0, 'utf-8');

            if (!input) {
                console.error('⚠️ No input provided');

                process.exit(1);
            }

            const { component, props } = JSON.parse(input);
            const cfg = loadConfig(argv);
            const result = await render(component, props || {}, cfg);

            process.stdout.write(result);
        } catch (err: any) {
            console.error('❌ Render command failed:', err?.message || err);

            process.exit(1);
        }
    })
    .demandCommand(1)
    .help()
    .parse();
