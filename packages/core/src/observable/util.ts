/**
 * Set the enumerable property of a class field
 * Should be used in the constructor after super() has been called
 * @param enabled true|false
 */
export function setEnumerable (target: any, prop: string, enabled: boolean) {
  Object.defineProperty(target, prop, {
    configurable: true,
    writable: true,
    enumerable: enabled,
    value: target[prop],
  });
}

/**
 * Copy all properties that don't exist in target
 * over from source, INCLUDING any properties and methods
 * in the prototype chain.
 *
 * @param target
 * @param source
 */
export function copyAllProperties (target: any, source: any) {
  const keys = Object.getOwnPropertyNames(source);
  for (const key of keys) {
    if (target[key] !== undefined) {
      continue;
    }
    if (typeof source[key] === 'function') {
      Object.defineProperty(target, key, {
        value: source[key].bind(target),
      });
    }
    else {
      Object.defineProperty(target, key, {
        value: source[key],
        writable: true,
      });
    }
  }
  // If there are more prototypes to copy from,
  // keep going up the chain!
  if (Object.getPrototypeOf(Object.getPrototypeOf(source)) !== null) {
    copyAllProperties(target, Object.getPrototypeOf(source));
  }
}
