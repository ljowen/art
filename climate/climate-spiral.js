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

future = future.slice(0, 50);
console.log("future", future);

const settings = {
    pixelsPerInch: 300,
  dimensions: 'A3',
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
).flat();

const sketch = () => {    

  return ({ context, width, height }) => {
  
    a = 8;
    b = 0.75;
    var centerx = context.canvas.width / 2;
    var centery = context.canvas.height / 2

    context.fillStyle = "white"; //random.pick(palette);
    context.fillRect(0, 0, width, height);

    // context.clearRect(0, 0, width, 300);

    context.moveTo(centerx, centery);
    context.strokeStyle = "#000";
    
    for (i = 0; i < normalised.length; i++) {
        angle = 0.1 * i;
        x = centerx + (a + b * angle) * Math.cos(angle) //+ random.noise1D(normalised[i], 0.9, 25);
        y = centery + (a + b * angle) * Math.sin(angle) //+ random.noise1D(normalised[i], 0.9, 25);

        const maxHue = 60;     
        const minHue = 0;   
        context.fillStyle = `hsla(${minHue + (maxHue - normalised[i]*maxHue)}, 90%, 50%, ${normalised[i]})`;
        
        context.beginPath();
        console.log(normalised[i]);        
        radiusBase = 23;
        scale =  0.05 * Math.log((i*i)/200000+1)

        maxRadius = 32;
        minRadius = 2;

        const radius = Math.max(Math.min(radiusBase * scale * (normalised[i] * 2), maxRadius ), minRadius);

         
        context.arc(x, y, radius , 0, 2*Math.PI)
        context.fill()
    }
    
    ;
  };
};

canvasSketch(sketch, settings);
