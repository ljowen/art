// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const glsl = require('glslify');

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { MeshBasicMaterial } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#FFF", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -8);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const baseGeom = new THREE.IcosahedronGeometry(1,1);
  const points = baseGeom.attributes.position;
  console.log(baseGeom);

  const circleGeom = new THREE.CircleGeometry(1,32);

  for(i = 0; i < points.count; i++ ) {
    const pos = baseGeom.attributes.position;    
    const vec = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    
    const mesh = new THREE.Mesh(circleGeom, new MeshBasicMaterial({
      color: 'yellow',
      side: THREE.DoubleSide
      // wireframe: true,
    }));
    
    mesh.position.copy(vec);
    mesh.scale.setScalar(0.2 * Math.random());
    mesh.lookAt(new THREE.Vector3());
    scene.add(mesh);
  }

  const fragmentShader =  glsl(/* glsl */`
    #pragma glslify: noise = require(glsl-noise/simplex/3d);
    varying vec2 vUv;  
    uniform vec3 color;
    uniform float time;

    void main() {
      gl_FragColor = vec4(vec3(color), 1.0);
    }
  `);

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    uniform float time;
    void main() {
      vUv = uv;
      vec3 transformed = position.xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
  `;

  // Setup a material
  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    uniforms: {
      time: { value: 0 },
      color: {value: new THREE.Color('tomato')}
    },
    fragmentShader,
    vertexShader,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
      material.uniforms.time.value = time;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
