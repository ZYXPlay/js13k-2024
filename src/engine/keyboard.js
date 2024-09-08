let keydownCallbacks = {};
let keyupCallbacks = {};
let pressedKeys = {};

let keyMap = {
  // named keys
  'Enter': 'enter',
  'Escape': 'esc',
  'Space': 'space',
  'ArrowLeft': 'arrowleft',
  'ArrowUp': 'arrowup',
  'ArrowRight': 'arrowright',
  'ArrowDown': 'arrowdown'
};

function call(callback = () => {}, evt) {
  if (callback._pd) {
    evt.preventDefault();
  }
  callback(evt);
}

function keydownEventHandler(evt) {
  let key = keyMap[evt.code];
  let callback = keydownCallbacks[key];
  pressedKeys[key] = true;
  call(callback, evt);
}

function keyupEventHandler(evt) {
  let key = keyMap[evt.code];
  let callback = keyupCallbacks[key];
  pressedKeys[key] = false;
  call(callback, evt);
}

export function initKeys() {
  let i;

  // alpha keys
  // @see https://stackoverflow.com/a/43095772/2124254
  for (i = 0; i < 26; i++) {
    // rollupjs considers this a side-effect (for now), so we'll do it
    // in the initKeys function
    keyMap['Key' + String.fromCharCode(i + 65)] = String.fromCharCode(
      i + 97
    );
  }

  // numeric keys
  for (i = 0; i < 10; i++) {
    keyMap['Digit' + i] = keyMap['Numpad' + i] = '' + i;
  }

  window.addEventListener('keydown', keydownEventHandler);
  window.addEventListener('keyup', keyupEventHandler);
  // window.addEventListener('blur', blurEventHandler);
}

export function keyPressed(keys) {
  return !![].concat(keys).some(key => pressedKeys[key]);
}

export function onKey(
  keys,
  callback,
  { handler = 'keydown', preventDefault = true } = {}
) {
  let callbacks =
    handler == 'keydown' ? keydownCallbacks : keyupCallbacks;
  // pd = preventDefault
  callback._pd = preventDefault;
  // smaller than doing `Array.isArray(keys) ? keys : [keys]`
  [].concat(keys).map(key => (callbacks[key] = callback));
}

export function offKey(keys, { handler = 'keydown' } = {}) {
  let callbacks =
    handler == 'keydown' ? keydownCallbacks : keyupCallbacks;
  [].concat(keys).map(key => delete callbacks[key]);
}
