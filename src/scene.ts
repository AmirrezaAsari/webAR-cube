import {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  XRFrame,
} from "three";
import { createPlaneMarker } from './objects/PlaneMaker';
import { handleXRHitTest } from './utils/hittest';

export function createScene(renderer: WebGLRenderer) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.02,
    20,
  );
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const planeMarker = createPlaneMarker();
  scene.add(planeMarker);

  const renderLoop = (timestamp: number, frame?: XRFrame) => {   
    if (renderer.xr.isPresenting) {

      if (frame) {
        handleXRHitTest(renderer, frame, (hitPoseTransformed: Float32Array) => {
          if (hitPoseTransformed) {
            planeMarker.visible = true;
            planeMarker.matrix.fromArray(hitPoseTransformed);
          }
        }, () => {
          planeMarker.visible = false;
        })
      }
      renderer.render(scene, camera);
    }
  }
  
  renderer.setAnimationLoop(renderLoop);
};
