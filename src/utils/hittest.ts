import { Mesh, WebGLRenderer, XRFrame, XRHitTestSource } from "three";

let hitTestSource: XRHitTestSource;
let hitTestSourceRequested = false;

export function handleXRHitTest(
    renderer: WebGLRenderer,
    frame: XRFrame,
    onHitTestResultReady: (hitPoseMatrix: Float32Array) => void,
    onHitTestResultEmpty: () => void,
) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
  
    let xrHitPoseMatrix: Float32Array | null | undefined;
  
    if (session && hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        if (session) {
          session
            .requestHitTestSource({ space: referenceSpace })
            .then((source) => {
              hitTestSource = source;
            });
        }
      });
  
      hitTestSourceRequested = true;
    }
  
    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
  
      if (hitTestResults.length) {
        const hit = hitTestResults[0];
  
        if (hit && hit !== null && referenceSpace) {
          const xrHitPose = hit.getPose(referenceSpace);
  
          if (xrHitPose) {
            xrHitPoseMatrix = xrHitPose.transform.matrix;
            // // Assuming the surface is a plane, extract scale or size from matrix
            // // For simplicity, we'll assume the scale values are on the matrix's diagonal.
            // const scaleX = Math.sqrt(xrHitPoseMatrix[0] ** 2 + xrHitPoseMatrix[1] ** 2 + xrHitPoseMatrix[2] ** 2);
            // const scaleY = Math.sqrt(xrHitPoseMatrix[4] ** 2 + xrHitPoseMatrix[5] ** 2 + xrHitPoseMatrix[6] ** 2);

            // // Resize the plane (assuming you have a THREE.js PlaneGeometry)
            // plane.geometry.scale(scaleX, scaleY, 1); // Scale in X and Y direction
            onHitTestResultReady(xrHitPoseMatrix);
          }
        }
      } else {
        onHitTestResultEmpty();
      }
    }
  };