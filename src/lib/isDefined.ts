/**
 * Remove falsy elements from array (typed alternative to Boolean() in Array.filter(Boolean))
 *
 * @template T
 * @param {(T | null | undefined)} value
 * @returns {value is NonNullable<T>}
 */
function isDefined<T>(value: T | null | undefined): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export default isDefined;
