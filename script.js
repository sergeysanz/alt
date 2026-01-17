import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

/* SETUP */
const canvas = document.getElementById("webgl");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/* LIGHTS */
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

let model;
const modelGroup = new THREE.Group();
scene.add(modelGroup);

/* LOAD GLB */
new GLTFLoader().load(
  "https://sergeysanz.github.io/alt/spice.glb",
  (gltf) => {
    model = gltf.scene;

    /* SCALE */
    model.scale.setScalar(0.04);

    /* 🔥 CORRECCIÓN REAL DEL CHILE 🔥 */
    model.rotation.x = -Math.PI / 2; // ← ESTO LO ENDEREZA
    model.rotation.y = Math.PI;      // ← ESTO CORRIGE EL FRENTE

    modelGroup.add(model);
    setupScrollAnimation();
  }
);

/* SCROLL ANIMATION (SOBRE EL GROUP) */
function setupScrollAnimation() {
  gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  })
  .to(modelGroup.rotation, {
    y: Math.PI * 2.5,
    x: Math.PI * 0.6
  }, 0)
  .to(modelGroup.position, {
    y: -1.8
  }, 0);
}

/* RENDER LOOP */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

/* RESIZE */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
