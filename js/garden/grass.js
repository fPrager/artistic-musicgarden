export const grass = () => {
  const rc = rough.canvas(document.getElementById('defaultCanvas0'));

  for( let i = 0; i <= 100; i+=1 ) {
    const grey = 200 + 50 * Math.random();
    for( let n = 0; n <= 4; n+=1 ) {
      push();
      const randomX = random(0, width);
      const randomY = random(0, height);
      rotate(random(-0.5, 0.5));
      rc.line(
        randomX,
        randomY, 
        randomX, 
        randomY + 10, 
        {
          roughness: 2,
          stroke: `rgba(${grey},${grey},${grey},1)`,
        },
      );
      pop();
    }
  };
}