// Two tiny beveled meshes, authored in the source face coordinates.
import * as THREE from 'three';
export function createEyes(parent, bounds) {
  const h=bounds.max.y-bounds.min.y;
  const shape=new THREE.Shape();
  const r=.029, half=.065, straight=half-r;
  shape.moveTo(-r,-straight);
  shape.lineTo(-r,straight);
  shape.absarc(0,straight,r,Math.PI,0,true);
  shape.lineTo(r,-straight);
  shape.absarc(0,-straight,r,0,-Math.PI,true);
  const geometry=new THREE.ExtrudeGeometry(shape,{
    depth:.007,bevelEnabled:true,bevelThickness:.0015,
    bevelSize:.0015,bevelSegments:2,steps:1,curveSegments:10
  });
  const positions=geometry.getAttribute('position');
  const normals=geometry.getAttribute('normal');
  const colors=new Float32Array(positions.count*3);
  const light=new THREE.Vector3(-.35,.55,1).normalize();
  const n=new THREE.Vector3();
  for(let i=0;i<positions.count;i++) {
    n.fromBufferAttribute(normals,i);
    const shade=.58+.42*Math.max(0,n.dot(light))+.045*positions.getY(i)/half;
    colors.set([shade,shade,shade],i*3);
  }
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const material=new THREE.MeshBasicMaterial({color:'#FF9F32',vertexColors:true});
  const eyes=[];
  for(const z of [.107,-.108]) {
    const base=new THREE.Group();
    base.position.set((.395-bounds.center.x)/h,(bounds.max.y-.103)/h,(bounds.center.z-z)/h);
    base.rotation.y=Math.PI/2;
    base.scale.setScalar(1/h);
    const eye=new THREE.Mesh(geometry,material);
    base.add(eye);
    parent.add(base);
    eyes.push({base,eye,z:base.position.z});
  }
  return {
    apply(pose) {
      for(let i=0;i<eyes.length;i++) {
        const {base,eye,z}=eyes[i];
        base.position.z=z+pose.gaze/h;
        eye.scale.set(pose.width,pose.open[i],1);
      }
    },
    vertices:positions.count*2
  };
}
