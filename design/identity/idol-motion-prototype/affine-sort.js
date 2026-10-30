// Visus 2.5.0's inverse-direction shortcut assumes a rigid/uniform transform.
// With shear or nonuniform scale, depth uses A^T * cameraDirection instead.
import * as THREE from 'three';

export function installAffineSort(mesh) {
  const inverse=new THREE.Matrix4(), transpose=new THREE.Matrix3();
  const previousMatrix=new THREE.Matrix4();
  const position=new THREE.Vector3(), direction=new THREE.Vector3();
  const previousPosition=new THREE.Vector3(Infinity,Infinity,Infinity);
  const previousDirection=new THREE.Vector3();
  mesh.sort=camera=>{
    if(!mesh.options.autoSort)return;
    inverse.copy(mesh.matrixWorld).invert();
    camera.getWorldPosition(position).applyMatrix4(inverse);
    camera.getWorldDirection(direction);
    transpose.setFromMatrix4(mesh.matrixWorld).transpose();
    direction.applyMatrix3(transpose).normalize();
    if(!previousMatrix.equals(mesh.matrixWorld)||previousPosition.distanceToSquared(position)>1e-6||previousDirection.dot(direction)<.999) {
      previousMatrix.copy(mesh.matrixWorld);
      previousPosition.copy(position);
      previousDirection.copy(direction);
      mesh.sorter.setCamera(position,direction);
    }
  };
}
