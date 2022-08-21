import esbuild from 'rollup-plugin-esbuild';

export default {
    input: 'src/index.ts',
    output: {
        file: '../../server/index.js',
        format: 'esm',
    },
    plugins: [esbuild()],
};
