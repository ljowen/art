const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const { value } = require("canvas-sketch-util/random");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const { data } = require("./brisdata");
console.log("d", data);

let future = Object.entries(data)
  .filter(([key, value]) => !!value.rcp45)
  .map(([key, value]) => [...value.rcp85]);

future = future.slice(0, 50);
console.log("future", future);

const settings = {
  dimensions: [2048, 2048],
};
const colorCount = random.rangeFloor(2, 6);

const palette = palettes[0];

let min = (max = future[0][0]);


future.forEach((f) => {
  f.forEach((r) => {
    if (r < min) {
      min = r;
    }
    if (r > max) {
      max = r;
    }
  });
});

const normalised = future.map((months) =>
  months.map((val) => (val - min) / (max - min))
);

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const countX = 12;
    const countY = future.length;
    for (x = 0; x < countX; x++) {
      for (y = 0; y < countY; y++) {
        const u = countX <= 1 ? 0.5 : x / (countX - 1);
        const v = countY <= 1 ? 0.5 : y / (countY - 1);
        
        const radius = 1+10 * normalised[y][x];
        const rotation = 0; //noise * 2*Math.PI;

        points.push({
          color: `rgb(236, 110, 110, ${normalised[y][x]})`,
          position: [u, v],
          radius,
          rotation,
        });
      }
    }
    return points;
  };

  const points = createGrid();
  const margin = 150;

  return ({ context, width, height }) => {
    context.fillStyle = "white"; //random.pick(palette);
    context.fillRect(0, 0, width, height);

    points.forEach(({ position: [u, v], radius, color, rotation, char }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
      // context.stroke();
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
