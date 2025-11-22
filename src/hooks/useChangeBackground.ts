import { setCssProperties } from 'cpts-javascript-utilities';
import { useCallback, useEffect, useRef, useState } from 'react';
import { wrapNumber } from '../lib/modulo';

/* from https://gradient.page/ui-gradients */
const backgroundGradients = [
    { name: 'horizon', from: '#003973', to: '#E5E5BE' },
    { name: 'bora bora', from: '#2BC0E4', to: '#EAECC6' },
    { name: 'between the clouds', from: '#73C8A9', to: '#373B44' },
    { name: 'sweet morning', from: '#FF5F6D', to: '#FFC371' },
    { name: 'sunset', from: '#0B486B', to: '#F56217' },
    { name: 'sun on the horizon', from: '#fceabb', to: '#f8b500' },
    { name: "ed's sunset gradient", from: '#ff7e5f', to: '#feb47b' },
    { name: 'maldives', from: '#B2FEFA', to: '#0ED2F7' },
    { name: 'velvet sun', from: '#e1eec3', to: '#f05053' },
    { name: 'evening night', from: '#005AA7', to: '#FFFDE4' },
    { name: 'cool sky', from: '#2980B9', via: '#6DD5FA', to: '#FFFFFF' },
    { name: 'evening sunshine', from: '#b92b27', to: '#1565C0' },
    { name: 'true sunset', from: '#fa709a', to: '#fee140' },
    { name: 'sleepness night', from: '#5271C4', via: '#B19FFF', to: '#ECA1FE' },
    { name: 'supreme sky', from: '#D4FFEC', via: '#57F2CC', to: '#4596FB' },
    { name: 'noon to dusk', from: '#ff6e7f', to: '#bfe9ff' },
    { name: 'sky', from: '#076585', to: '#FFFFFF' },
    { name: 'the sky and the sea', from: '#F7941E', to: '#004E8F' },
    { name: 'ibiza sunset', from: '#ee0979', to: '#ff6a00' },
];

const useChangeBackground = () => {
    const htmlElement_Ref = useRef<HTMLHtmlElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!htmlElement_Ref.current) {
            htmlElement_Ref.current = document.querySelector('html');
            if (htmlElement_Ref.current) {
                const properties = backgroundGradients[currentIndex].via
                    ? {
                          '--html-element-gradient-from': backgroundGradients[currentIndex].from,
                          '--html-element-gradient-to': backgroundGradients[currentIndex].to,
                          '--tw-gradient-stops': `var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), ${backgroundGradients[currentIndex].via} var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)`,
                      }
                    : {
                          '--html-element-gradient-from': backgroundGradients[currentIndex].from,
                          '--html-element-gradient-to': backgroundGradients[currentIndex].to,
                      };

                setCssProperties(htmlElement_Ref.current, properties);
            }
        }
    });

    const next_Cb = useCallback(() => {
        if (htmlElement_Ref.current) {
            const nextIndex = wrapNumber(currentIndex + 1, backgroundGradients.length);

            const properties = backgroundGradients[nextIndex].via
                ? {
                      '--html-element-gradient-from': backgroundGradients[nextIndex].from,
                      '--html-element-gradient-to': backgroundGradients[nextIndex].to,
                      '--tw-gradient-stops': `var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), ${backgroundGradients[nextIndex].via} var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)`,
                  }
                : {
                      '--html-element-gradient-from': backgroundGradients[nextIndex].from,
                      '--html-element-gradient-to': backgroundGradients[nextIndex].to,
                  };

            setCssProperties(htmlElement_Ref.current, properties);

            setCurrentIndex(nextIndex);
        }
    }, [currentIndex, setCurrentIndex]);

    return { changeGradient: next_Cb, name: backgroundGradients[currentIndex].name };
};

export default useChangeBackground;
