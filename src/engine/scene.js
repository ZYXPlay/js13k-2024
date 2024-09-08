import { getContext } from "./utils";

export class Scene {
  constructor(props) {
    this.init(props);
  }
  init(props = {}) {
    const filteredProps = Object.keys(props).reduce((acc, key) => {
      if (typeof props[key] !== 'function') {
        acc[key] = props[key];
      }
      return acc;
    }, {});

    const properties = {
      id: 'scene',
      context: getContext(),
      _uf: props.update,
      _rf: props.render,
      children: [],
      paused: false,
      ...filteredProps,
    };

    Object.assign(this, properties);
  }
  add(child) {
    this.children.push(child);
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
  update(dt) {
    if (this.paused) return;
    this.children.forEach(child => {
      if (!child.isAlive) return child.update(dt);
      child.isAlive() && child.update(dt);
    });
    this._uf && this._uf();
  }
  render() {
    this.context.save();
    this._uf && this._uf();
    this.children.forEach(child => {
      if (!child.isAlive) return child.render();
      child.isAlive() && child.render();
    });
    this.context.restore();
  }
}

export function scene(props) {
  return new Scene(props);
}