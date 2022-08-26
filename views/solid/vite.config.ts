import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [solid()],
    base: './',
    build: { outDir: '../../client/view', emptyOutDir: true },
});
