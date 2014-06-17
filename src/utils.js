export function $(id) {
  return document.getElementById(id);
}

export function bind(scope, fn) {
  return function() {
    return fn.apply(scope, arguments);
  };
}
