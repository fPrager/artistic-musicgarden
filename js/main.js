
import { grow } from './garden/grow.js';
import { getMusicData } from './spotify/get-music-data.js';

const setup = () => {
  p.createCanvas(1280, 1280 * window.innerHeight/window.innerWidth );
};

const draw = () => {
  p.noLoop();

  getMusicData(token)
    .then((data) => {
      if( !data ) return;
      p.stroke(0, 0, 0);
      p.background(0, 0, 0, 0);
      grow({
        musicData: data
      });
    });
};

const sketch = (p) => {
  p.setup = setup;
  p.draw = draw;
}

export const p = new p5(sketch);




