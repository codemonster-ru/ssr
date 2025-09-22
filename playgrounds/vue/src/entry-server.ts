import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from './App.vue';

export async function render(_componentName: string, props: any) {
    const app = createSSRApp(App, props);
    const appHtml = await renderToString(app);
    const head = App.head || {};

    return {
        appHtml,
        head: head,
    };
}
