// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const glslify = require("glslify");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const frag = glslify(/* glsl */ `
 uniform float time;
  uniform float aspect;  
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d')
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb')

  void main () {    
    // vec3 colorA = 0.3 + sin(time) + vec3(1.0,0.0,0.0);
    // vec3 colorB = 0.3 + cos(time) + vec3(0.0,1.0,0.0);

    vec2 center = vUv - 0.5;    
    center.x *= aspect;
    float dist = length(center);        

    float alpha = smoothstep(0.3, 0.295, dist);

    // vec3 colorA = vec3(1.0, 1.0, 1.0);
    // vec3 colorB = vec3(.0, 1.0, .0);
    // vec3 color = mix(colorA, colorB, 0.6 + vUv.x + vUv.y * 1.0);
    // gl_FragColor = vec4(color, alpha);

    float n = noise(vec3(vUv * 9.0, 1.25));

    vec3 color = hsl2rgb(
      0.0 + n * 0.12,
      0.8,
      0.5
    );

    gl_FragColor = vec4(color, alpha);
  }
`);

const vert = glslify(/* glsl */ `
    varying vec2 vUv;
    uniform float time;
    #pragma glslify: noise = require('glsl-noise/simplex/4d');
 
    void main () {
      vUv = uv;
      vec3 transformed = position.xyz;
      float offset = 0.0;
      // offset += 0.5 * noise(vec4(position.xyz * 0.5, time * 0.25));
      offset += 1.5 * noise(vec4(position.x,  5.0 * time + position.y,  position.z, 1.0));
      // offset += 0.25 * noise(vec4(position.xyz * 1.5, time * 0.25));
      transformed += normal * offset;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`);

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#FFF", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 4, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.PlaneGeometry(40, 100, 500, 500);

  material = new THREE.ShaderMaterial({
    fragmentShader: frag,
    vertexShader: vert,
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
    },
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = 90;
  scene.add(plane);

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
