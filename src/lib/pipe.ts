const pipeA =
    (...functions) =>
    (initialValue) =>
        functions.reduce((acc, fn) => fn(acc), initialValue);

function pipeB(...functions) {
    return function (initialValue) {
        functions.reduce((acc, fn) => fn(acc), initialValue);
    };
}
