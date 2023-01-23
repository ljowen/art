const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

// random.setSeed(5);
const colorCount = random.rangeFloor(2, 6);

const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 40;
    for (x = 0; x < count; x++) {
      for (y = 0; y < count; y++) {        
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const noise = Math.abs(random.noise2D(u, v, 1.2));
        const radius = 0.125 +noise * 0.05;
        const rotation = noise * 2*Math.PI;
        
        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius,
          rotation,
          char: random.pick(["=","-","•"]),
        });
      }
    }
    return points;
  };

  const points = createGrid().filter(() => random.gaussian() > 0.6);
  const margin = 150;

  return ({ context, width, height }) => {
    context.fillStyle = "white"; //random.pick(palette);
    context.fillRect(0, 0, width, height);

    points.forEach(({ position: [u, v], radius, color, rotation, char }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // 
      // context.arc(x, y, radius * width, 0, Math.PI * 2 , false);
      // context.fillStyle = color;
      // context.lineWidth = 20;
      // context.fill();
      context.save();
      context.beginPath();
      context.fillStyle = color;
      context.font = `${radius * width}px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(char, 0, 0);
      context.closePath();
      context.restore();
      
    });
  };
};

canvasSketch(sketch, settings);
