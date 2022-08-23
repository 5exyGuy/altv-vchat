/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@altv/types-webview" />

declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        onmousewheel?: (event: any) => any;
    }
}
