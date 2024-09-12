import {
  AmbientLight,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
  XRFrame,
  Mesh,
} from "three";
import { XREstimatedLight } from 'three/examples/jsm/webxr/XREstimatedLight';
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

  const light = new XREstimatedLight( renderer );

  light.addEventListener( 'estimationstart' , () => {
  
    scene.add( light );
  
    if ( light.environment ) {
  
      scene.environment = light.environment;
  
    }
  
  } );
  
  light.addEventListener( 'estimationend', () => {
  
    scene.remove( light );
  
    scene.environment = null;
  
  } );


  const planeMarker = createPlaneMarker();
  scene.add(planeMarker);
  planeMarker.castShadow = true;    // Enable the wall to cast shadows
  planeMarker.receiveShadow = true; // Enable the wall to receive shadows

  const controller = renderer.xr.getController(0);
  scene.add(controller);

  controller.addEventListener("select", onSelect);

  function onSelect() {
    if (planeMarker.visible) {
        const wallGeometry = new PlaneGeometry(1, 1);
        //check palneBufferGeometry later
        const wallMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
        const wall = new Mesh(wallGeometry, wallMaterial)
        const model = wall.clone();

        model.position.setFromMatrixPosition(planeMarker.matrix);

        // Rotate the model randomly to give a bit of variation to the scene.
        model.rotation.y = Math.random() * (Math.PI * 2);
        model.visible = true;

        scene.add(model);
    }
  }

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
        },)
      }
      renderer.render(scene, camera);
    }
  }
  
  renderer.setAnimationLoop(renderLoop);
};
