/// <reference types="vite/client" />
/// <reference types="@altv/types-webview" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
