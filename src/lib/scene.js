import { getContext } from "./utils";

export default function scene ({
  objects = [],
  update,
  render,
}) {
  const scene = {
    ...arguments[0],
    init(properties = {}) {
      Object.assign(this, properties);
    },
    update() {
      if (this._uf) this._uf();
      this.objects.forEach(object => object.update());
    },
    render() {
      if (this._rf) this._rf();
      this.objects.forEach(object => object.render());
    },
  };

  scene.init({
    objects,
    context: getContext(),
    _uf: update,
    _rf: render,
  });

  return scene;
}