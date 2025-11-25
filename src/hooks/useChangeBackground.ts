import { setCssProperties } from 'cpts-javascript-utilities';
import { useCallback, useEffect, useRef, useState } from 'react';
import { wrapNumber } from '../lib/modulo';

/* from https://gradient.page/ui-gradients */
const backgroundGradients: { name: string; from: string; to: string; via?: string }[] = [
    { name: 'velvet sun', to: '#e1eec3', from: '#f05053' },
    { name: 'horizon', to: '#003973', from: '#E5E5BE' },
    { name: 'bora bora', to: '#2BC0E4', from: '#EAECC6' },
    { name: 'sweet morning', to: '#FF5F6D', from: '#FFC371' },
    { name: 'sun on the horizon', to: '#fceabb', from: '#f8b500' },
    { name: "ed's sunset gradient", to: '#ff7e5f', from: '#feb47b' },
    { name: 'maldives', to: '#B2FEFA', from: '#0ED2F7' },
    { name: 'cool sky', to: '#2980B9', via: '#6DD5FA', from: '#FFFFFF' },
    { name: 'true sunset', to: '#fa709a', from: '#fee140' },
    { name: 'noon to dusk', to: '#ff6e7f', from: '#bfe9ff' },
    { name: 'sky', to: '#076585', from: '#FFFFFF' },
    { name: 'ibiza sunset', to: '#ee0979', from: '#ff6a00' },
    // { name: 'the sky and the sea', to: '#F7941E', from: '#004E8F' },
    // { name: 'between the clouds', to: '#73C8A9', from: '#373B44' },
    // { name: 'sleepness night', to: '#5271C4', via: '#B19FFF', from: '#ECA1FE' },
    // { name: 'supreme sky', to: '#D4FFEC', via: '#57F2CC', from: '#4596FB' },
    // { name: 'evening night', to: '#005AA7', from: '#FFFDE4' },
    // { name: 'evening sunshine', to: '#b92b27', from: '#1565C0' },
    // { name: 'sunset', to: '#0B486B', from: '#F56217' },
];

const useChangeBackground = () => {
    const htmlElement_Ref = useRef<HTMLHtmlElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!htmlElement_Ref.current) {
            htmlElement_Ref.current = document.querySelector('html');
            if (htmlElement_Ref.current) {
                setGradientVariables(htmlElement_Ref.current, currentIndex);
            }
        }
    });

    const next_Cb = useCallback(() => {
        if (htmlElement_Ref.current) {
            const nextIndex = wrapNumber(currentIndex + 1, backgroundGradients.length);
            setGradientVariables(htmlElement_Ref.current, nextIndex);
            setCurrentIndex(nextIndex);
        }
    }, [currentIndex, setCurrentIndex]);

    return { nextGradient: next_Cb, name: backgroundGradients[currentIndex].name };
};

export default useChangeBackground;

function setGradientVariables(element: HTMLElement, gradientIndex: number) {
    const properties = backgroundGradients[gradientIndex].via
        ? {
              '--html-element-gradient-from': backgroundGradients[gradientIndex].from,
              '--html-element-gradient-to': backgroundGradients[gradientIndex].to,
              '--html-element-gradient-via': backgroundGradients[gradientIndex].via,

              '--tw-gradient-stops':
                  'var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--html-element-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)',
              // NOTE ^^^ This is the only way to truly have a gradient's middle value be used conditionally in tailwind. If via- is assigned in html as tailwind class, it will always default to 'white' when set to undefined (since it's necessarily defined as '#fff' in @property declaration). Not too happy with this, but here we are.
          }
        : {
              '--html-element-gradient-from': backgroundGradients[gradientIndex].from,
              '--html-element-gradient-to': backgroundGradients[gradientIndex].to,
              '--html-element-gradient-via': '',

              // NOTE (see above note)
              '--tw-gradient-stops':
                  'var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))',
          };

    // @ts-expect-error 'function paramater type needs to be a little less strict'
    setCssProperties(element, properties);
}
