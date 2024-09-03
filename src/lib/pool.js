export default function pool({
  create,
  maxSize = 10,
}) {
  return {
    objects: [create({x:-100, y:-100})],
    maxSize,
    size: 0,
    _c: create,
    get(properties = {}) {
      // the pool is out of objects if the first object is in use and
      // it can't grow
      if (this.size == this.objects.length) {
        if (this.size == this.maxSize) {
          return;
        }
  
        // double the size of the array by adding twice as many new
        // objects to the end
        for (
          let i = 0;
          i < this.size && this.objects.length < this.maxSize;
          i++
        ) {
          this.objects.push(this._c());
        }
      }
  
      // save off first object in pool to reassign to last object after
      // unshift
      let obj = this.objects[this.size];
      this.size++;
      obj.init(properties);
      return obj;
    },  
    update() {
      let obj;
      let doSort = false;
      for (let i = this.size; i--; ) {
        obj = this.objects[i];
  
        obj.update();
  
        if (!obj.isAlive()) {
          doSort = true;
          this.size--;
        }
      }
      // sort all dead elements to the end of the pool
      if (doSort) {
        this.objects.sort((a, b) => b.isAlive() - a.isAlive());
      }
    },
    render() {
      for (let i = this.size; i--; ) {
        this.objects[i].render();
      }  
    },
    getAliveObjects() {
      return this.objects.slice(0, this.size);
    }
  }
}