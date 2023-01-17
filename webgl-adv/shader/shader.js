// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const glsl = require("glslify");

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
  

  const baseGeom = new THREE.IcosahedronGeometry(1, 1);
  const points = baseGeom.attributes.position;
  const isoPoints = [];

  for (i = 0; i < points.count; i++) {
    const pos = baseGeom.attributes.position;
    const vec = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    isoPoints.push(vec);
  }

  const fragmentShader = glsl(/* glsl */ `    
    #pragma glslify: noise = require(glsl-noise/simplex/3d);
    #pragma glslify: aastep = require(glsl-aastep);
    varying vec2 vUv;  
    varying vec3 vPosition;
    uniform vec3 color;
    uniform float time;
    
    uniform vec3 points[POINT_COUNT];

    uniform mat4 modelMatrix;

    float sphereRim (vec3 spherePosition) {
      vec3 normal = normalize(spherePosition.xyz);
      vec3 worldNormal = normalize(mat3(modelMatrix) * normal.xyz);
      vec3 worldPosition = (modelMatrix * vec4(spherePosition, 1.0)).xyz;
      vec3 V = normalize(cameraPosition - worldPosition);
      float rim = 1.0 - max(dot(V, worldNormal), 0.0);
      return pow(smoothstep(0.0, 1.0, rim), 0.5);
    }

    void main() {
      float dist = 1000.0;

      for (int i = 0; i < POINT_COUNT; i++) {
        vec3 p = points[i];
        float d = distance(vPosition, p) + 0.1 * noise(p);
        dist = min(d, dist);
      }
      
      float mask = 1.0 - aastep(0.15, dist);
      float rim = sphereRim(vPosition);
      vec3 fragColor = mix(color, vec3(1.0), mask);
      fragColor += 0.5 * rim;
      gl_FragColor = vec4(vec3(fragColor), 1.0);
    }
  `);

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    void main() {
      vUv = uv;
      vec3 transformed = position.xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      vPosition = position;
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
  `;

  // Setup a material
  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    defines: {
      POINT_COUNT: isoPoints.length,
    },
    uniforms: {
      points: { value: isoPoints },
      time: { value: 0 },
      color: { value: new THREE.Color("tomato") },
    },
    extensions: {
      derivatives: true,
    },
    fragmentShader,
    vertexShader,
  });

  // Setup a mesh with geometry + material
  
  const meshes = [];
  for(i = 0; i < 50; i++) {
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(10 * Math.random())
    .translateY(10 * Math.random())
    .translateZ(10 * Math.random());    

    // const scale = 0.9;// Math.random();
    // mesh.geometry.scale(scale, scale, scale);
    meshes.push(mesh);
    scene.add(mesh);
  }
  

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
      meshes.forEach((m, i) => {
        m.rotation.z = 0.01 * i * time;
      });
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
