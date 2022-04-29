import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import styleImport from 'vite-plugin-style-import';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'development',
  base: './',
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1f8fff',
          'link-color': '#1f8fff',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => `ant-design-vue/es/${name}/style`,
        },
      ],
    }),
    copy({
      targets: [
        { src: ['src/js'], dest: 'dist/' },
      ],
      flatten: false,
      verbose: true,
      hook: 'writeBundle',
    }),
  ],
  build: {
    minify: false,
  },
});
