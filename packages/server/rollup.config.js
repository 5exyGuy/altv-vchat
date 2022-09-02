import esbuild from 'rollup-plugin-esbuild';

export default {
    input: 'src/index.ts',
    output: {
        file: '../../server/index.js',
        format: 'esm',
    },
    external: ['alt-server', 'fs', 'path'],
    plugins: [esbuild()],
};
