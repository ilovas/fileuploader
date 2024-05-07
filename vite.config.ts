import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        coverage: {
            provider: 'v8', // or 'v8'
        },
        environment: 'jsdom',
        env: {
            NODE_ENV: 'test',
        },
        include: ['./src/client/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        globals: true,
        setupFiles: './tests/setup.js',
    },
});
