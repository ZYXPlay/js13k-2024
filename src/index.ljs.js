import { engineInit, keyWasPressed, Music, setCanvasPixelated, Sound, vec2 } from "littlejsengine";

setCanvasPixelated(true);

const sound_click = new Sound([1,.5]);
  
function init() {
  debug = true;
  canvasFixedSize = vec2(256, 240);
}

function update() {
  if (keyWasPressed('Space')) {
    sound_click.play();
  }
}

function updatePost() {

}

function render() {

}

function renderPost() {

}

engineInit(init, update, updatePost, render, renderPost);