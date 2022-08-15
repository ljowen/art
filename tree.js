const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const palette = random.shuffle(random.pick(palettes));

const sketch = () => {
  
  return ({ context, width, height }) => {
    context.fillStyle = "white"; //random.pick(palette);
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    context.lineTo(points[1][0], points[1][1]);      
    context.lineTo(points[3][0], points[3][1]);
    context.lineTo(points[2][0], points[2][1]);        
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 10;
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();


  };
};

canvasSketch(sketch, settings);
