import { useEffect } from 'react';

export default function useWindowEvent<K extends keyof WindowEventMap>(
    event: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    passive = false,
) {
    useEffect(() => {
        window.addEventListener(event, listener, { passive });
        return () => window.removeEventListener(event, listener);
    });
}
