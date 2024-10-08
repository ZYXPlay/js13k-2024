import { getContext } from './utils.js';

/**
 * Determine which subnodes the object intersects with
 *
 * @param {Object} object - Object to check.
 * @param {{x: Number, y: Number, width: Number, height: Number}} bounds - Bounds of the quadtree.
 *
 * @returns {Number[]} List of all subnodes object intersects.
 */
function getIndices(object, bounds) {
  let indices = [];

  let verticalMidpoint = bounds.x + bounds.width / 2;
  let horizontalMidpoint = bounds.y + bounds.height / 2;

  // save off quadrant checks for reuse
  let intersectsTopQuadrants = object.y < horizontalMidpoint;
  let intersectsBottomQuadrants =
    object.y + object.height >= horizontalMidpoint;

  // object intersects with the left quadrants
  if (object.x < verticalMidpoint) {
    if (intersectsTopQuadrants) {
      // top left
      indices.push(0);
    }

    if (intersectsBottomQuadrants) {
      // bottom left
      indices.push(2);
    }
  }

  // object intersects with the right quadrants
  if (object.x + object.width >= verticalMidpoint) {
    if (intersectsTopQuadrants) {
      // top right
      indices.push(1);
    }

    if (intersectsBottomQuadrants) {
      // bottom right
      indices.push(3);
    }
  }

  return indices;
}

// the quadtree acts like an object pool in that it will create
// subnodes as objects are needed but it won't clean up the subnodes
// when it collapses to avoid garbage collection.
//
// the quadrant indices are numbered as follows (following a z-order
// curve):
//     |
//  0  |  1
// ----+----
//  2  |  3
//     |

/**
 * A 2D [spatial partitioning](https://gameprogrammingpatterns.com/spatial-partition.html) data structure. Use it to quickly group objects by their position for faster access and collision checking.
 *
 * <canvas width="600" height="200" id="quadtree-example"></canvas>
 * <script src="assets/js/quadtree.js"></script>
 * @class Quadtree
 *
 * @param {Object} [properties] - Properties of the quadtree.
 * @param {Number} [properties.maxDepth=3] - Maximum node depth of the quadtree.
 * @param {Number} [properties.maxObjects=25] - Maximum number of objects a node can have before splitting.
 * @param {{x: Number, y: Number, width: Number, height: Number}} [properties.bounds] - The 2D space (x, y, width, height) the quadtree occupies. Defaults to the entire canvas width and height.
 */
export class Quadtree {
  /**
   * @docs docs/api_docs/quadtree.js
   */

  constructor({ maxDepth = 3, maxObjects = 25, bounds } = {}) {
    /**
     * Maximum node depth of the quadtree.
     * @memberof Quadtree
     * @property {Number} maxDepth
     */
    this.maxDepth = maxDepth;

    /**
     * Maximum number of objects a node can have before splitting.
     * @memberof Quadtree
     * @property {Number} maxObjects
     */
    this.maxObjects = maxObjects;

    /**
     * The 2D space (x, y, width, height) the quadtree occupies.
     * @memberof Quadtree
     * @property {{x: Number, y: Number, width: Number, height: Number}} bounds
     */
    let canvas = getContext().canvas; // getCanvas();
    this.bounds = bounds || {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    };

    // since we won't clean up any subnodes, we need to keep track of
    // which nodes are currently the leaf node so we know which nodes
    // to add objects to
    // b = branch, d = depth, o = objects, s = subnodes, p = parent
    this._b = false;
    this._d = 0;
    this._o = [];
    this._s = [];
    this._p = null;
  }

  /**
   * Removes all objects from the quadtree. You should clear the quadtree every frame before adding all objects back into it.
   * @memberof Quadtree
   * @function clear
   */
  clear() {
    this._s.map(subnode => {
      subnode.clear();
    });

    this._b = false;
    this._o.length = 0;
  }

