const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const { value } = require("canvas-sketch-util/random");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const { data } = require("./brisdata-daily");
console.log("d", data);

let future = Object.entries(data)
  .filter(([key, value]) => !!value.rcp45)
  .map(([key, value]) => [...value.rcp85]);

// future = future;
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
    const countX = future[0].length;
    const countY = future.length;  

  const createGrid = () => {
    const points = [];
  
    for (x = 0; x < countX; x++) {
      for (y = 0; y < countY; y++) {
        const u = countX <= 1 ? 0.5 : x / (countX - 1);
        const v = countY <= 1 ? 0.5 : y / (countY - 1);
        
        const maxHue = 65;
        const minHue = 40;

        const colNorm = (maxHue - minHue) * ((normalised[y][x] - 0)/1) + 20
        const color = `hsla(${colNorm}, 100%, 50%, 0.8)`; 

        points.push({
          color: color,
          position: [u, v],
        //   radius,          
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

    points.forEach(({ position: [u, v], color }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.beginPath();      
      context.rect(x, y, -0.5 + width / countX, -3 + height / future.length);
        // context.arc(x, y,5+width / countX, 0, 2*Math.PI )
      context.fillStyle = color;    
      context.fill();
      // context.stroke();
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
