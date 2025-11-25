import { useEffect, useRef } from 'react';

const useOutsideClick = <T extends HTMLElement>(callback: (event?: MouseEvent) => void) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event);
            }
        };

        document.addEventListener('click', handleClick, { capture: true });

        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
        };
    }, [ref, callback]);

    return ref;
};

export default useOutsideClick;
