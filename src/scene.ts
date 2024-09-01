import {
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  XRFrame,
} from "three";

export function createScene(renderer: WebGLRenderer) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.02,
    20,
  )

  const geometry = new BoxBufferGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  cube.position.z = -4;

  scene.add(cube);

  const renderLoop = (timestamp: number, frame?: XRFrame) => {
    // Rotate cube
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;

    if (renderer.xr.isPresenting) {
      renderer.render(scene, camera);
    }
  }
  
  renderer.setAnimationLoop(renderLoop);
};
