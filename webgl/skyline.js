const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

// const colorCount = random.rangeFloor(1, 6);

const palette = random.shuffle(random.pick(palettes));

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 6;
    for (x = 0; x < count; x++) {
      for (y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = 0.01;

        points.push({
          position: [u, v],
          radius,
          char: "•",
        });
      }
    }
    return points;
  };

  const gridPoints = createGrid();
  const margin = 150;

  return ({ context, width, height }) => {
    context.fillStyle = "white"; //random.pick(palette);
    context.fillRect(0, 0, width, height);

    gridPoints.forEach(({ position: [u, v], radius, char }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.fillStyle = "black";
      context.font = `${radius * width}px "Arial"`;
    //   context.fillText(char, x, y);
    });

    const genTrap = () => {    
        console.log('gT')    ;
      let topP = [random.pick(gridPoints).position, random.pick(gridPoints).position];
      let bottomP = [[topP[0][0], 1], [topP[1][0], 1]];

      topP = topP.map(([u, v]) => [
        lerp(margin, width - margin, u),
        lerp(margin, height - margin, v),
      ]);

      bottomP = bottomP.map(([u, v]) => [
        lerp(margin, width - margin, u),
        lerp(margin, height - margin, v),
      ]);      

      const avgY = (topP[0][1] + topP[1][1]) / 2

      return { points: [...topP, ...bottomP], avgY, color: random.pick(palette)}
    };    

    const drawTrap = ({ points, color }) => {
        console.log(points);
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
    }
    const traps = new Array(6 * 6).fill(null).map(genTrap);

    traps.sort((p0, p1 ) => p0.avgY - p1.avgY);
    traps.forEach(t => drawTrap(t));
  };
};

canvasSketch(sketch, settings);
