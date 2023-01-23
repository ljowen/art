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

    const rootBase = [width / 2, height - height / 3];

    context.fillStyle = "black";
    // context.fillRect(rootBase[0], rootBase[1], 150, 100);

    const drawBranch = (startPos) => {
      const endPos = [
        Math.random() > 0.5 ? startPos[0] / random.range(1, 4) : startPos[0] * random.range(1,4),
        startPos[1] - random.range(-100, 100),
      ];
      context.beginPath();
      context.moveTo(...startPos);
      context.lineTo(...endPos);
      context.lineWidth = 1;
      context.strokeStyle = "black";
      context.stroke();
      return endPos;
    };

    for (let j = 0; j < 100; j++) {
      let pos = drawBranch(rootBase);
      for (let i = 0; i < 10; i++) {
        pos = drawBranch(pos);
      }
    }
  };
};

canvasSketch(sketch, settings);
