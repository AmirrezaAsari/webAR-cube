import { Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, RingGeometry } from "three";

/*
 *  Creates a simple circular marker mesh to overlay on scanned planes.
 */
export function createPlaneMarker() {
  const planeMarkerMaterial = new MeshStandardMaterial({
    color: 0xabc5d1,   // Base color of the wall
    roughness: 0.8,    // Higher value for rough surfaces (like walls)
    metalness: 0,      // Walls are non-metallic
  })
  
  const planeMarkerGeometry = new PlaneGeometry(1,1);
//   const planeMarkerGeometry = new RingGeometry(0.14, 0.15, 16).rotateX(
//     -Math.PI / 2,
//   );

  const planeMarker = new Mesh(planeMarkerGeometry, planeMarkerMaterial);

  planeMarker.matrixAutoUpdate = false;

  return planeMarker;
};