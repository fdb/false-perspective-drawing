let gCamera;
let gScene;
let gRenderer;
let gControls;
let gWalls;
let gRaycaster;
let gBoxGeometry;
let gBoxMaterial;

function random(min, max) {
  return min + Math.random() * (max - min);
}

function map(value, inMin, inMax, outMin, outMax) {
  // Convert a value to 0.0 - 1.0
  value = (value - inMin) / (inMax - inMin);
  // Convert to output range
  value = outMin + value * (outMax - outMin);
  return value;
}

function setup() {
  const cameraDistance = 5;
  gCamera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  gCamera.position.set(cameraDistance, cameraDistance, cameraDistance);
  gCamera.lookAt(0, 0, 0);

  gScene = new THREE.Scene();

  const light1 = new THREE.HemisphereLight(0xffffff, 0x000088, 0.8);
  light1.position.set(-1, 1.5, 1);
  gScene.add(light1);

  const light2 = new THREE.HemisphereLight(0xffffff, 0x000088, 0.2);
  light2.position.set(1, 1.5, 1);
  gScene.add(light2);

  gBoxGeometry = new THREE.BoxGeometry();
  gBoxMaterial = new THREE.MeshPhongMaterial({ flatShading: true });
  // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  // gScene.add(boxMesh);

  const wallMaterial = new THREE.MeshBasicMaterial({ color: "white" });
  const wallGeometry = new THREE.BoxGeometry();

  gWalls = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.scale.set(1000, 10, 1);
    wall.rotation.set(0, random(0, Math.PI * 2), 0);
    wall.position.set(random(-10, 10), 0, random(-10, 10));
    gWalls.add(wall);
  }
  gScene.add(gWalls);

  gRenderer = new THREE.WebGLRenderer({ antialias: true });
  gRenderer.setPixelRatio(window.devicePixelRatio);
  gRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(gRenderer.domElement);

  gControls = new THREE.OrbitControls(gCamera, gRenderer.domElement);
  gControls.mouseButtons = {
    LEFT: null,
    MIDDLE: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE,
  };

  gRaycaster = new THREE.Raycaster();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  gRenderer.render(gScene, gCamera);
}

function onResize() {
  gCamera.aspect = window.innerWidth / window.innerHeight;
  gCamera.updateProjectionMatrix();
  gRenderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(e) {
  if (e.button !== 0) return;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e) {
  // console.log(e.clientX, e.clientY);
  const mouseX = map(e.clientX, 0, window.innerWidth, -1, 1);
  const mouseY = map(e.clientY, 0, window.innerHeight, 1, -1);
  const mouseVector = new THREE.Vector3(mouseX, mouseY, 0.5);

  gRaycaster.setFromCamera(mouseVector, gCamera);
  const intersects = gRaycaster.intersectObjects(gWalls.children);
  console.log(intersects);
  if (intersects.length > 0) {
    const firstIntersection = intersects[0];
    const mesh = new THREE.Mesh(gBoxGeometry, gBoxMaterial);
    mesh.position.copy(firstIntersection.point);
    mesh.scale.multiplyScalar(firstIntersection.distance * 0.05);
    gScene.add(mesh);
  }
}

function onMouseUp() {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
}

setup();
animate();
window.addEventListener("resize", onResize);
window.addEventListener("mousedown", onMouseDown);
