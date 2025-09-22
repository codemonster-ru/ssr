import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        include: ['vue'],
    },
    build: {
        ssr: 'src/entry-server.ts',
        outDir: 'dist/server',
        emptyOutDir: true,
    },
});
