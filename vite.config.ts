import {defineConfig, Plugin} from 'vite';
import react from '@vitejs/plugin-react-swc';
import laravel from 'laravel-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import replace from '@rollup/plugin-replace';

// override laravel plugin base option (from absolute to relative to html base tag)
function basePath(): Plugin {
  return {
    name: 'test',
    enforce: 'post',
    config: () => {
      return {
        base: '',
      };
    },
  };
}

export default defineConfig({
  server: {
    host: '127.0.0.1',
    hmr: {
      host: '127.0.0.1',
    },
  },
  base: 'build/test/hi',
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['puppeteer'],
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    laravel({
      input: ['resources/client/main.tsx'],
      ssr: ['resources/client/server-entry.tsx'],
      refresh: true,
    }),
    basePath(),
    replace({
      preventAssignment: true,
      __SENTRY_DEBUG__: false,
      "import { URL } from 'url'": false,
    }),
  ],
});
