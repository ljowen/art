// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const palettes = require("nice-color-palettes");
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { random } = require("canvas-sketch-util");

const PALETTE = random.pick(palettes);

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

  const count = 12;
  const meshes = [];

  for (i = 0; i < count; i++) {
    for (k = 0; k < count; k++) {
      for (j = 0; j < count; j++) {
        if (Math.random() > 1) {
          continue;
        }
        const material = new THREE.MeshStandardMaterial({
          color: random.pick(PALETTE),          
        });
        material.opacity = 1;
        material.transparent = true;


        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(2 * j, 2 * k, 2 * i);
        mesh.scale.set(
          random.range(-1, 1),
          random.range(-1, 1),
          random.range(-1, 1)
        );
        scene.add(mesh);
        meshes.push(mesh);
      }
    }
  }

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 4, 0);
  scene.add(light);

  scene.add(new THREE.AmbientLight('hsl(0, 0%, 20%)'));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 20;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      // controls.update();
      meshes.forEach((m, idx) => {
        m.rotation.z = time * ((50 * Math.PI) / 180) * (idx % 2 === 0 ? -1 : 1);
        m.rotation.y = time * ((50 * Math.PI) / 180) * (idx % 2 === 0 ? -1 : 1);
        m.rotation.x = time * ((50 * Math.PI) / 180) * (idx % 2 === 0 ? -1 : 1);
        if (Math.sin(time / 2) < 0) {
          m.scale.multiplyScalar(0.995);
        } else {
          m.scale.multiplyScalar(1.005);
        }        
        m.material.opacity = 1.1 + Math.sin(1+time* 0.5);
        
        // console.log(Math.sin(time));
      });
      // console.log('time', time);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
