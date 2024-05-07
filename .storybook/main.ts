import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
  viteFinal: (config) => {
    return {
      ...config,
      server: {
        ...config.server,
        proxy: {
          // Redirect all requests starting with '/api' to 'http://localhost:3000'
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true, // This can help with cross-origin requests
            secure: false, // Only needed if your backend server uses HTTPS with self-signed certificates
          },
        },
      },
    };
  },
    docs: {
        autodocs: 'tag',
    },
};
export default config;
