import { useEffect } from 'react';

export default function useAltEvent(eventName: string, listener: (...args: any[]) => void) {
    useEffect(() => {
        alt?.on(eventName, listener);
        return () => alt?.off(eventName, listener);
    });
}
