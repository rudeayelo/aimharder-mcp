// Complete animated recesses, projected onto a fitted curved face, not flat cards.
import * as THREE from 'three';
import { SURFACE } from './face-surface.js';
const N=128;
const centers=[.107,-.108];
function contour(theta,hx,hy,radius) {
  const r=Math.min(radius,hx,hy),c=Math.cos(theta),s=Math.sin(theta);
  return [(hx-r)*Math.sign(c)+r*c,(hy-r)*Math.sign(s)+r*s];
}
export function facePoint(y,z,depth=0) {
  const [a,b,c,d,e,f]=SURFACE.coefficients;
  const x=a+b*y+c*z+d*y*y+e*y*z+f*z*z+.0015;
  const normal=new THREE.Vector3(1,-(b+2*d*y+e*z),-(c+e*y+2*f*z)).normalize();
  return [x-depth*normal.x,y-depth*normal.y,z-depth*normal.z];
}
function faceColor(y,z) {
  return SURFACE.colorCoefficients.map(([a,b,c])=>Math.max(.018,Math.min(.4,a+b*y+c*z)));
}
export function createEyes(parent,bounds) {
  const height=bounds.max.y-bounds.min.y;
  const layers=12, count=1+layers*N;
  const indices=[];
  for(let j=0;j<N;j++)indices.push(0,1+(j+1)%N,1+j);
  for(let ring=1;ring<layers;ring++)for(let j=0;j<N;j++) {
    const a=1+(ring-1)*N+j,b=1+ring*N+j;
    const an=1+(ring-1)*N+(j+1)%N,bn=1+ring*N+(j+1)%N;
    indices.push(a,bn,b,a,an,bn);
  }
  const material=new THREE.MeshBasicMaterial({vertexColors:true});
  const eyes=centers.map(center=>{
    const geometry=new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(count*3),3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(count*3),3).setUsage(THREE.DynamicDrawUsage));
    const mesh=new THREE.Mesh(geometry,material);
    mesh.frustumCulled=false;
    parent.add(mesh);
    return {center,geometry,tones:new Float32Array(count),rgb:new Float32Array(count*3)};
  });
  const key=new THREE.Vector3(1,1.3,.7).normalize();
  const normal=new THREE.Vector3(),color=new THREE.Color();
  function place(eye,index,y,z,depth,tone) {
    const [x,yy,zz]=facePoint(y,z,depth);
    eye.geometry.attributes.position.setXYZ(index,(x-bounds.center.x)/height,(bounds.max.y-yy)/height,(bounds.center.z-zz)/height);
    eye.tones[index]=tone;
    eye.rgb.set(faceColor(y,z),index*3);
  }
  return {
    apply(pose) {
      eyes.forEach((eye,i)=>{
        const open=pose.open[i],hx=.029*pose.width,hy=Math.max(.0018,.065*open);
        const depth=Math.max(.003,.027*Math.sqrt(open));
        const cy=.103-(pose.gazeY??0),cz=eye.center-pose.gaze;
        const verticalBevel=Math.max(.06,open);
        place(eye,0,cy,cz,depth,2);
        for(let ring=0;ring<layers;ring++)for(let j=0;j<N;j++) {
          const theta=2*Math.PI*(j+.5)/N;
          let u,v,d,tone;
          if(ring<4) {
            const fraction=(ring+1)/4;
            [u,v]=contour(theta,hx*fraction,hy*fraction,.029*fraction);
            d=depth;tone=2;
          } else if(ring<8) {
            const margins=[.002,.004,.008,.011], depths=[.95,.48,.10,0],tones=[.26,.48,.78,1];
            const k=ring-4;
            [u,v]=contour(theta,hx+margins[k],hy+margins[k]*verticalBevel,.029+margins[k]);
            d=depth*depths[k];tone=tones[k];
          } else {
            const t=(ring-7)/4;
            const inner=contour(theta,hx+.011,hy+.011*verticalBevel,.040);
            const outer=contour(theta,.078,.142,.065);
            u=(1-t)*(cz+inner[0])+t*(eye.center+outer[0])-cz;
            // Keep the outer seam fixed while the complete recess travels in Y/Z.
            v=(1-t)*inner[1]+t*(.103+outer[1]-cy);
            d=0;tone=1;
          }
          place(eye,1+ring*N+j,cy+v,cz+u,d,tone);
        }
        eye.geometry.attributes.position.needsUpdate=true;
        eye.geometry.computeVertexNormals();
        for(let j=0;j<count;j++) {
          normal.fromBufferAttribute(eye.geometry.attributes.normal,j);
          const light=.65+.35*Math.max(0,normal.dot(key));
          const tone=eye.tones[j];
          if(tone>1.5)color.setRGB(.99*light,.61*light,.20*light);
          else {
            const shade=tone===1?1:tone*(.65+.35*Math.max(0,normal.dot(key)));
            color.setRGB(eye.rgb[j*3]*shade,eye.rgb[j*3+1]*shade,eye.rgb[j*3+2]*shade);
          }
          color.convertSRGBToLinear();
          eye.geometry.attributes.color.setXYZ(j,color.r,color.g,color.b);
        }
        eye.geometry.attributes.color.needsUpdate=true;
      });
    },
    vertices:count*2
  };
}
