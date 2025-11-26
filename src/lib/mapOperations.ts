// https://stackoverflow.com/a/54431746 & https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
export function union<K, V>(...iterables: Array<Map<K, V>>): Map<K, V> {
    const map = new Map<K, V>();
    iterables.forEach((iterable) => {
        iterable.forEach((value, key) => map.set(key, value));
    });
    return map;
}
