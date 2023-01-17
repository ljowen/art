// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 500);
  camera.position.set(0, 0, -10);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 512, 256);

  const loader =  new THREE.TextureLoader()
  const earthTexture = loader.load('earth.jpg');
  const moonTexture = loader.load('moon.jpg');


  // Setup a material  
  const moonGroup = new THREE.Group();
  const lightGroup = new THREE.Group();

  const earthMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 1,
    metalness: 0,
    map: earthTexture,    
  });

  // THREE.MeshPhysicalMaterial
  const moonMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 1,
    metalness: 0,
    map: moonTexture,
  })

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonGroup.add(moonMesh);

  moonMesh.scale.subScalar(1.15)
  moonMesh.position.x = 2;


  const light = new THREE.SpotLight('white', 1);
  // THREE.SpotLight

  scene.add(new THREE.PointLightHelper(light, 0.1));
  // scene.add(new THREE.GridHelper(5, 50, 'green', 'pink'))
  // scene.add(new THREE.AxesHelper(300));  
  
  light.position.set(0,0,-5);
  lightGroup.add(light);

  scene.add(earthMesh, moonGroup, lightGroup);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      earthMesh.rotation.y = time * 0.15;
      moonGroup.rotation.y = time * 2;
      lightGroup.rotation.y = time * 0.5;
      
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
