import spiral from "./spiral";
import zigzag from "./zigzag";
import zigzagLeft from "./zigzag-left";
import zzLeft from "./zz-left";
import zzRight from "./zz-right";
import sandClock from "./sand-clock";
import w from "./w";
import wReversed from "./w-reversed";

export const paths = {spiral, zigzag, zigzagLeft, zzLeft, zzRight, sandClock, w, wReversed};

export function getPath(path) {
  return paths[path];
}