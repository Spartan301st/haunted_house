import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import {
  Mesh,
  Group,
  BoxBufferGeometry,
  MeshStandardMaterial,
  ConeBufferGeometry,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  PointLight,
  Fog,
  Float32BufferAttribute,
  RepeatWrapping,
  PCFSoftShadowMap,
} from "three";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog \\
const fog = new Fog("#BFD1DC", 1.5, 10);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// door textures
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
// wall textures
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);
// floor/plane texture
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);
// configuring repeat of grass texture
// setting x,y repetition for every type of texture for the floor
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);
// Note: by def textures don't repeat so we have to tell them to repeat
grassAmbientOcclusionTexture.wrapS = RepeatWrapping;
grassColorTexture.wrapS = RepeatWrapping;
grassNormalTexture.wrapS = RepeatWrapping;
grassRoughnessTexture.wrapS = RepeatWrapping;

grassAmbientOcclusionTexture.wrapT = RepeatWrapping;
grassColorTexture.wrapT = RepeatWrapping;
grassNormalTexture.wrapT = RepeatWrapping;
grassRoughnessTexture.wrapT = RepeatWrapping;

/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// sphere.position.y = 1
// scene.add(sphere)

// House group \\
const house = new Group();
scene.add(house);
//// walls
const walls = new Mesh(
  new BoxBufferGeometry(4, 2.5, 4),
  // new MeshStandardMaterial({ color: "#BCB3B4" })
  new MeshStandardMaterial({
    map: bricksColorTexture,
    // needs uv atribute set to be visible
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
// setting uv attribute
walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
// to allign cube/walls on the plane
walls.position.y = 2.5 / 2;
// note that we add walls to house group which in turn is added to the scene
house.add(walls);
//// roof
const roof = new Mesh(
  new ConeBufferGeometry(3.5, 2, 4),
  new MeshStandardMaterial({ color: "#584043" })
);
roof.position.y = 2.5 + 2 / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);
//// door
const door = new Mesh(
  new PlaneBufferGeometry(2.2, 2.2, 100, 100),
  // new MeshStandardMaterial({ color: "#EEECEC" })
  new MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    // aoMap won't work without uv2 set
    aoMap: doorAmbientOcclusionTexture,
    // needs many vertices to move them up or down based on color; add them with PlaneBufferGeometry's 3,4 params
    // see added vertices with wireframe: true,
    displacementMap: doorHeightTexture,
    // to reduce displacement effect
    displacementScale: 0.1,
    // for reflecting details
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
// setting uv coordinates
door.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 2 / 2;
door.position.z = 4 / 2;
house.add(door);
//// bushes
// same geometry and material for identical bushes that differ only in size and position
const bushGeometry = new SphereBufferGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: "#3EB489" });

const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1, 0.5 - 0.2, 2.5);
const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.5, 0.25 - 0.1, 2.3);
const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-1, 0.4 - 0.2, 2.5);
const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.2, 0.2, 0.2);
bush4.position.set(-1.5, 0.2 - 0.1, 2.3);

house.add(bush1, bush2, bush3, bush4);

// Graves Group \\
// graves group
const graves = new Group();
scene.add(graves);

// same geometry and material for all tombstones
const graveGeometry = new BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new MeshStandardMaterial({ color: "#77787A" });

// creating 50 random tombstones around the house
for (let i = 0; i < 50; i++) {
  // place tombstones randomly within one full circle around the house
  const angle = Math.random() * Math.PI * 2;
  // we want to position tombsones randomly on x-z axes and not y
  // combination of x-z axes with sin,cos values give us some random position on the circle
  // to increase the max range of 1 multiply sin,cos values by some random radius
  // by adding 3 we ensure that it's further away from house and by *7 we increase the radius
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  // new mesh
  const grave = new Mesh(graveGeometry, graveMaterial);
  // random position
  grave.position.set(x, 0.8 / 2 - 0.05, z);
  // random rotation
  // for slight bent
  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  // for slight turn
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  // enable all the tombstones to cast shadow
  grave.castShadow = true;
  graves.add(grave);
}

// const tombstone1 = new Mesh(graveGeometry, graveMaterial);
// tombstone1.position.set(4, 1 / 2, 2);
// // tombstone1
// graves.add(tombstone1);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  // new THREE.MeshStandardMaterial({ color: "#a9c388" })
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#94B3C4", 0.15);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#94B3C4", 0.15);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
// gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// door light
const doorLight = new PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2, 3);
// to move the light with house
house.add(doorLight);

// ghosts
const ghost1 = new PointLight("#ef476f", 2, 3);
scene.add(ghost1);
const ghost2 = new PointLight("#ffd166", 2, 3);
scene.add(ghost2);
const ghost3 = new PointLight("#06d6a0", 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// change bg color of our renderer
renderer.setClearColor("#BFD1DC");

/**
 * ACTIVATING SHADOWS
 */
// 1st enable shadows in renderer
renderer.shadowMap.enabled = true;
// + changing renderer shadow algorithm
renderer.shadowMap.type = PCFSoftShadowMap;
// next enable all lights to cast shadow
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
// next enable all objects to receive light and cast shadow
roof.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
// finally enable floor to receive the shadows reflected from other objects
floor.receiveShadow = true;

// optimizing shadows
// door light
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;
// ghosts light
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // animating ghosts
  // ghost1
  const ghost1Angle = elapsedTime * 0.48;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);
  // ghost2
  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  // adding more randomeness to up-down movement
  ghost2.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2.5);
  // ghost3
  const ghost3Angle = -elapsedTime * 0.16;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z =
    Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.16));
  ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// to group the items, EX. house related geometries, assign new Group() to a variable and add it to the scene
// if we decide to move all the related stuff we can just move the group

// three.js supports Fog. To activate it first create new Fog(<color>, <near>, <far>) and then assign it to scene.fog
// as we zoom out we see the sharp edge of where our ground ends. To fix that we can change the color of our renderer to fog's color.
// To change the bg color of the renderer use renderer.setClearColor(<color>) method

// we can repeat textures
// first we have to set x,y repetition for every texture
// by default textures don't repeat
// second we have to assing RepeatWrapping to .WrapS & .WrapT of each texture
