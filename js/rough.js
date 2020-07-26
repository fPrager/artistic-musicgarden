let canvas;

const getCanvas = () => (canvas ? canvas : canvas = rough.canvas(document.getElementById('defaultCanvas0')));

export const rc = {
  line: () => (getCanvas().line(arguments)),
};