/* Based on https://www.freecodecamp.org/news/javascript-debounce-example/ */

function debounce<T extends (...args: unknown[]) => void>(callback: T, timeout = 300) {
    let timer: number;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), timeout);
    };
}

export default debounce;
