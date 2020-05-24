export const identity = _ => _;
export function isUndef(val) {
  return val === undefined || val === null;
}

export function isDef(val) {
  return val !== undefined && val !== null;
}

export function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}
export function isObject(value) {
  return value !== null && typeof value === 'object';
}
const _toString = Object.prototype.toString;

export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

export function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}

export function toString(val) {
  return val === null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  }
}

const camelizeRE = /-(\w)/g;
export const camelize = cached(str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

export const capitalize = cached(str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
})

const hyphenateRE = /\B([A-Z])/g;

export const hyphenate = cached(str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
})

export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}
export function isEmpty(value) {
  for (const key in value) {
    if (hasOwn(value, key)) {
      return false
    }
  }
  return true
}

export function merge(to, from) {
  if (!isPlainObject(to) || !isPlainObject(from)) return from;
  let key, toVal, fromVal;
  const keys = Object.keys(from);
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      merge(toVal, fromVal);
    } else {
      to[key] = fromVal;
    }
  }
  return to;
}

export function normalizeTypeForEffect({ target, effect, prefix = 'SET' }) {
  let sep = '_';
  return [prefix, target, effect].map(x => x.toUpperCase()).join(sep);
}


export function getMaxFactor(u, v) {
  var temp = v;
  while (v != 0) {
    temp = u % v;
    u = v;
    v = temp;
  }
  return u;
}