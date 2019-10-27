// Cube Geometry
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x03cea4 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 04 - Sphere Geometry
var geometry = new THREE.SphereGeometry(5, 10, 10);
var material = new THREE.MeshLambertMaterial({ color: 0x03cea4 });
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Animate
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

// Material - Mesh Basic Material
var material = new THREE.MeshBasicMaterial({ color: 0x03cea4 });

// -- On Click
document.body.addEventListener("click", () => {
  this.tl.play();
});

// 06 - GSAP Animation
this.tl = new TimelineMax({ paused: true, yoyo: true, delay: 0.3 });
this.tl.to(this.cube.scale, 1, { x: 2, ease: Expo.easeOut });
this.tl.to(this.cube.scale, 0.5, { x: 0.5, ease: Expo.easeOut });
this.tl.to(this.cube.position, 0.5, { x: 2, ease: Expo.easeOut });
this.tl.to(
  this.cube.position,
  0.5,
  { y: Math.PI * 0.5, ease: Expo.easeOut },
  "-=1.5"
);

// -- onMouseMove Function
function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);
  for (var i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0x247ba0);
  }
}

animate();

// -- OnMouseMove
window.addEventListener("mousemove", onMouseMove);



// ************************

// 01 - Scene
var scene = new THREE.Scene();

// 02 - Camera
var camera = new THREE.PerspectiveCamera(
  75, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near Clipping Plane
  1000 // Far Clipping Plane
);

// -- Camera Position
camera.position.z = 5;

// 03 - Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#e5e5e5");
document.body.appendChild(renderer.domElement);

// -- Resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 04 - Cube Geometry
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0xf7f7f7 });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
cube.material.wireframe = true; 

meshX = -10;
for (var i = 0; i < 15; i++) {
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;
  scene.add(mesh);
  meshX += 1;
}

// 05 - Light
var light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 0);
scene.add(light);

var light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 25);
scene.add(light);

// 07 - Ray Caster
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// -- Animation
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);
  for (var i = 0; i < intersects.length; i++) {
    // 06 - GSAP Animation
    this.tl = new TimelineMax();
    this.tl.to(intersects[i].object.scale, 1, {x: 2, ease: Expo.easeOut})
    this.tl.to(intersects[i].object.scale, .5, {x: .5, ease: Expo.easeOut})
    this.tl.to(intersects[i].object.position, .5, {x: 2, ease: Expo.easeOut})
    this.tl.to(intersects[i].object.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut}, "=-1.5")
  }
}



// -- OnMouseMove
window.addEventListener("mousemove", onMouseMove);


animate();

// ************************