import {
  AmbientLight,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  XRFrame,
  WebGLRenderer,
  Mesh,
  CubeRefractionMapping,
  DoubleSide,
  ColorRepresentation,
  Color,
  BufferGeometry,
  BufferAttribute,
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

  const controller = renderer.xr.getController(0);
  scene.add(controller);

  controller.addEventListener("select", onSelect);

  function createWall() {
    // Get the color from the HTML input
    const colorInput = document.getElementById('colorPicker') as HTMLInputElement;
    const selectedColor = colorInput.value; // This gives the color in hex format, like "#00ff00"
    const color = parseInt(selectedColor.replace('#', '0x'));
    const wallGeometry = new PlaneGeometry(0.5, 0.5);
    const wallMaterial = new MeshBasicMaterial({
      color: color, 
      opacity: 0.70, 
      transparent: false, 
      side: DoubleSide
    });
    const wall = new Mesh(wallGeometry, wallMaterial);
    const model = wall.clone();
  
    model.position.setFromMatrixPosition(planeMarker.matrix);
    model.rotation.z = 0; // Rotate the model as needed
    model.visible = true;
  
    scene.add(model);
  }
  
  function onSelect() {
    if (planeMarker.visible) {
      createWall();
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
