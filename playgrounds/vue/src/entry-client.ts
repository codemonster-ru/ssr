import { createApp } from 'vue';
import App from './App.vue';

const props = (window as any).__PROPS__ || {};

createApp(App, props).mount('#app');
