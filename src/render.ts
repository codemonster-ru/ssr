import { SsrConfig } from './config.js';
import { loadEntry, RenderFnWithVite } from './entry-loader.js';
import { renderPage } from './renderPage.js';

let renderFn: RenderFnWithVite | null = null;

export async function render(component: string, props: Record<string, any>, cfg: SsrConfig) {
    if (!renderFn) {
        renderFn = await loadEntry(cfg);
    }

    const result = await renderFn!(component, props);

    let appHtml = '';
    let head: any = {};

    if (typeof result === 'string') {
        appHtml = result;
    } else if (result && typeof result === 'object' && 'appHtml' in result) {
        appHtml = result.appHtml;

        head = result.head || {};
    }

    return renderPage(appHtml, component, props, head, cfg);
}
