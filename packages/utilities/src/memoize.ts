declare class WeakMap {
  public get(key: any): any;
  public set(key: any, value: any): void;
  public has(key: any);
}

const _emptyObject = { empty: true };
const _dictionary = {};

function _normalizeArg(val: any) {
  if (!val) {
    return _emptyObject;
  } else if (typeof val === 'object') {
    return val;
  } else if (!_dictionary[val]) {
    _dictionary[val] = { val };
  }

  return _dictionary[val];
}

interface IMemoizeNode {
  map: WeakMap;
  value?: any;
}

function _createNode(): IMemoizeNode {
  return {
    map: new WeakMap()
  };
}

/**
 * Memoizes a function; when you pass in the same parameters multiple times, it returns a cached result.
 * Be careful when passing in objects, you need to pass in the same INSTANCE for caching to work. Otherwise
 * it will grow the cache unnecessarily.
 *
 * By default, the cache will reset after 100 permutations, to avoid abuse cases where the function is
 * unintendedly called with unique objects. Without a reset, the cache could grow infinitely, so we safeguard
 * by resetting. To override this behavior, pass a value of 0 to the maxCacheSize parameter.
 *
 * @param cb - The function to memoize.
 * @param maxCacheSize - Max results to cache. If the cache exceeds this value, it will reset on the next call.
 * @returns A memoized version of the function.
 */
export function memoize<T extends (...args: any[]) => RET_TYPE, RET_TYPE>(
  cb: T,
  maxCacheSize: number = 100
): T {

  let rootNode: any;
  let cacheSize = 0;

  // tslint:disable-next-line:no-function-expression
  return function memoizedFunction(...args: any[]): RET_TYPE {
    let currentNode: any = rootNode;

    if (rootNode === undefined || (maxCacheSize > 0 && cacheSize > maxCacheSize)) {
      rootNode = _createNode();
      cacheSize = 0;
    }

    currentNode = rootNode;

    // Traverse the tree until we find the match.
    for (let i = 0; i < args.length; i++) {
      let arg = _normalizeArg(args[i]);

      if (!currentNode.map.has(arg)) {
        currentNode.map.set(arg, _createNode());
      }

      currentNode = currentNode.map.get(arg);
    }

    if (!currentNode.hasOwnProperty('value')) {
      currentNode.value = cb(...args);
      cacheSize++;
    }

    return currentNode.value;
  } as any;
}
