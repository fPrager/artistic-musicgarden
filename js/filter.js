// orig src: https://www.html5rocks.com/en/tutorials/canvas/imagefilters/#toc-convolution
const tmpCanvas = document.createElement('canvas');
const tmpCtx = tmpCanvas.getContext('2d');

const createImageData = (w,h) => {
  return tmpCtx.createImageData(w,h);
};

const getPixels = () => {
  const c = document.getElementById('defaultCanvas0');
  const ctx = c.getContext('2d');
  return ctx.getImageData(0,0,c.width,c.height);
};

const filterImage = function(filter, var_args){
  const args = [getPixels()];
  console.log(args);
  for( let i = 1; i< arguments.length; i++ ) {
    args.push(arguments[i]);
  };
  const img = filter.apply(null, args);
  
  const c = document.getElementById('defaultCanvas0');
  var ctx = c.getContext('2d');
  ctx.putImageData(img, 0, 0);
};

const grayScale = (pixels, args) => {
  const d = pixels.data;
  for (let i=0; i<d.length; i+=4) {
    const r = d[i];
    const g = d[i+1];
    const b = d[i+2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    const v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v
  }
  return pixels;
};

const convolute = (pixels, weights, opaque) => {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);
  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = createImageData(w, h);
  var dst = output.data;
  // go through the destination image pixels
  var alphaFac = opaque ? 1 : 0;
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy*sw+scx)*4;
            var wt = weights[cy*side+cx];
            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

export const filter = {
  applyGrayScale: () => (filterImage(grayScale)),
  applyConvolute: () => (filterImage(convolute, [  0, -1,  0,
    -1,  5, -1,
     0, -1,  0 ])),
}