/**
 * Just a wrapper for 5 % 3 (an example, returns 2) for now
 *
 * @export
 * @param {number} num dividend
 * @param {number} wrapAt divisor
 * @returns {number}
 */
export function wrapNumber(num: number, wrapAt: number) {
    return ((num % wrapAt) + wrapAt) % wrapAt;
}

export function isEven(n: number) {
    return n % 2 === 0;
}

export function isOdd(n: number) {
    return n % 2 !== 0;
}
