
import { grow } from './garden/grow.js';

const setup = () => {

  p.createCanvas(1280, 1280 * window.innerHeight/window.innerWidth );
};

const draw = () => {
  p.stroke(0, 0, 0);
  p.background(0, 0, 0, 0);
  grow();
  p.noLoop();
};

const sketch = (p) => {
  p.setup = setup;
  p.draw = draw;
}

export const p = new p5(sketch);




