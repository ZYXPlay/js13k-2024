export let callbacks = {};

export function on(event, callback) {
  callbacks[event] = callbacks[event] || [];
  callbacks[event].push(callback);
}

export function off(event, callback) {
  callbacks[event] = (callbacks[event] || []).filter(
    fn => fn != callback
  );
}

export function clearEvents(exceptions = []) {
  const callbacksTmp = Object.keys(callbacks).reduce((acc, key) => {
    if (exceptions.includes(key)) {
      acc[key] = callbacks[key];
    }
    return acc;
  }, {});
  callbacks = callbacksTmp;
}

export function emit(event, ...args) {
  (callbacks[event] || []).map(fn => fn(...args));
}
