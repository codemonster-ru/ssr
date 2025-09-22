import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        include: ['vue'],
    },
    build: {
        outDir: 'dist/client',
        manifest: 'manifest.json',
        assetsDir: '',
        emptyOutDir: true,
        rollupOptions: {
            input: 'src/entry-client.ts',
        },
    },
});