  /**
   * Get an array of all objects that belong to the same node as the passed in object.
   *
   * **Note:** if the passed in object is also part of the quadtree, it will not be returned in the results.
   *
   * ```js
   * import { Sprite, Quadtree } from 'kontra';
   *
   * let quadtree = Quadtree();
   * let player = Sprite({
   *   // ...
   * });
   * let enemy1 = Sprite({
   *   // ...
   * });
   * let enemy2 = Sprite({
   *   // ...
   * });
   *
   * quadtree.add(player, enemy1, enemy2);
   * quadtree.get(player);  //=> [enemy1]
   * ```
   * @memberof Quadtree
   * @function get
   *
   * @param {{x: Number, y: Number, width: Number, height: Number}} object - Object to use for finding other objects. The object must have the properties `x`, `y`, `width`, and `height` so that its position in the quadtree can be calculated.
   *
   * @returns {Object[]} A list of objects in the same node as the object, not including the object itself.
   */
  get(object) {
    // since an object can belong to multiple nodes we should not add
    // it multiple times
    let objects = new Set();

    // traverse the tree until we get to a leaf node
    while (this._s.length && this._b) {
      getIndices(object, this.bounds).map(index => {
        this._s[index].get(object).map(obj => objects.add(obj));
      });

      return Array.from(objects);
    }

    // don't add the object to the return list
    /* eslint-disable-next-line no-restricted-syntax */
    return this._o.filter(obj => obj !== object);
  }

  /**
   * Add objects to the quadtree and group them by their position. Can take a single object, a list of objects, and an array of objects.
   *
   * ```js
   * import { Quadtree, Sprite, Pool, GameLoop } from 'kontra';
   *
   * let quadtree = Quadtree();
   * let bulletPool = Pool({
   *   create: Sprite
   * });
   *
   * let player = Sprite({
   *   // ...
   * });
   * let enemy = Sprite({
   *   // ...
   * });
   *
   * // create some bullets
   * for (let i = 0; i < 100; i++) {
   *   bulletPool.get({
   *     // ...
   *   });
   * }
   *
   * let loop = GameLoop({
   *   update: function() {
   *     quadtree.clear();
   *     quadtree.add(player, enemy, bulletPool.getAliveObjects());
   *   }
   * });
   * ```
   * @memberof Quadtree
   * @function add
   *
   * @param {...({x: Number, y: Number, width: Number, height: Number}|{x: Number, y: Number, width: Number, height: Number}[])[]} objects - Objects to add to the quadtree. Can be a single object, an array of objects, or a comma-separated list of objects.
   */
  add(...objects) {
    objects.flat().map(object => {
      // current node has subnodes, so we need to add this object
      // into a subnode
      if (this._b) {
        this._a(object);
        return;
      }

      // this node is a leaf node so add the object to it
      this._o.push(object);

      // split the node if there are too many objects
      if (
        this._o.length > this.maxObjects &&
        this._d < this.maxDepth
      ) {
        this._sp();

        // move all objects to their corresponding subnodes
        this._o.map(obj => this._a(obj));
        this._o.length = 0;
      }
    });
  }

  /**
   * Add an object to a subnode.
   *
   * @param {Object} object - Object to add into a subnode
   */
  _a(object) {
    // add the object to all subnodes it intersects
    getIndices(object, this.bounds).map(index => {
      this._s[index].add(object);
    });
  }

  /**
   * Split the node into four subnodes.
   */
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var
  _sp(subWidth, subHeight, i) {
    this._b = true;

    // only split if we haven't split before
    if (this._s.length) {
      return;
    }

    subWidth = (this.bounds.width / 2) | 0;
    subHeight = (this.bounds.height / 2) | 0;

    for (i = 0; i < 4; i++) {
      this._s[i] = new Quadtree({
        bounds: {
          x: this.bounds.x + (i % 2 == 1 ? subWidth : 0), // nodes 1 and 3
          y: this.bounds.y + (i >= 2 ? subHeight : 0), // nodes 2 and 3
          width: subWidth,
          height: subHeight
        },
        maxDepth: this.maxDepth,
        maxObjects: this.maxObjects
      });

      // d = depth, p = parent
      this._s[i]._d = this._d + 1;
    }
  }
}

export function quadtree(props) {
  return new Quadtree(props);
}