import express from 'express';
import { render } from './render.js';
import { loadConfig } from './config.js';

const app = express();
const cfg = loadConfig();

app.use(express.json());
app.use('/', express.static(cfg.CLIENT_PATH));
app.post('/render', async (req, res) => {
    try {
        const { component, props } = req.body;
        const html = await render(component, props || {}, cfg);

        res.send(html);
    } catch (e) {
        console.error(e);

        res.status(500).send('@codemonster-ru/ssr-service render error');
    }
});
app.listen(cfg.PORT, () => {
    console.log(`✅ @codemonster-ru/ssr-service running on http://127.0.0.1:${cfg.PORT}`);
});
