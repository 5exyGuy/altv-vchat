import esbuild from 'rollup-plugin-esbuild';

export default {
    input: 'src/index.ts',
    output: {
        file: '../../client/index.js',
        format: 'esm',
    },
    external: ['alt-client'],
    plugins: [esbuild()],
};
