var Yn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Zn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},pc=0,Do=1,mc=2;var Lo=1,gc=2,xn=3,In=0,Ie=1,Je=2,ln=0,ci=1,Uo=2,No=3,Fo=4,Wr=5,an=100,_c=101,xc=102,yc=103,vc=104,Mc=200,Fs=201,Sc=202,bc=203,Sr=204,hi=205,wc=206,Ec=207,Tc=208,Ac=209,Cc=210,Rc=211,Pc=212,Ic=213,Dc=214,Xr=0,qr=1,Yr=2,ui=3,Zr=4,$r=5,Jr=6,Kr=7,Oo=0,Lc=1,Uc=2,Dn=0,Nc=1,Fc=2,Oc=3,Bc=4,zc=5,kc=6,Vc=7;var Bo=300,_i=301,xi=302,jr=303,Qr=304,Os=306,br=1e3,Hn=1001,wr=1002,le=1003,Hc=1004;var Bs=1005;var on=1006,ta=1007;var $n=1008;var Ke=1009,zo=1010,ko=1011,Ki=1012,ea=1013,cn=1014,yn=1015,ji=1016,na=1017,ia=1018,Qi=1020,Vo=35902,Ho=1021,Go=1022,Ne=1023,Wo=1024,Xo=1025,Hi=1026,ts=1027,qo=1028,es=1029,Yo=1030,sa=1031;var ns=1033,zs=33776,ks=33777,Vs=33778,Hs=33779,ra=35840,aa=35841,oa=35842,la=35843,ca=36196,ha=37492,ua=37496,da=37808,fa=37809,pa=37810,ma=37811,ga=37812,_a=37813,xa=37814,ya=37815,va=37816,Ma=37817,Sa=37818,ba=37819,wa=37820,Ea=37821,Gs=36492,Ta=36494,Aa=36495,Zo=36283,Ca=36284,Ra=36285,Pa=36286;var xs=2300,Er=2301,Mr=2302,Eo=2400,To=2401,Ao=2402;var Gc=3200,Wc=3201;var Xc=0,qc=1,Ln="",Re="srgb",di="srgb-linear",ys="linear",ee="srgb";var li=7680;var Co=519,Yc=512,Zc=513,$c=514,$o=515,Jc=516,Kc=517,jc=518,Qc=519,Ro=35044,Ia=35048;var Ws="300 es",dn=2e3,vs=2001;var Ze=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Se=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Jl=1234567,gs=Math.PI/180,Gi=180/Math.PI;function is(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Se[i&255]+Se[i>>8&255]+Se[i>>16&255]+Se[i>>24&255]+"-"+Se[t&255]+Se[t>>8&255]+"-"+Se[t>>16&15|64]+Se[t>>24&255]+"-"+Se[e&63|128]+Se[e>>8&255]+"-"+Se[e>>16&255]+Se[e>>24&255]+Se[n&255]+Se[n>>8&255]+Se[n>>16&255]+Se[n>>24&255]).toLowerCase()}function Gt(i,t,e){return Math.max(t,Math.min(e,i))}function Jo(i,t){return(i%t+t)%t}function vu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Mu(i,t,e){return i!==t?(e-i)/(t-i):0}function _s(i,t,e){return(1-e)*i+e*t}function Su(i,t,e,n){return _s(i,t,1-Math.exp(-e*n))}function bu(i,t=1){return t-Math.abs(Jo(i,t*2)-t)}function wu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Eu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Tu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Au(i,t){return i+Math.random()*(t-i)}function Cu(i){return i*(.5-Math.random())}function Ru(i){i!==void 0&&(Jl=i);let t=Jl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pu(i){return i*gs}function Iu(i){return i*Gi}function Du(i){return(i&i-1)===0&&i!==0}function Lu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Uu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Nu(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ki(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ce(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ko={DEG2RAD:gs,RAD2DEG:Gi,generateUUID:is,clamp:Gt,euclideanModulo:Jo,mapLinear:vu,inverseLerp:Mu,lerp:_s,damp:Su,pingpong:bu,smoothstep:wu,smootherstep:Eu,randInt:Tu,randFloat:Au,randFloatSpread:Cu,seededRandom:Ru,degToRad:Pu,radToDeg:Iu,isPowerOfTwo:Du,ceilPowerOfTwo:Lu,floorPowerOfTwo:Uu,setQuaternionFromProperEuler:Nu,normalize:Ce,denormalize:ki},Nt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ut=class i{constructor(t,e,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],y=s[0],m=s[3],f=s[6],A=s[1],b=s[4],v=s[7],P=s[2],R=s[5],E=s[8];return r[0]=a*y+o*A+l*P,r[3]=a*m+o*b+l*R,r[6]=a*f+o*v+l*E,r[1]=c*y+h*A+u*P,r[4]=c*m+h*b+u*R,r[7]=c*f+h*v+u*E,r[2]=d*y+p*A+g*P,r[5]=d*m+p*b+g*R,r[8]=d*f+p*v+g*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,p=c*r-a*l,g=e*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return t[0]=u*y,t[1]=(s*c-h*n)*y,t[2]=(o*n-s*a)*y,t[3]=d*y,t[4]=(h*e-s*l)*y,t[5]=(s*r-o*e)*y,t[6]=p*y,t[7]=(n*l-c*e)*y,t[8]=(a*e-n*r)*y,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(so.makeScale(t,e)),this}rotate(t){return this.premultiply(so.makeRotation(-t)),this}translate(t,e){return this.premultiply(so.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},so=new Ut;function jo(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Wi(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function th(){let i=Wi("canvas");return i.style.display="block",i}var Kl={};function Xs(i){i in Kl||(Kl[i]=!0,console.warn(i))}function eh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function nh(i){let t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function ih(i){let t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var jl=new Ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ql=new Ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Fu(){let i={enabled:!0,workingColorSpace:di,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ee&&(s.r=Pn(s.r),s.g=Pn(s.g),s.b=Pn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ee&&(s.r=Vi(s.r),s.g=Vi(s.g),s.b=Vi(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ln?ys:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[di]:{primaries:t,whitePoint:n,transfer:ys,toXYZ:jl,fromXYZ:Ql,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:n,transfer:ee,toXYZ:jl,fromXYZ:Ql,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),i}var $t=Fu();function Pn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ci,Tr=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ci===void 0&&(Ci=Wi("canvas")),Ci.width=t.width,Ci.height=t.height;let s=Ci.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ci}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Wi("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Pn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Pn(e[n]/255)*255):e[n]=Pn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ou=0,Xi=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=is(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ro(s[a].image)):r.push(ro(s[a]))}else r=ro(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ro(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Tr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Bu=0,Pe=class i extends Ze{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Hn,s=Hn,r=on,a=$n,o=Ne,l=Ke,c=i.DEFAULT_ANISOTROPY,h=Ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=is(),this.name="",this.source=new Xi(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Nt(0,0),this.repeat=new Nt(1,1),this.center=new Nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case br:t.x=t.x-Math.floor(t.x);break;case Hn:t.x=t.x<0?0:1;break;case wr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case br:t.y=t.y-Math.floor(t.y);break;case Hn:t.y=t.y<0?0:1;break;case wr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Pe.DEFAULT_IMAGE=null;Pe.DEFAULT_MAPPING=Bo;Pe.DEFAULT_ANISOTROPY=1;var de=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],y=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let b=(c+1)/2,v=(p+1)/2,P=(f+1)/2,R=(h+d)/4,E=(u+y)/4,T=(g+m)/4;return b>v&&b>P?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=R/n,r=E/n):v>P?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=R/s,r=T/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=E/r,s=T/r),this.set(n,s,r,e),this}let A=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(u-y)/A,this.z=(d-h)/A,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this.w=Gt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this.w=Gt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ar=class extends Ze{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);let s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Pe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Xi(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},mn=class extends Ar{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ms=class extends Pe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=le,this.minFilter=le,this.wrapR=Hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Cr=class extends Pe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=le,this.minFilter=le,this.wrapR=Hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ye=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],p=r[a+1],g=r[a+2],y=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=y;return}if(u!==y||l!==d||c!==p||h!==g){let m=1-o,f=l*d+c*p+h*g+u*y,A=f>=0?1:-1,b=1-f*f;if(b>Number.EPSILON){let P=Math.sqrt(b),R=Math.atan2(P,f*A);m=Math.sin(m*R)/P,o=Math.sin(o*R)/P}let v=o*A;if(l=l*m+d*v,c=c*m+p*v,h=h*m+g*v,u=u*m+y*v,m===1-o){let P=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=P,c*=P,h*=P,u*=P}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*p-c*d,t[e+1]=l*g+h*d+c*u-o*p,t[e+2]=c*g+h*p+o*d-l*u,t[e+3]=h*g-o*u-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>u){let p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-n-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Gt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(tc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(tc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ao.copy(this).projectOnVector(t),this.sub(ao)}reflect(t){return this.sub(ao.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ao=new D,tc=new ye,gn=class{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,nn):nn.fromBufferAttribute(r,a),nn.applyMatrix4(t.matrixWorld),this.expandByPoint(nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ir.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ir.copy(n.boundingBox)),ir.applyMatrix4(t.matrixWorld),this.union(ir)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,nn),nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ds),sr.subVectors(this.max,ds),Ri.subVectors(t.a,ds),Pi.subVectors(t.b,ds),Ii.subVectors(t.c,ds),Nn.subVectors(Pi,Ri),Fn.subVectors(Ii,Pi),si.subVectors(Ri,Ii);let e=[0,-Nn.z,Nn.y,0,-Fn.z,Fn.y,0,-si.z,si.y,Nn.z,0,-Nn.x,Fn.z,0,-Fn.x,si.z,0,-si.x,-Nn.y,Nn.x,0,-Fn.y,Fn.x,0,-si.y,si.x,0];return!oo(e,Ri,Pi,Ii,sr)||(e=[1,0,0,0,1,0,0,0,1],!oo(e,Ri,Pi,Ii,sr))?!1:(rr.crossVectors(Nn,Fn),e=[rr.x,rr.y,rr.z],oo(e,Ri,Pi,Ii,sr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},wn=[new D,new D,new D,new D,new D,new D,new D,new D],nn=new D,ir=new gn,Ri=new D,Pi=new D,Ii=new D,Nn=new D,Fn=new D,si=new D,ds=new D,sr=new D,rr=new D,ri=new D;function oo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ri.fromArray(i,r);let o=s.x*Math.abs(ri.x)+s.y*Math.abs(ri.y)+s.z*Math.abs(ri.z),l=t.dot(ri),c=e.dot(ri),h=n.dot(ri);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var zu=new gn,fs=new D,lo=new D,Gn=class{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):zu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;fs.subVectors(t,this.center);let e=fs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(fs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(lo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(fs.copy(t.center).add(lo)),this.expandByPoint(fs.copy(t.center).sub(lo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},En=new D,co=new D,ar=new D,On=new D,ho=new D,or=new D,uo=new D,qi=class{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,En)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=En.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(En.copy(this.origin).addScaledVector(this.direction,e),En.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){co.copy(t).add(e).multiplyScalar(.5),ar.copy(e).sub(t).normalize(),On.copy(this.origin).sub(co);let r=t.distanceTo(e)*.5,a=-this.direction.dot(ar),o=On.dot(this.direction),l=-On.dot(ar),c=On.lengthSq(),h=Math.abs(1-a*a),u,d,p,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let y=1/h;u*=y,d*=y,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(co).addScaledVector(ar,d),p}intersectSphere(t,e){En.subVectors(t.center,this.origin);let n=En.dot(this.direction),s=En.dot(En)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,En)!==null}intersectTriangle(t,e,n,s,r){ho.subVectors(e,t),or.subVectors(n,t),uo.crossVectors(ho,or);let a=this.direction.dot(uo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;On.subVectors(this.origin,t);let l=o*this.direction.dot(or.crossVectors(On,or));if(l<0)return null;let c=o*this.direction.dot(ho.cross(On));if(c<0||l+c>a)return null;let h=-o*On.dot(uo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ie=class i{constructor(t,e,n,s,r,a,o,l,c,h,u,d,p,g,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,u,d,p,g,y,m)}set(t,e,n,s,r,a,o,l,c,h,u,d,p,g,y,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=y,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Di.setFromMatrixColumn(t,0).length(),r=1/Di.setFromMatrixColumn(t,1).length(),a=1/Di.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,p=a*u,g=o*h,y=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=d-y*c,e[9]=-o*l,e[2]=y-d*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){let d=l*h,p=l*u,g=c*h,y=c*u;e[0]=d+y*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=y+d*o,e[10]=a*l}else if(t.order==="ZXY"){let d=l*h,p=l*u,g=c*h,y=c*u;e[0]=d-y*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=y-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let d=a*h,p=a*u,g=o*h,y=o*u;e[0]=l*h,e[4]=g*c-p,e[8]=d*c+y,e[1]=l*u,e[5]=y*c+d,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let d=a*l,p=a*c,g=o*l,y=o*c;e[0]=l*h,e[4]=y-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*u+g,e[10]=d-y*u}else if(t.order==="XZY"){let d=a*l,p=a*c,g=o*l,y=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+y,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=y*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ku,t,Vu)}lookAt(t,e,n){let s=this.elements;return Be.subVectors(t,e),Be.lengthSq()===0&&(Be.z=1),Be.normalize(),Bn.crossVectors(n,Be),Bn.lengthSq()===0&&(Math.abs(n.z)===1?Be.x+=1e-4:Be.z+=1e-4,Be.normalize(),Bn.crossVectors(n,Be)),Bn.normalize(),lr.crossVectors(Be,Bn),s[0]=Bn.x,s[4]=lr.x,s[8]=Be.x,s[1]=Bn.y,s[5]=lr.y,s[9]=Be.y,s[2]=Bn.z,s[6]=lr.z,s[10]=Be.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],y=n[6],m=n[10],f=n[14],A=n[3],b=n[7],v=n[11],P=n[15],R=s[0],E=s[4],T=s[8],S=s[12],_=s[1],C=s[5],G=s[9],L=s[13],B=s[2],z=s[6],U=s[10],H=s[14],V=s[3],nt=s[7],$=s[11],it=s[15];return r[0]=a*R+o*_+l*B+c*V,r[4]=a*E+o*C+l*z+c*nt,r[8]=a*T+o*G+l*U+c*$,r[12]=a*S+o*L+l*H+c*it,r[1]=h*R+u*_+d*B+p*V,r[5]=h*E+u*C+d*z+p*nt,r[9]=h*T+u*G+d*U+p*$,r[13]=h*S+u*L+d*H+p*it,r[2]=g*R+y*_+m*B+f*V,r[6]=g*E+y*C+m*z+f*nt,r[10]=g*T+y*G+m*U+f*$,r[14]=g*S+y*L+m*H+f*it,r[3]=A*R+b*_+v*B+P*V,r[7]=A*E+b*C+v*z+P*nt,r[11]=A*T+b*G+v*U+P*$,r[15]=A*S+b*L+v*H+P*it,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],y=t[7],m=t[11],f=t[15];return g*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*p-n*l*p)+y*(+e*l*p-e*c*d+r*a*d-s*a*p+s*c*h-r*l*h)+m*(+e*c*u-e*o*p-r*a*u+n*a*p+r*o*h-n*c*h)+f*(-s*o*h-e*l*u+e*o*d+s*a*u-n*a*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],y=t[13],m=t[14],f=t[15],A=u*m*c-y*d*c+y*l*p-o*m*p-u*l*f+o*d*f,b=g*d*c-h*m*c-g*l*p+a*m*p+h*l*f-a*d*f,v=h*y*c-g*u*c+g*o*p-a*y*p-h*o*f+a*u*f,P=g*u*l-h*y*l-g*o*d+a*y*d+h*o*m-a*u*m,R=e*A+n*b+s*v+r*P;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/R;return t[0]=A*E,t[1]=(y*d*r-u*m*r-y*s*p+n*m*p+u*s*f-n*d*f)*E,t[2]=(o*m*r-y*l*r+y*s*c-n*m*c-o*s*f+n*l*f)*E,t[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*p-n*l*p)*E,t[4]=b*E,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*E,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*f-e*l*f)*E,t[7]=(a*d*r-h*l*r+h*s*c-e*d*c-a*s*p+e*l*p)*E,t[8]=v*E,t[9]=(g*u*r-h*y*r-g*n*p+e*y*p+h*n*f-e*u*f)*E,t[10]=(a*y*r-g*o*r+g*n*c-e*y*c-a*n*f+e*o*f)*E,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*p-e*o*p)*E,t[12]=P*E,t[13]=(h*y*s-g*u*s+g*n*d-e*y*d-h*n*m+e*u*m)*E,t[14]=(g*o*s-a*y*s-g*n*l+e*y*l+a*n*m-e*o*m)*E,t[15]=(a*u*s-h*o*s+h*n*l-e*u*l-a*n*d+e*o*d)*E,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,p=r*h,g=r*u,y=a*h,m=a*u,f=o*u,A=l*c,b=l*h,v=l*u,P=n.x,R=n.y,E=n.z;return s[0]=(1-(y+f))*P,s[1]=(p+v)*P,s[2]=(g-b)*P,s[3]=0,s[4]=(p-v)*R,s[5]=(1-(d+f))*R,s[6]=(m+A)*R,s[7]=0,s[8]=(g+b)*E,s[9]=(m-A)*E,s[10]=(1-(d+y))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Di.set(s[0],s[1],s[2]).length(),a=Di.set(s[4],s[5],s[6]).length(),o=Di.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],sn.copy(this);let c=1/r,h=1/a,u=1/o;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=u,sn.elements[9]*=u,sn.elements[10]*=u,e.setFromRotationMatrix(sn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=dn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),p,g;if(o===dn)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===vs)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=dn){let l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(a-r),d=(e+t)*c,p=(n+s)*h,g,y;if(o===dn)g=(a+r)*u,y=-2*u;else if(o===vs)g=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=y,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Di=new D,sn=new ie,ku=new D(0,0,0),Vu=new D(1,1,1),Bn=new D,lr=new D,Be=new D,ec=new ie,nc=new ye,Le=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Gt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Gt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Gt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ec.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ec,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return nc.setFromEuler(this),this.setFromQuaternion(nc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Le.DEFAULT_ORDER="XYZ";var Ss=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Hu=0,ic=new D,Li=new ye,Tn=new ie,cr=new D,ps=new D,Gu=new D,Wu=new ye,sc=new D(1,0,0),rc=new D(0,1,0),ac=new D(0,0,1),oc={type:"added"},Xu={type:"removed"},Ui={type:"childadded",child:null},fo={type:"childremoved",child:null},$e=class i extends Ze{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=is(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new D,e=new Le,n=new ye,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ie},normalMatrix:{value:new Ut}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ss,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Li.setFromAxisAngle(t,e),this.quaternion.multiply(Li),this}rotateOnWorldAxis(t,e){return Li.setFromAxisAngle(t,e),this.quaternion.premultiply(Li),this}rotateX(t){return this.rotateOnAxis(sc,t)}rotateY(t){return this.rotateOnAxis(rc,t)}rotateZ(t){return this.rotateOnAxis(ac,t)}translateOnAxis(t,e){return ic.copy(t).applyQuaternion(this.quaternion),this.position.add(ic.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(sc,t)}translateY(t){return this.translateOnAxis(rc,t)}translateZ(t){return this.translateOnAxis(ac,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?cr.copy(t):cr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(ps,cr,this.up):Tn.lookAt(cr,ps,this.up),this.quaternion.setFromRotationMatrix(Tn),s&&(Tn.extractRotation(s.matrixWorld),Li.setFromRotationMatrix(Tn),this.quaternion.premultiply(Li.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(oc),Ui.child=t,this.dispatchEvent(Ui),Ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Xu),fo.child=t,this.dispatchEvent(fo),fo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(oc),Ui.child=t,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,t,Gu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,Wu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};$e.DEFAULT_UP=new D(0,1,0);$e.DEFAULT_MATRIX_AUTO_UPDATE=!0;$e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var rn=new D,An=new D,po=new D,Cn=new D,Ni=new D,Fi=new D,lc=new D,mo=new D,go=new D,_o=new D,xo=new de,yo=new de,vo=new de,Vn=class i{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),rn.subVectors(t,e),s.cross(rn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){rn.subVectors(s,e),An.subVectors(n,e),po.subVectors(t,e);let a=rn.dot(rn),o=rn.dot(An),l=rn.dot(po),c=An.dot(An),h=An.dot(po),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Cn.x),l.addScaledVector(a,Cn.y),l.addScaledVector(o,Cn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return xo.setScalar(0),yo.setScalar(0),vo.setScalar(0),xo.fromBufferAttribute(t,e),yo.fromBufferAttribute(t,n),vo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(xo,r.x),a.addScaledVector(yo,r.y),a.addScaledVector(vo,r.z),a}static isFrontFacing(t,e,n,s){return rn.subVectors(n,e),An.subVectors(t,e),rn.cross(An).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),An.subVectors(this.a,this.b),rn.cross(An).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;Ni.subVectors(s,n),Fi.subVectors(r,n),mo.subVectors(t,n);let l=Ni.dot(mo),c=Fi.dot(mo);if(l<=0&&c<=0)return e.copy(n);go.subVectors(t,s);let h=Ni.dot(go),u=Fi.dot(go);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ni,a);_o.subVectors(t,r);let p=Ni.dot(_o),g=Fi.dot(_o);if(g>=0&&p<=g)return e.copy(r);let y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Fi,o);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return lc.subVectors(r,s),o=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(lc,o);let f=1/(m+y+d);return a=y*f,o=d*f,e.copy(n).addScaledVector(Ni,a).addScaledVector(Fi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},sh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zn={h:0,s:0,l:0},hr={h:0,s:0,l:0};function Mo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Wt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Re){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=$t.workingColorSpace){if(t=Jo(t,1),e=Gt(e,0,1),n=Gt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Mo(a,r,t+1/3),this.g=Mo(a,r,t),this.b=Mo(a,r,t-1/3)}return $t.toWorkingColorSpace(this,s),this}setStyle(t,e=Re){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Re){let n=sh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pn(t.r),this.g=Pn(t.g),this.b=Pn(t.b),this}copyLinearToSRGB(t){return this.r=Vi(t.r),this.g=Vi(t.g),this.b=Vi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Re){return $t.fromWorkingColorSpace(be.copy(this),t),Math.round(Gt(be.r*255,0,255))*65536+Math.round(Gt(be.g*255,0,255))*256+Math.round(Gt(be.b*255,0,255))}getHexString(t=Re){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(be.copy(this),e);let n=be.r,s=be.g,r=be.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=Re){$t.fromWorkingColorSpace(be.copy(this),t);let e=be.r,n=be.g,s=be.b;return t!==Re?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(zn),this.setHSL(zn.h+t,zn.s+e,zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(zn),t.getHSL(hr);let n=_s(zn.h,hr.h,e),s=_s(zn.s,hr.s,e),r=_s(zn.l,hr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},be=new Wt;Wt.NAMES=sh;var qu=0,fi=class extends Ze{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=is(),this.name="",this.type="Material",this.blending=ci,this.side=In,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sr,this.blendDst=hi,this.blendEquation=an,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Co,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=li,this.stencilZFail=li,this.stencilZPass=li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ci&&(n.blending=this.blending),this.side!==In&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sr&&(n.blendSrc=this.blendSrc),this.blendDst!==hi&&(n.blendDst=this.blendDst),this.blendEquation!==an&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ui&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Co&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},pi=class extends fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Le,this.combine=Oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var pe=new D,ur=new Nt,Yu=0,oe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ro,this.updateRanges=[],this.gpuType=yn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ur.fromBufferAttribute(this,e),ur.applyMatrix3(t),this.setXY(e,ur.x,ur.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyMatrix3(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyMatrix4(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyNormalMatrix(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.transformDirection(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ki(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ce(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ki(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ki(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ki(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ki(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),n=Ce(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),n=Ce(n,this.array),s=Ce(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),n=Ce(n,this.array),s=Ce(s,this.array),r=Ce(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ro&&(t.usage=this.usage),t}};var bs=class extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ws=class extends oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var pn=class extends oe{constructor(t,e,n){super(new Float32Array(t),e,n)}},Zu=0,qe=new ie,So=new $e,Oi=new D,ze=new gn,ms=new gn,xe=new D,Ue=class i extends Ze{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=is(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jo(t)?ws:bs)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ut().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return qe.makeRotationFromQuaternion(t),this.applyMatrix4(qe),this}rotateX(t){return qe.makeRotationX(t),this.applyMatrix4(qe),this}rotateY(t){return qe.makeRotationY(t),this.applyMatrix4(qe),this}rotateZ(t){return qe.makeRotationZ(t),this.applyMatrix4(qe),this}translate(t,e,n){return qe.makeTranslation(t,e,n),this.applyMatrix4(qe),this}scale(t,e,n){return qe.makeScale(t,e,n),this.applyMatrix4(qe),this}lookAt(t){return So.lookAt(t),So.updateMatrix(),this.applyMatrix4(So.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new pn(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];ze.setFromBufferAttribute(r),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,ze.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,ze.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(ze.min),this.boundingBox.expandByPoint(ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){let n=this.boundingSphere.center;if(ze.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];ms.setFromBufferAttribute(o),this.morphTargetsRelative?(xe.addVectors(ze.min,ms.min),ze.expandByPoint(xe),xe.addVectors(ze.max,ms.max),ze.expandByPoint(xe)):(ze.expandByPoint(ms.min),ze.expandByPoint(ms.max))}ze.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)xe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(xe));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)xe.fromBufferAttribute(o,c),l&&(Oi.fromBufferAttribute(t,c),xe.add(Oi)),s=Math.max(s,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oe(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let T=0;T<n.count;T++)o[T]=new D,l[T]=new D;let c=new D,h=new D,u=new D,d=new Nt,p=new Nt,g=new Nt,y=new D,m=new D;function f(T,S,_){c.fromBufferAttribute(n,T),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,T),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,_),h.sub(c),u.sub(c),p.sub(d),g.sub(d);let C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(C),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(C),o[T].add(y),o[S].add(y),o[_].add(y),l[T].add(m),l[S].add(m),l[_].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let T=0,S=A.length;T<S;++T){let _=A[T],C=_.start,G=_.count;for(let L=C,B=C+G;L<B;L+=3)f(t.getX(L+0),t.getX(L+1),t.getX(L+2))}let b=new D,v=new D,P=new D,R=new D;function E(T){P.fromBufferAttribute(s,T),R.copy(P);let S=o[T];b.copy(S),b.sub(P.multiplyScalar(P.dot(S))).normalize(),v.crossVectors(R,S);let C=v.dot(l[T])<0?-1:1;a.setXYZW(T,b.x,b.y,b.z,C)}for(let T=0,S=A.length;T<S;++T){let _=A[T],C=_.start,G=_.count;for(let L=C,B=C+G;L<B;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,u=new D;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),y=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,y),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),p=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=t(d,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},cc=new ie,ai=new qi,dr=new Gn,hc=new D,fr=new D,pr=new D,mr=new D,bo=new D,gr=new D,uc=new D,_r=new D,Ee=class extends $e{constructor(t=new Ue,e=new pi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){gr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(bo.fromBufferAttribute(u,t),a?gr.addScaledVector(bo,h):gr.addScaledVector(bo.sub(e),h))}e.add(gr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(r),ai.copy(t.ray).recast(t.near),!(dr.containsPoint(ai.origin)===!1&&(ai.intersectSphere(dr,hc)===null||ai.origin.distanceToSquared(hc)>(t.far-t.near)**2))&&(cc.copy(r).invert(),ai.copy(t.ray).applyMatrix4(cc),!(n.boundingBox!==null&&ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ai)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=d.length;g<y;g++){let m=d[g],f=a[m.materialIndex],A=Math.max(m.start,p.start),b=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=A,P=b;v<P;v+=3){let R=o.getX(v),E=o.getX(v+1),T=o.getX(v+2);s=xr(this,f,t,n,c,h,u,R,E,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){let A=o.getX(m),b=o.getX(m+1),v=o.getX(m+2);s=xr(this,a,t,n,c,h,u,A,b,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,y=d.length;g<y;g++){let m=d[g],f=a[m.materialIndex],A=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=A,P=b;v<P;v+=3){let R=v,E=v+1,T=v+2;s=xr(this,f,t,n,c,h,u,R,E,T),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){let A=m,b=m+1,v=m+2;s=xr(this,a,t,n,c,h,u,A,b,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function $u(i,t,e,n,s,r,a,o){let l;if(t.side===Ie?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===In,o),l===null)return null;_r.copy(o),_r.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(_r);return c<e.near||c>e.far?null:{distance:c,point:_r.clone(),object:i}}function xr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,fr),i.getVertexPosition(l,pr),i.getVertexPosition(c,mr);let h=$u(i,t,e,n,fr,pr,mr,uc);if(h){let u=new D;Vn.getBarycoord(uc,fr,pr,mr,u),s&&(h.uv=Vn.getInterpolatedAttribute(s,o,l,c,u,new Nt)),r&&(h.uv1=Vn.getInterpolatedAttribute(r,o,l,c,u,new Nt)),a&&(h.normal=Vn.getInterpolatedAttribute(a,o,l,c,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new D,materialIndex:0};Vn.getNormal(fr,pr,mr,d.normal),h.face=d,h.barycoord=u}return h}var Yi=class i extends Ue{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new pn(c,3)),this.setAttribute("normal",new pn(h,3)),this.setAttribute("uv",new pn(u,2));function g(y,m,f,A,b,v,P,R,E,T,S){let _=v/E,C=P/T,G=v/2,L=P/2,B=R/2,z=E+1,U=T+1,H=0,V=0,nt=new D;for(let $=0;$<U;$++){let it=$*C-L;for(let Q=0;Q<z;Q++){let Mt=Q*_-G;nt[y]=Mt*A,nt[m]=it*b,nt[f]=B,c.push(nt.x,nt.y,nt.z),nt[y]=0,nt[m]=0,nt[f]=R>0?1:-1,h.push(nt.x,nt.y,nt.z),u.push(Q/E),u.push(1-$/T),H+=1}}for(let $=0;$<T;$++)for(let it=0;it<E;it++){let Q=d+it+z*$,Mt=d+it+z*($+1),q=d+(it+1)+z*($+1),Z=d+(it+1)+z*$;l.push(Q,Mt,Z),l.push(Mt,q,Z),V+=6}o.addGroup(p,V,S),p+=V,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function yi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Te(i){let t={};for(let e=0;e<i.length;e++){let n=yi(i[e]);for(let s in n)t[s]=n[s]}return t}function Ju(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Qo(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}var rh={clone:yi,merge:Te},Ku=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ju=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ke=class extends fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ku,this.fragmentShader=ju,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=yi(t.uniforms),this.uniformsGroups=Ju(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Es=class extends $e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},kn=new D,dc=new Nt,fc=new Nt,we=class extends Es{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Gi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gi*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(kn.x,kn.y).multiplyScalar(-t/kn.z),kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(kn.x,kn.y).multiplyScalar(-t/kn.z)}getViewSize(t,e){return this.getViewBounds(t,dc,fc),e.subVectors(fc,dc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(gs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Bi=-90,zi=1,Rr=class extends $e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new we(Bi,zi,t,e);s.layers=this.layers,this.add(s);let r=new we(Bi,zi,t,e);r.layers=this.layers,this.add(r);let a=new we(Bi,zi,t,e);a.layers=this.layers,this.add(a);let o=new we(Bi,zi,t,e);o.layers=this.layers,this.add(o);let l=new we(Bi,zi,t,e);l.layers=this.layers,this.add(l);let c=new we(Bi,zi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===vs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ts=class extends Pe{constructor(t=[],e=_i,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Pr=class extends mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ts(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:on}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Yi(5,5,5),r=new ke({name:"CubemapFromEquirect",uniforms:yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ie,blending:ln});r.uniforms.tEquirect.value=e;let a=new Ee(s,r),o=e.minFilter;return e.minFilter===$n&&(e.minFilter=on),new Rr(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},fn=class extends $e{constructor(){super(),this.isGroup=!0,this.type="Group"}},Qu={type:"move"},Zi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let y of t.hand.values()){let m=e.getJointPose(y,n),f=this._getHandJoint(c,y);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new fn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}};var As=class extends $e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Le,this.environmentIntensity=1,this.environmentRotation=new Le,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var mi=class extends Pe{constructor(t=null,e=1,n=1,s,r,a,o,l,c=le,h=le,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Cs=class extends oe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}};var wo=new D,td=new D,ed=new Ut,Ye=class{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=wo.subVectors(n,e).cross(td.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(wo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||ed.getNormalMatrix(t),s=this.coplanarPoint(wo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},oi=new Gn,yr=new D,Rs=class{constructor(t=new Ye,e=new Ye,n=new Ye,s=new Ye,r=new Ye,a=new Ye){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],y=s[10],m=s[11],f=s[12],A=s[13],b=s[14],v=s[15];if(n[0].setComponents(l-r,d-c,m-p,v-f).normalize(),n[1].setComponents(l+r,d+c,m+p,v+f).normalize(),n[2].setComponents(l+a,d+h,m+g,v+A).normalize(),n[3].setComponents(l-a,d-h,m-g,v-A).normalize(),n[4].setComponents(l-o,d-u,m-y,v-b).normalize(),e===dn)n[5].setComponents(l+o,d+u,m+y,v+b).normalize();else if(e===vs)n[5].setComponents(o,u,y,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){return oi.center.set(0,0,0),oi.radius=.7071067811865476,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(yr.x=s.normal.x>0?t.max.x:t.min.x,yr.y=s.normal.y>0?t.max.y:t.min.y,yr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(yr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ps=class extends Pe{constructor(t,e,n=cn,s,r,a,o=le,l=le,c,h=Hi){if(h!==Hi&&h!==ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Xi(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}};var Is=class i extends Ue{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,p=[],g=[],y=[],m=[];for(let f=0;f<h;f++){let A=f*d-a;for(let b=0;b<c;b++){let v=b*u-r;g.push(v,-A,0),y.push(0,0,1),m.push(b/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let A=0;A<o;A++){let b=A+c*f,v=A+c*(f+1),P=A+1+c*(f+1),R=A+1+c*f;p.push(b,v,R),p.push(v,P,R)}this.setIndex(p),this.setAttribute("position",new pn(g,3)),this.setAttribute("normal",new pn(y,3)),this.setAttribute("uv",new pn(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Ir=class extends fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Dr=class extends fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function vr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function nd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var gi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Lr=class extends gi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Eo,endingEnd:Eo}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case To:r=t,o=2*e-n;break;case Ao:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case To:a=t,l=2*n-e;break;case Ao:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),y=g*g,m=y*g,f=-d*m+2*d*y-d*g,A=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*g+1,b=(-1-p)*m+(1.5+p)*y+.5*g,v=p*m-p*y;for(let P=0;P!==o;++P)r[P]=f*a[h+P]+A*a[c+P]+b*a[l+P]+v*a[u+P];return r}},Ur=class extends gi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},Nr=class extends gi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ve=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=vr(e,this.TimeBufferType),this.values=vr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:vr(t.times,Array),values:vr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Nr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ur(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Lr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case xs:e=this.InterpolantFactoryMethodDiscrete;break;case Er:e=this.InterpolantFactoryMethodLinear;break;case Mr:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return xs;case this.InterpolantFactoryMethodLinear:return Er;case this.InterpolantFactoryMethodSmooth:return Mr}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&nd(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Mr,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let u=o*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let y=e[u+g];if(y!==e[d+g]||y!==e[p+g]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let u=o*n,d=a*n;for(let p=0;p!==n;++p)e[d+p]=e[u+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Ve.prototype.ValueTypeName="";Ve.prototype.TimeBufferType=Float32Array;Ve.prototype.ValueBufferType=Float32Array;Ve.prototype.DefaultInterpolation=Er;var Wn=class extends Ve{constructor(t,e,n){super(t,e,n)}};Wn.prototype.ValueTypeName="bool";Wn.prototype.ValueBufferType=Array;Wn.prototype.DefaultInterpolation=xs;Wn.prototype.InterpolantFactoryMethodLinear=void 0;Wn.prototype.InterpolantFactoryMethodSmooth=void 0;var Fr=class extends Ve{constructor(t,e,n,s){super(t,e,n,s)}};Fr.prototype.ValueTypeName="color";var Or=class extends Ve{constructor(t,e,n,s){super(t,e,n,s)}};Or.prototype.ValueTypeName="number";var Br=class extends gi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)ye.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ds=class extends Ve{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Br(this.times,this.values,this.getValueSize(),t)}};Ds.prototype.ValueTypeName="quaternion";Ds.prototype.InterpolantFactoryMethodSmooth=void 0;var Xn=class extends Ve{constructor(t,e,n){super(t,e,n)}};Xn.prototype.ValueTypeName="string";Xn.prototype.ValueBufferType=Array;Xn.prototype.DefaultInterpolation=xs;Xn.prototype.InterpolantFactoryMethodLinear=void 0;Xn.prototype.InterpolantFactoryMethodSmooth=void 0;var zr=class extends Ve{constructor(t,e,n,s){super(t,e,n,s)}};zr.prototype.ValueTypeName="vector";var Ls={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},kr=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},ah=new kr,_n=class{constructor(t){this.manager=t!==void 0?t:ah,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};_n.DEFAULT_MATERIAL_NAME="__DEFAULT";var Rn={},Po=class extends Error{constructor(t,e){super(t),this.response=e}},qn=class extends _n{constructor(t){super(t),this.mimeType="",this.responseType=""}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Ls.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Rn[t]!==void 0){Rn[t].push({onLoad:e,onProgress:n,onError:s});return}Rn[t]=[],Rn[t].push({onLoad:e,onProgress:n,onError:s});let a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Rn[t],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0,y=0,m=new ReadableStream({start(f){A();function A(){u.read().then(({done:b,value:v})=>{if(b)f.close();else{y+=v.byteLength;let P=new ProgressEvent("progress",{lengthComputable:g,loaded:y,total:p});for(let R=0,E=h.length;R<E;R++){let T=h[R];T.onProgress&&T.onProgress(P)}f.enqueue(v),A()}},b=>{f.error(b)})}}});return new Response(m)}else throw new Po(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,p=new TextDecoder(d);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{Ls.add(t,c);let h=Rn[t];delete Rn[t];for(let u=0,d=h.length;u<d;u++){let p=h[u];p.onLoad&&p.onLoad(c)}}).catch(c=>{let h=Rn[t];if(h===void 0)throw this.manager.itemError(t),c;delete Rn[t];for(let u=0,d=h.length;u<d;u++){let p=h[u];p.onError&&p.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Vr=class extends _n{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,a=Ls.get(t);if(a!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0),a;let o=Wi("img");function l(){h(),Ls.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(u){h(),s&&s(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(t),o.src=t,o}};var $i=class extends _n{constructor(t){super(t)}load(t,e,n,s){let r=new Pe,a=new Vr(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}};var Hr=class extends Es{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var Us=class extends Ue{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Gr=class extends we{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t,this.index=0}};var tl="\\[\\]\\.:\\/",id=new RegExp("["+tl+"]","g"),el="[^"+tl+"]",sd="[^"+tl.replace("\\.","")+"]",rd=/((?:WC+[\/:])*)/.source.replace("WC",el),ad=/(WCOD+)?/.source.replace("WCOD",sd),od=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",el),ld=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",el),cd=new RegExp("^"+rd+ad+od+ld+"$"),hd=["material","materials","bones","map"],Io=class{constructor(t,e,n){let s=n||ae.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ae=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(id,"")}static parseTrackName(t){let e=cd.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);hd.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ae.Composite=Io;ae.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ae.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ae.prototype.GetterByBindingType=[ae.prototype._getValue_direct,ae.prototype._getValue_array,ae.prototype._getValue_arrayElement,ae.prototype._getValue_toArray];ae.prototype.SetterByBindingTypeAndVersioning=[[ae.prototype._setValue_direct,ae.prototype._setValue_direct_setNeedsUpdate,ae.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_array,ae.prototype._setValue_array_setNeedsUpdate,ae.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_arrayElement,ae.prototype._setValue_arrayElement_setNeedsUpdate,ae.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_fromArray,ae.prototype._setValue_fromArray_setNeedsUpdate,ae.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var V_=new Float32Array(1);var Ji=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Gt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Gt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Ns=class extends Ze{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function nl(i,t,e,n){let s=ud(n);switch(e){case Ho:return i*t;case Wo:return i*t;case Xo:return i*t*2;case qo:return i*t/s.components*s.byteLength;case es:return i*t/s.components*s.byteLength;case Yo:return i*t*2/s.components*s.byteLength;case sa:return i*t*2/s.components*s.byteLength;case Go:return i*t*3/s.components*s.byteLength;case Ne:return i*t*4/s.components*s.byteLength;case ns:return i*t*4/s.components*s.byteLength;case zs:case ks:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Vs:case Hs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case aa:case la:return Math.max(i,16)*Math.max(t,8)/4;case ra:case oa:return Math.max(i,8)*Math.max(t,8)/2;case ca:case ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ua:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case fa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case pa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case ma:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ga:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case _a:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case xa:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ya:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case va:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Sa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ba:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case wa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ea:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Gs:case Ta:case Aa:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Zo:case Ca:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ra:case Pa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ud(i){switch(i){case Ke:case zo:return{byteLength:1,components:1};case Ki:case ko:case ji:return{byteLength:2,components:1};case na:case ia:return{byteLength:2,components:4};case cn:case ea:case yn:return{byteLength:4,components:1};case Vo:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"175"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="175");function Ph(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function fd(i){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],y=u[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,u[d]=y)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let y=u[p];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var pd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,md=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_d=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Md=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,bd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ed=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Td=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ad=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Cd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Pd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Id=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ld=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ud=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Nd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Fd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Od=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Bd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,zd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,kd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Yd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$d=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Kd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Qd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,tf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ef=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,nf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,af=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,of=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,lf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,uf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,df=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ff=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,pf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,mf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,gf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_f=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,bf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ef=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Tf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Af=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,If=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Df=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Lf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Uf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ff=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Of=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Bf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Wf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$f=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Jf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Kf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Qf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,tp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ep=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,np=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ip=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,sp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ap=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,op=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,lp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,cp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,fp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,pp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_p=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Mp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Sp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,bp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ep=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Rp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ip=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Lp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Np=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Fp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Op=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,zp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Gp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Yp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:pd,alphahash_pars_fragment:md,alphamap_fragment:gd,alphamap_pars_fragment:_d,alphatest_fragment:xd,alphatest_pars_fragment:yd,aomap_fragment:vd,aomap_pars_fragment:Md,batching_pars_vertex:Sd,batching_vertex:bd,begin_vertex:wd,beginnormal_vertex:Ed,bsdfs:Td,iridescence_fragment:Ad,bumpmap_pars_fragment:Cd,clipping_planes_fragment:Rd,clipping_planes_pars_fragment:Pd,clipping_planes_pars_vertex:Id,clipping_planes_vertex:Dd,color_fragment:Ld,color_pars_fragment:Ud,color_pars_vertex:Nd,color_vertex:Fd,common:Od,cube_uv_reflection_fragment:Bd,defaultnormal_vertex:zd,displacementmap_pars_vertex:kd,displacementmap_vertex:Vd,emissivemap_fragment:Hd,emissivemap_pars_fragment:Gd,colorspace_fragment:Wd,colorspace_pars_fragment:Xd,envmap_fragment:qd,envmap_common_pars_fragment:Yd,envmap_pars_fragment:Zd,envmap_pars_vertex:$d,envmap_physical_pars_fragment:of,envmap_vertex:Jd,fog_vertex:Kd,fog_pars_vertex:jd,fog_fragment:Qd,fog_pars_fragment:tf,gradientmap_pars_fragment:ef,lightmap_pars_fragment:nf,lights_lambert_fragment:sf,lights_lambert_pars_fragment:rf,lights_pars_begin:af,lights_toon_fragment:lf,lights_toon_pars_fragment:cf,lights_phong_fragment:hf,lights_phong_pars_fragment:uf,lights_physical_fragment:df,lights_physical_pars_fragment:ff,lights_fragment_begin:pf,lights_fragment_maps:mf,lights_fragment_end:gf,logdepthbuf_fragment:_f,logdepthbuf_pars_fragment:xf,logdepthbuf_pars_vertex:yf,logdepthbuf_vertex:vf,map_fragment:Mf,map_pars_fragment:Sf,map_particle_fragment:bf,map_particle_pars_fragment:wf,metalnessmap_fragment:Ef,metalnessmap_pars_fragment:Tf,morphinstance_vertex:Af,morphcolor_vertex:Cf,morphnormal_vertex:Rf,morphtarget_pars_vertex:Pf,morphtarget_vertex:If,normal_fragment_begin:Df,normal_fragment_maps:Lf,normal_pars_fragment:Uf,normal_pars_vertex:Nf,normal_vertex:Ff,normalmap_pars_fragment:Of,clearcoat_normal_fragment_begin:Bf,clearcoat_normal_fragment_maps:zf,clearcoat_pars_fragment:kf,iridescence_pars_fragment:Vf,opaque_fragment:Hf,packing:Gf,premultiplied_alpha_fragment:Wf,project_vertex:Xf,dithering_fragment:qf,dithering_pars_fragment:Yf,roughnessmap_fragment:Zf,roughnessmap_pars_fragment:$f,shadowmap_pars_fragment:Jf,shadowmap_pars_vertex:Kf,shadowmap_vertex:jf,shadowmask_pars_fragment:Qf,skinbase_vertex:tp,skinning_pars_vertex:ep,skinning_vertex:np,skinnormal_vertex:ip,specularmap_fragment:sp,specularmap_pars_fragment:rp,tonemapping_fragment:ap,tonemapping_pars_fragment:op,transmission_fragment:lp,transmission_pars_fragment:cp,uv_pars_fragment:hp,uv_pars_vertex:up,uv_vertex:dp,worldpos_vertex:fp,background_vert:pp,background_frag:mp,backgroundCube_vert:gp,backgroundCube_frag:_p,cube_vert:xp,cube_frag:yp,depth_vert:vp,depth_frag:Mp,distanceRGBA_vert:Sp,distanceRGBA_frag:bp,equirect_vert:wp,equirect_frag:Ep,linedashed_vert:Tp,linedashed_frag:Ap,meshbasic_vert:Cp,meshbasic_frag:Rp,meshlambert_vert:Pp,meshlambert_frag:Ip,meshmatcap_vert:Dp,meshmatcap_frag:Lp,meshnormal_vert:Up,meshnormal_frag:Np,meshphong_vert:Fp,meshphong_frag:Op,meshphysical_vert:Bp,meshphysical_frag:zp,meshtoon_vert:kp,meshtoon_frag:Vp,points_vert:Hp,points_frag:Gp,shadow_vert:Wp,shadow_frag:Xp,sprite_vert:qp,sprite_frag:Yp},lt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new Nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new Nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},vn={basic:{uniforms:Te([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Te([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Te([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Te([lt.common,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.roughnessmap,lt.metalnessmap,lt.fog,lt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Te([lt.common,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.gradientmap,lt.fog,lt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Te([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Te([lt.points,lt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Te([lt.common,lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Te([lt.common,lt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Te([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Te([lt.sprite,lt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:Te([lt.common,lt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:Te([lt.lights,lt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};vn.physical={uniforms:Te([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new Nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new Nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new Nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};var Da={r:0,b:0,g:0},vi=new Le,Zp=new ie;function $p(i,t,e,n,s,r,a){let o=new Wt(0),l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(b){let v=b.isScene===!0?b.background:null;return v&&v.isTexture&&(v=(b.backgroundBlurriness>0?e:t).get(v)),v}function y(b){let v=!1,P=g(b);P===null?f(o,l):P&&P.isColor&&(f(P,1),v=!0);let R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,v){let P=g(v);P&&(P.isCubeTexture||P.mapping===Os)?(h===void 0&&(h=new Ee(new Yi(1,1,1),new ke({name:"BackgroundCubeMaterial",uniforms:yi(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,E,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),vi.copy(v.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=P,h.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Zp.makeRotationFromEuler(vi)),h.material.toneMapped=$t.getTransfer(P.colorSpace)!==ee,(u!==P||d!==P.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=P,d=P.version,p=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):P&&P.isTexture&&(c===void 0&&(c=new Ee(new Is(2,2),new ke({name:"BackgroundMaterial",uniforms:yi(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=P,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=$t.getTransfer(P.colorSpace)!==ee,P.matrixAutoUpdate===!0&&P.updateMatrix(),c.material.uniforms.uvTransform.value.copy(P.matrix),(u!==P||d!==P.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=P,d=P.version,p=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,v){b.getRGB(Da,Qo(i)),n.buffers.color.setClear(Da.r,Da.g,Da.b,v,a)}function A(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,v=1){o.set(b),l=v,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(o,l)},render:y,addToRenderList:m,dispose:A}}function Jp(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(_,C,G,L,B){let z=!1,U=u(L,G,C);r!==U&&(r=U,c(r.object)),z=p(_,L,G,B),z&&g(_,L,G,B),B!==null&&t.update(B,i.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,v(_,C,G,L),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,C,G){let L=G.wireframe===!0,B=n[_.id];B===void 0&&(B={},n[_.id]=B);let z=B[C.id];z===void 0&&(z={},B[C.id]=z);let U=z[L];return U===void 0&&(U=d(l()),z[L]=U),U}function d(_){let C=[],G=[],L=[];for(let B=0;B<e;B++)C[B]=0,G[B]=0,L[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:G,attributeDivisors:L,object:_,attributes:{},index:null}}function p(_,C,G,L){let B=r.attributes,z=C.attributes,U=0,H=G.getAttributes();for(let V in H)if(H[V].location>=0){let $=B[V],it=z[V];if(it===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(it=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(it=_.instanceColor)),$===void 0||$.attribute!==it||it&&$.data!==it.data)return!0;U++}return r.attributesNum!==U||r.index!==L}function g(_,C,G,L){let B={},z=C.attributes,U=0,H=G.getAttributes();for(let V in H)if(H[V].location>=0){let $=z[V];$===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&($=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&($=_.instanceColor));let it={};it.attribute=$,$&&$.data&&(it.data=$.data),B[V]=it,U++}r.attributes=B,r.attributesNum=U,r.index=L}function y(){let _=r.newAttributes;for(let C=0,G=_.length;C<G;C++)_[C]=0}function m(_){f(_,0)}function f(_,C){let G=r.newAttributes,L=r.enabledAttributes,B=r.attributeDivisors;G[_]=1,L[_]===0&&(i.enableVertexAttribArray(_),L[_]=1),B[_]!==C&&(i.vertexAttribDivisor(_,C),B[_]=C)}function A(){let _=r.newAttributes,C=r.enabledAttributes;for(let G=0,L=C.length;G<L;G++)C[G]!==_[G]&&(i.disableVertexAttribArray(G),C[G]=0)}function b(_,C,G,L,B,z,U){U===!0?i.vertexAttribIPointer(_,C,G,B,z):i.vertexAttribPointer(_,C,G,L,B,z)}function v(_,C,G,L){y();let B=L.attributes,z=G.getAttributes(),U=C.defaultAttributeValues;for(let H in z){let V=z[H];if(V.location>=0){let nt=B[H];if(nt===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(nt=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(nt=_.instanceColor)),nt!==void 0){let $=nt.normalized,it=nt.itemSize,Q=t.get(nt);if(Q===void 0)continue;let Mt=Q.buffer,q=Q.type,Z=Q.bytesPerElement,st=q===i.INT||q===i.UNSIGNED_INT||nt.gpuType===ea;if(nt.isInterleavedBufferAttribute){let et=nt.data,ct=et.stride,St=nt.offset;if(et.isInstancedInterleavedBuffer){for(let pt=0;pt<V.locationSize;pt++)f(V.location+pt,et.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let pt=0;pt<V.locationSize;pt++)m(V.location+pt);i.bindBuffer(i.ARRAY_BUFFER,Mt);for(let pt=0;pt<V.locationSize;pt++)b(V.location+pt,it/V.locationSize,q,$,ct*Z,(St+it/V.locationSize*pt)*Z,st)}else{if(nt.isInstancedBufferAttribute){for(let et=0;et<V.locationSize;et++)f(V.location+et,nt.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let et=0;et<V.locationSize;et++)m(V.location+et);i.bindBuffer(i.ARRAY_BUFFER,Mt);for(let et=0;et<V.locationSize;et++)b(V.location+et,it/V.locationSize,q,$,it*Z,it/V.locationSize*et*Z,st)}}else if(U!==void 0){let $=U[H];if($!==void 0)switch($.length){case 2:i.vertexAttrib2fv(V.location,$);break;case 3:i.vertexAttrib3fv(V.location,$);break;case 4:i.vertexAttrib4fv(V.location,$);break;default:i.vertexAttrib1fv(V.location,$)}}}}A()}function P(){T();for(let _ in n){let C=n[_];for(let G in C){let L=C[G];for(let B in L)h(L[B].object),delete L[B];delete C[G]}delete n[_]}}function R(_){if(n[_.id]===void 0)return;let C=n[_.id];for(let G in C){let L=C[G];for(let B in L)h(L[B].object),delete L[B];delete C[G]}delete n[_.id]}function E(_){for(let C in n){let G=n[C];if(G[_.id]===void 0)continue;let L=G[_.id];for(let B in L)h(L[B].object),delete L[B];delete G[_.id]}}function T(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:S,dispose:P,releaseStatesOfGeometry:R,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:m,disableUnusedAttributes:A}}function Kp(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function l(c,h,u,d){if(u===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y]*d[y];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function jp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(E){return!(E!==Ne&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){let T=E===ji&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Ke&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==yn&&!T)}function l(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:A,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:P,maxSamples:R}}function Qp(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Ye,o=new Ut,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let A=r?0:n,b=A*4,v=f.clippingState||null;l.value=v,v=h(g,d,b,p);for(let P=0;P!==b;++P)v[P]=e[P];f.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let f=p+y*4,A=d.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<f)&&(m=new Float32Array(f));for(let b=0,v=p;b!==y;++b,v+=4)a.copy(u[b]).applyMatrix4(A,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function tm(i){let t=new WeakMap;function e(a,o){return o===jr?a.mapping=_i:o===Qr&&(a.mapping=xi),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===jr||o===Qr)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new Pr(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var rs=4,oh=[.125,.215,.35,.446,.526,.582],bi=20,il=new Hr,lh=new Wt,sl=null,rl=0,al=0,ol=!1,Si=(1+Math.sqrt(5))/2,ss=1/Si,ch=[new D(-Si,ss,0),new D(Si,ss,0),new D(-ss,0,Si),new D(ss,0,Si),new D(0,Si,-ss),new D(0,Si,ss),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],em=new D,Na=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=em}=r;sl=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),al=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=uh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(sl,rl,al),this._renderer.xr.enabled=ol,t.scissorTest=!1,La(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_i||t.mapping===xi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),sl=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),al=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:ji,format:Ne,colorSpace:di,depthBuffer:!1},s=hh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hh(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=nm(r)),this._blurMaterial=im(r,t,e)}return s}_compileMaterial(t){let e=new Ee(this._lodPlanes[0],t);this._renderer.compile(e,il)}_sceneToCubeUV(t,e,n,s,r){let l=new we(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(lh),u.toneMapping=Dn,u.autoClear=!1;let g=new pi({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1}),y=new Ee(new Yi,g),m=!1,f=t.background;f?f.isColor&&(g.color.copy(f),t.background=null,m=!0):(g.color.copy(lh),m=!0);for(let A=0;A<6;A++){let b=A%3;b===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):b===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));let v=this._cubeSize;La(s,b*v,A>2?v:0,v,v),u.setRenderTarget(s),m&&u.render(y,l),u.render(t,l)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=f}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===_i||t.mapping===xi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=dh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=uh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ee(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;La(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,il)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ch[(s-r-1)%ch.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Ee(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*bi-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):bi;m>bi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${bi}`);let f=[],A=0;for(let E=0;E<bi;++E){let T=E/y,S=Math.exp(-T*T/2);f.push(S),E===0?A+=S:E<m&&(A+=2*S)}for(let E=0;E<f.length;E++)f[E]=f[E]/A;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;let v=this._sizeLods[s],P=3*v*(s>b-rs?s-b+rs:0),R=4*(this._cubeSize-v);La(e,P,R,3*v,2*v),l.setRenderTarget(e),l.render(u,il)}};function nm(i){let t=[],e=[],n=[],s=i,r=i-rs+1+oh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-rs?l=oh[a-i+rs-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,y=3,m=2,f=1,A=new Float32Array(y*g*p),b=new Float32Array(m*g*p),v=new Float32Array(f*g*p);for(let R=0;R<p;R++){let E=R%3*2/3-1,T=R>2?0:-1,S=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];A.set(S,y*g*R),b.set(d,m*g*R);let _=[R,R,R,R,R,R];v.set(_,f*g*R)}let P=new Ue;P.setAttribute("position",new oe(A,y)),P.setAttribute("uv",new oe(b,m)),P.setAttribute("faceIndex",new oe(v,f)),t.push(P),s>rs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function hh(i,t,e){let n=new mn(i,t,e);return n.texture.mapping=Os,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function La(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function im(i,t,e){let n=new Float32Array(bi),s=new D(0,1,0);return new ke({name:"SphericalGaussianBlur",defines:{n:bi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ln,depthTest:!1,depthWrite:!1})}function uh(){return new ke({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ln,depthTest:!1,depthWrite:!1})}function dh(){return new ke({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_l(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ln,depthTest:!1,depthWrite:!1})}function _l(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function sm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===jr||l===Qr,h=l===_i||l===xi;if(c||h){let u=t.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Na(i)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{let p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new Na(i)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function rm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Xs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function am(i,t,e,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let p in d)t.update(d[p],i.ARRAY_BUFFER)}function c(u){let d=[],p=u.index,g=u.attributes.position,y=0;if(p!==null){let A=p.array;y=p.version;for(let b=0,v=A.length;b<v;b+=3){let P=A[b+0],R=A[b+1],E=A[b+2];d.push(P,R,R,E,E,P)}}else if(g!==void 0){let A=g.array;y=g.version;for(let b=0,v=A.length/3-1;b<v;b+=3){let P=b+0,R=b+1,E=b+2;d.push(P,R,R,E,E,P)}}else return;let m=new(jo(d)?ws:bs)(d,1);m.version=y;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function om(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*a),e.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*a,g),e.update(p,n,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function u(d,p,g,y){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/a,p[f],y[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,y,0,g);let f=0;for(let A=0;A<g;A++)f+=p[A]*y[A];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function lm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function cm(i,t,e){let n=new WeakMap,s=new de;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let _=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",_)};var p=_;d!==void 0&&d.texture.dispose();let g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],A=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],v=0;g===!0&&(v=1),y===!0&&(v=2),m===!0&&(v=3);let P=o.attributes.position.count*v,R=1;P>t.maxTextureSize&&(R=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);let E=new Float32Array(P*R*4*u),T=new Ms(E,P,R,u);T.type=yn,T.needsUpdate=!0;let S=v*4;for(let C=0;C<u;C++){let G=f[C],L=A[C],B=b[C],z=P*R*4*C;for(let U=0;U<G.count;U++){let H=U*S;g===!0&&(s.fromBufferAttribute(G,U),E[z+H+0]=s.x,E[z+H+1]=s.y,E[z+H+2]=s.z,E[z+H+3]=0),y===!0&&(s.fromBufferAttribute(L,U),E[z+H+4]=s.x,E[z+H+5]=s.y,E[z+H+6]=s.z,E[z+H+7]=0),m===!0&&(s.fromBufferAttribute(B,U),E[z+H+8]=s.x,E[z+H+9]=s.y,E[z+H+10]=s.z,E[z+H+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new Nt(P,R)},n.set(o,d),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];let y=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",y),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function hm(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}var Ih=new Pe,fh=new Ps(1,1),Dh=new Ms,Lh=new Cr,Uh=new Ts,ph=[],mh=[],gh=new Float32Array(16),_h=new Float32Array(9),xh=new Float32Array(4);function os(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=ph[s];if(r===void 0&&(r=new Float32Array(s),ph[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Oa(i,t){let e=mh[t];e===void 0&&(e=new Int32Array(t),mh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function um(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function dm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2fv(this.addr,t),ge(e,t)}}function fm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;i.uniform3fv(this.addr,t),ge(e,t)}}function pm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4fv(this.addr,t),ge(e,t)}}function mm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;xh.set(n),i.uniformMatrix2fv(this.addr,!1,xh),ge(e,n)}}function gm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;_h.set(n),i.uniformMatrix3fv(this.addr,!1,_h),ge(e,n)}}function _m(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;gh.set(n),i.uniformMatrix4fv(this.addr,!1,gh),ge(e,n)}}function xm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ym(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2iv(this.addr,t),ge(e,t)}}function vm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3iv(this.addr,t),ge(e,t)}}function Mm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4iv(this.addr,t),ge(e,t)}}function Sm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function bm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2uiv(this.addr,t),ge(e,t)}}function wm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3uiv(this.addr,t),ge(e,t)}}function Em(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4uiv(this.addr,t),ge(e,t)}}function Tm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(fh.compareFunction=$o,r=fh):r=Ih,e.setTexture2D(t||r,s)}function Am(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Lh,s)}function Cm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Uh,s)}function Rm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Dh,s)}function Pm(i){switch(i){case 5126:return um;case 35664:return dm;case 35665:return fm;case 35666:return pm;case 35674:return mm;case 35675:return gm;case 35676:return _m;case 5124:case 35670:return xm;case 35667:case 35671:return ym;case 35668:case 35672:return vm;case 35669:case 35673:return Mm;case 5125:return Sm;case 36294:return bm;case 36295:return wm;case 36296:return Em;case 35678:case 36198:case 36298:case 36306:case 35682:return Tm;case 35679:case 36299:case 36307:return Am;case 35680:case 36300:case 36308:case 36293:return Cm;case 36289:case 36303:case 36311:case 36292:return Rm}}function Im(i,t){i.uniform1fv(this.addr,t)}function Dm(i,t){let e=os(t,this.size,2);i.uniform2fv(this.addr,e)}function Lm(i,t){let e=os(t,this.size,3);i.uniform3fv(this.addr,e)}function Um(i,t){let e=os(t,this.size,4);i.uniform4fv(this.addr,e)}function Nm(i,t){let e=os(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Fm(i,t){let e=os(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Om(i,t){let e=os(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Bm(i,t){i.uniform1iv(this.addr,t)}function zm(i,t){i.uniform2iv(this.addr,t)}function km(i,t){i.uniform3iv(this.addr,t)}function Vm(i,t){i.uniform4iv(this.addr,t)}function Hm(i,t){i.uniform1uiv(this.addr,t)}function Gm(i,t){i.uniform2uiv(this.addr,t)}function Wm(i,t){i.uniform3uiv(this.addr,t)}function Xm(i,t){i.uniform4uiv(this.addr,t)}function qm(i,t,e){let n=this.cache,s=t.length,r=Oa(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Ih,r[a])}function Ym(i,t,e){let n=this.cache,s=t.length,r=Oa(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Lh,r[a])}function Zm(i,t,e){let n=this.cache,s=t.length,r=Oa(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Uh,r[a])}function $m(i,t,e){let n=this.cache,s=t.length,r=Oa(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Dh,r[a])}function Jm(i){switch(i){case 5126:return Im;case 35664:return Dm;case 35665:return Lm;case 35666:return Um;case 35674:return Nm;case 35675:return Fm;case 35676:return Om;case 5124:case 35670:return Bm;case 35667:case 35671:return zm;case 35668:case 35672:return km;case 35669:case 35673:return Vm;case 5125:return Hm;case 36294:return Gm;case 36295:return Wm;case 36296:return Xm;case 35678:case 36198:case 36298:case 36306:case 35682:return qm;case 35679:case 36299:case 36307:return Ym;case 35680:case 36300:case 36308:case 36293:return Zm;case 36289:case 36303:case 36311:case 36292:return $m}}var cl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Pm(e.type)}},hl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Jm(e.type)}},ul=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},ll=/(\w+)(\])?(\[|\.)?/g;function yh(i,t){i.seq.push(t),i.map[t.id]=t}function Km(i,t,e){let n=i.name,s=n.length;for(ll.lastIndex=0;;){let r=ll.exec(n),a=ll.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){yh(e,c===void 0?new cl(o,i,t):new hl(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new ul(o),yh(e,u)),e=u}}}var as=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Km(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function vh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var jm=37297,Qm=0;function tg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Mh=new Ut;function eg(i){$t._getMatrix(Mh,$t.workingColorSpace,i);let t=`mat3( ${Mh.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(i)){case ys:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Sh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+tg(i.getShaderSource(t),a)}else return s}function ng(i,t){let e=eg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function ig(i,t){let e;switch(t){case Nc:e="Linear";break;case Fc:e="Reinhard";break;case Oc:e="Cineon";break;case Bc:e="ACESFilmic";break;case kc:e="AgX";break;case Vc:e="Neutral";break;case zc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Ua=new D;function sg(){$t.getLuminanceCoefficients(Ua);let i=Ua.x.toFixed(4),t=Ua.y.toFixed(4),e=Ua.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function ag(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function og(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function qs(i){return i!==""}function bh(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var lg=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(i){return i.replace(lg,hg)}var cg=new Map;function hg(i,t){let e=Vt[t];if(e===void 0){let n=cg.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}var ug=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Eh(i){return i.replace(ug,dg)}function dg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Th(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function fg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Lo?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===gc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===xn&&(t="SHADOWMAP_TYPE_VSM"),t}function pg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case _i:case xi:t="ENVMAP_TYPE_CUBE";break;case Os:t="ENVMAP_TYPE_CUBE_UV";break}return t}function mg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case xi:t="ENVMAP_MODE_REFRACTION";break}return t}function gg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Oo:t="ENVMAP_BLENDING_MULTIPLY";break;case Lc:t="ENVMAP_BLENDING_MIX";break;case Uc:t="ENVMAP_BLENDING_ADD";break}return t}function _g(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function xg(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=fg(e),c=pg(e),h=mg(e),u=gg(e),d=_g(e),p=rg(e),g=ag(r),y=s.createProgram(),m,f,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qs).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qs).join(`
`),f.length>0&&(f+=`
`)):(m=[Th(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),f=[Th(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Dn?ig("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,ng("linearToOutputTexel",e.outputColorSpace),sg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qs).join(`
`)),a=dl(a),a=bh(a,e),a=wh(a,e),o=dl(o),o=bh(o,e),o=wh(o,e),a=Eh(a),o=Eh(o),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Ws?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ws?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let b=A+m+a,v=A+f+o,P=vh(s,s.VERTEX_SHADER,b),R=vh(s,s.FRAGMENT_SHADER,v);s.attachShader(y,P),s.attachShader(y,R),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function E(C){if(i.debug.checkShaderErrors){let G=s.getProgramInfoLog(y).trim(),L=s.getShaderInfoLog(P).trim(),B=s.getShaderInfoLog(R).trim(),z=!0,U=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,P,R);else{let H=Sh(s,P,"vertex"),V=Sh(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+H+`
`+V)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(L===""||B==="")&&(U=!1);U&&(C.diagnostics={runnable:z,programLog:G,vertexShader:{log:L,prefix:m},fragmentShader:{log:B,prefix:f}})}s.deleteShader(P),s.deleteShader(R),T=new as(s,y),S=og(s,y)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let S;this.getAttributes=function(){return S===void 0&&E(this),S};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(y,jm)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qm++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=P,this.fragmentShader=R,this}var yg=0,fl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new pl(t),e.set(t,n)),n}},pl=class{constructor(t){this.id=yg++,this.code=t,this.usedTimes=0}};function vg(i,t,e,n,s,r,a){let o=new Ss,l=new fl,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,_,C,G,L){let B=G.fog,z=L.geometry,U=S.isMeshStandardMaterial?G.environment:null,H=(S.isMeshStandardMaterial?e:t).get(S.envMap||U),V=H&&H.mapping===Os?H.image.height:null,nt=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let $=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,it=$!==void 0?$.length:0,Q=0;z.morphAttributes.position!==void 0&&(Q=1),z.morphAttributes.normal!==void 0&&(Q=2),z.morphAttributes.color!==void 0&&(Q=3);let Mt,q,Z,st;if(nt){let te=vn[nt];Mt=te.vertexShader,q=te.fragmentShader}else Mt=S.vertexShader,q=S.fragmentShader,l.update(S),Z=l.getVertexShaderID(S),st=l.getFragmentShaderID(S);let et=i.getRenderTarget(),ct=i.state.buffers.depth.getReversed(),St=L.isInstancedMesh===!0,pt=L.isBatchedMesh===!0,Ft=!!S.map,Ot=!!S.matcap,Ct=!!H,I=!!S.aoMap,re=!!S.lightMap,Bt=!!S.bumpMap,Ht=!!S.normalMap,bt=!!S.displacementMap,Xt=!!S.emissiveMap,Et=!!S.metalnessMap,w=!!S.roughnessMap,x=S.anisotropy>0,k=S.clearcoat>0,K=S.dispersion>0,tt=S.iridescence>0,J=S.sheen>0,wt=S.transmission>0,ut=x&&!!S.anisotropyMap,_t=k&&!!S.clearcoatMap,Yt=k&&!!S.clearcoatNormalMap,at=k&&!!S.clearcoatRoughnessMap,xt=tt&&!!S.iridescenceMap,Pt=tt&&!!S.iridescenceThicknessMap,Dt=J&&!!S.sheenColorMap,yt=J&&!!S.sheenRoughnessMap,qt=!!S.specularMap,kt=!!S.specularColorMap,se=!!S.specularIntensityMap,N=wt&&!!S.transmissionMap,dt=wt&&!!S.thicknessMap,Y=!!S.gradientMap,j=!!S.alphaMap,mt=S.alphaTest>0,ft=!!S.alphaHash,zt=!!S.extensions,he=Dn;S.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(he=i.toneMapping);let Me={shaderID:nt,shaderType:S.type,shaderName:S.name,vertexShader:Mt,fragmentShader:q,defines:S.defines,customVertexShaderID:Z,customFragmentShaderID:st,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:pt,batchingColor:pt&&L._colorsTexture!==null,instancing:St,instancingColor:St&&L.instanceColor!==null,instancingMorph:St&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:di,alphaToCoverage:!!S.alphaToCoverage,map:Ft,matcap:Ot,envMap:Ct,envMapMode:Ct&&H.mapping,envMapCubeUVHeight:V,aoMap:I,lightMap:re,bumpMap:Bt,normalMap:Ht,displacementMap:d&&bt,emissiveMap:Xt,normalMapObjectSpace:Ht&&S.normalMapType===qc,normalMapTangentSpace:Ht&&S.normalMapType===Xc,metalnessMap:Et,roughnessMap:w,anisotropy:x,anisotropyMap:ut,clearcoat:k,clearcoatMap:_t,clearcoatNormalMap:Yt,clearcoatRoughnessMap:at,dispersion:K,iridescence:tt,iridescenceMap:xt,iridescenceThicknessMap:Pt,sheen:J,sheenColorMap:Dt,sheenRoughnessMap:yt,specularMap:qt,specularColorMap:kt,specularIntensityMap:se,transmission:wt,transmissionMap:N,thicknessMap:dt,gradientMap:Y,opaque:S.transparent===!1&&S.blending===ci&&S.alphaToCoverage===!1,alphaMap:j,alphaTest:mt,alphaHash:ft,combine:S.combine,mapUv:Ft&&y(S.map.channel),aoMapUv:I&&y(S.aoMap.channel),lightMapUv:re&&y(S.lightMap.channel),bumpMapUv:Bt&&y(S.bumpMap.channel),normalMapUv:Ht&&y(S.normalMap.channel),displacementMapUv:bt&&y(S.displacementMap.channel),emissiveMapUv:Xt&&y(S.emissiveMap.channel),metalnessMapUv:Et&&y(S.metalnessMap.channel),roughnessMapUv:w&&y(S.roughnessMap.channel),anisotropyMapUv:ut&&y(S.anisotropyMap.channel),clearcoatMapUv:_t&&y(S.clearcoatMap.channel),clearcoatNormalMapUv:Yt&&y(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&y(S.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&y(S.iridescenceMap.channel),iridescenceThicknessMapUv:Pt&&y(S.iridescenceThicknessMap.channel),sheenColorMapUv:Dt&&y(S.sheenColorMap.channel),sheenRoughnessMapUv:yt&&y(S.sheenRoughnessMap.channel),specularMapUv:qt&&y(S.specularMap.channel),specularColorMapUv:kt&&y(S.specularColorMap.channel),specularIntensityMapUv:se&&y(S.specularIntensityMap.channel),transmissionMapUv:N&&y(S.transmissionMap.channel),thicknessMapUv:dt&&y(S.thicknessMap.channel),alphaMapUv:j&&y(S.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(Ht||x),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!z.attributes.uv&&(Ft||j),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ct,skinning:L.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:it,morphTextureStride:Q,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:he,decodeVideoTexture:Ft&&S.map.isVideoTexture===!0&&$t.getTransfer(S.map.colorSpace)===ee,decodeVideoTextureEmissive:Xt&&S.emissiveMap.isVideoTexture===!0&&$t.getTransfer(S.emissiveMap.colorSpace)===ee,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Je,flipSided:S.side===Ie,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:zt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&S.extensions.multiDraw===!0||pt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Me.vertexUv1s=c.has(1),Me.vertexUv2s=c.has(2),Me.vertexUv3s=c.has(3),c.clear(),Me}function f(S){let _=[];if(S.shaderID?_.push(S.shaderID):(_.push(S.customVertexShaderID),_.push(S.customFragmentShaderID)),S.defines!==void 0)for(let C in S.defines)_.push(C),_.push(S.defines[C]);return S.isRawShaderMaterial===!1&&(A(_,S),b(_,S),_.push(i.outputColorSpace)),_.push(S.customProgramCacheKey),_.join()}function A(S,_){S.push(_.precision),S.push(_.outputColorSpace),S.push(_.envMapMode),S.push(_.envMapCubeUVHeight),S.push(_.mapUv),S.push(_.alphaMapUv),S.push(_.lightMapUv),S.push(_.aoMapUv),S.push(_.bumpMapUv),S.push(_.normalMapUv),S.push(_.displacementMapUv),S.push(_.emissiveMapUv),S.push(_.metalnessMapUv),S.push(_.roughnessMapUv),S.push(_.anisotropyMapUv),S.push(_.clearcoatMapUv),S.push(_.clearcoatNormalMapUv),S.push(_.clearcoatRoughnessMapUv),S.push(_.iridescenceMapUv),S.push(_.iridescenceThicknessMapUv),S.push(_.sheenColorMapUv),S.push(_.sheenRoughnessMapUv),S.push(_.specularMapUv),S.push(_.specularColorMapUv),S.push(_.specularIntensityMapUv),S.push(_.transmissionMapUv),S.push(_.thicknessMapUv),S.push(_.combine),S.push(_.fogExp2),S.push(_.sizeAttenuation),S.push(_.morphTargetsCount),S.push(_.morphAttributeCount),S.push(_.numDirLights),S.push(_.numPointLights),S.push(_.numSpotLights),S.push(_.numSpotLightMaps),S.push(_.numHemiLights),S.push(_.numRectAreaLights),S.push(_.numDirLightShadows),S.push(_.numPointLightShadows),S.push(_.numSpotLightShadows),S.push(_.numSpotLightShadowsWithMaps),S.push(_.numLightProbes),S.push(_.shadowMapType),S.push(_.toneMapping),S.push(_.numClippingPlanes),S.push(_.numClipIntersection),S.push(_.depthPacking)}function b(S,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reverseDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),S.push(o.mask)}function v(S){let _=g[S.type],C;if(_){let G=vn[_];C=rh.clone(G.uniforms)}else C=S.uniforms;return C}function P(S,_){let C;for(let G=0,L=h.length;G<L;G++){let B=h[G];if(B.cacheKey===_){C=B,++C.usedTimes;break}}return C===void 0&&(C=new xg(i,_,S,r),h.push(C)),C}function R(S){if(--S.usedTimes===0){let _=h.indexOf(S);h[_]=h[h.length-1],h.pop(),S.destroy()}}function E(S){l.remove(S)}function T(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:v,acquireProgram:P,releaseProgram:R,releaseShaderCache:E,programs:h,dispose:T}}function Mg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Sg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ah(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ch(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,p,g,y,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=y,f.group=m),t++,f}function o(u,d,p,g,y,m){let f=a(u,d,p,g,y,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(u,d,p,g,y,m){let f=a(u,d,p,g,y,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||Sg),n.length>1&&n.sort(d||Ah),s.length>1&&s.sort(d||Ah)}function h(){for(let u=t,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function bg(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new Ch,i.set(n,[a])):s>=r.length?(a=new Ch,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function wg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Wt};break;case"SpotLight":e={position:new D,direction:new D,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function Eg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Tg=0;function Ag(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Cg(i){let t=new wg,e=Eg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new ie,a=new ie;function o(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,y=0,m=0,f=0,A=0,b=0,v=0,P=0,R=0,E=0;c.sort(Ag);for(let S=0,_=c.length;S<_;S++){let C=c[S],G=C.color,L=C.intensity,B=C.distance,z=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=G.r*L,u+=G.g*L,d+=G.b*L;else if(C.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(C.sh.coefficients[U],L);E++}else if(C.isDirectionalLight){let U=t.get(C);if(U.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let H=C.shadow,V=e.get(C);V.shadowIntensity=H.intensity,V.shadowBias=H.bias,V.shadowNormalBias=H.normalBias,V.shadowRadius=H.radius,V.shadowMapSize=H.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=z,n.directionalShadowMatrix[p]=C.shadow.matrix,A++}n.directional[p]=U,p++}else if(C.isSpotLight){let U=t.get(C);U.position.setFromMatrixPosition(C.matrixWorld),U.color.copy(G).multiplyScalar(L),U.distance=B,U.coneCos=Math.cos(C.angle),U.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),U.decay=C.decay,n.spot[y]=U;let H=C.shadow;if(C.map&&(n.spotLightMap[P]=C.map,P++,H.updateMatrices(C),C.castShadow&&R++),n.spotLightMatrix[y]=H.matrix,C.castShadow){let V=e.get(C);V.shadowIntensity=H.intensity,V.shadowBias=H.bias,V.shadowNormalBias=H.normalBias,V.shadowRadius=H.radius,V.shadowMapSize=H.mapSize,n.spotShadow[y]=V,n.spotShadowMap[y]=z,v++}y++}else if(C.isRectAreaLight){let U=t.get(C);U.color.copy(G).multiplyScalar(L),U.halfWidth.set(C.width*.5,0,0),U.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=U,m++}else if(C.isPointLight){let U=t.get(C);if(U.color.copy(C.color).multiplyScalar(C.intensity),U.distance=C.distance,U.decay=C.decay,C.castShadow){let H=C.shadow,V=e.get(C);V.shadowIntensity=H.intensity,V.shadowBias=H.bias,V.shadowNormalBias=H.normalBias,V.shadowRadius=H.radius,V.shadowMapSize=H.mapSize,V.shadowCameraNear=H.camera.near,V.shadowCameraFar=H.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=C.shadow.matrix,b++}n.point[g]=U,g++}else if(C.isHemisphereLight){let U=t.get(C);U.skyColor.copy(C.color).multiplyScalar(L),U.groundColor.copy(C.groundColor).multiplyScalar(L),n.hemi[f]=U,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=lt.LTC_FLOAT_1,n.rectAreaLTC2=lt.LTC_FLOAT_2):(n.rectAreaLTC1=lt.LTC_HALF_1,n.rectAreaLTC2=lt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let T=n.hash;(T.directionalLength!==p||T.pointLength!==g||T.spotLength!==y||T.rectAreaLength!==m||T.hemiLength!==f||T.numDirectionalShadows!==A||T.numPointShadows!==b||T.numSpotShadows!==v||T.numSpotMaps!==P||T.numLightProbes!==E)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+P-R,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=E,T.directionalLength=p,T.pointLength=g,T.spotLength=y,T.rectAreaLength=m,T.hemiLength=f,T.numDirectionalShadows=A,T.numPointShadows=b,T.numSpotShadows=v,T.numSpotMaps=P,T.numLightProbes=E,n.version=Tg++)}function l(c,h){let u=0,d=0,p=0,g=0,y=0,m=h.matrixWorldInverse;for(let f=0,A=c.length;f<A;f++){let b=c[f];if(b.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(b.isSpotLight){let v=n.spot[p];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),p++}else if(b.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:n}}function Rh(i){let t=new Cg(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Rg(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new Rh(i),t.set(s,[o])):r>=a.length?(o=new Rh(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var Pg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ig=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Dg(i,t,e){let n=new Rs,s=new Nt,r=new Nt,a=new de,o=new Ir({depthPacking:Wc}),l=new Dr,c={},h=e.maxTextureSize,u={[In]:Ie,[Ie]:In,[Je]:Je},d=new ke({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Nt},radius:{value:4}},vertexShader:Pg,fragmentShader:Ig}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new Ue;g.setAttribute("position",new oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Ee(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lo;let f=this.type;this.render=function(R,E,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;let S=i.getRenderTarget(),_=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),G=i.state;G.setBlending(ln),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let L=f!==xn&&this.type===xn,B=f===xn&&this.type!==xn;for(let z=0,U=R.length;z<U;z++){let H=R[z],V=H.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let nt=V.getFrameExtents();if(s.multiply(nt),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/nt.x),s.x=r.x*nt.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/nt.y),s.y=r.y*nt.y,V.mapSize.y=r.y)),V.map===null||L===!0||B===!0){let it=this.type!==xn?{minFilter:le,magFilter:le}:{};V.map!==null&&V.map.dispose(),V.map=new mn(s.x,s.y,it),V.map.texture.name=H.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();let $=V.getViewportCount();for(let it=0;it<$;it++){let Q=V.getViewport(it);a.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),G.viewport(a),V.updateMatrices(H,it),n=V.getFrustum(),v(E,T,V.camera,H,this.type)}V.isPointLightShadow!==!0&&this.type===xn&&A(V,T),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,_,C)};function A(R,E){let T=t.update(y);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new mn(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(E,null,T,d,y,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(E,null,T,p,y,null)}function b(R,E,T,S){let _=null,C=T.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(C!==void 0)_=C;else if(_=T.isPointLight===!0?l:o,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){let G=_.uuid,L=E.uuid,B=c[G];B===void 0&&(B={},c[G]=B);let z=B[L];z===void 0&&(z=_.clone(),B[L]=z,E.addEventListener("dispose",P)),_=z}if(_.visible=E.visible,_.wireframe=E.wireframe,S===xn?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:u[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,T.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let G=i.properties.get(_);G.light=T}return _}function v(R,E,T,S,_){if(R.visible===!1)return;if(R.layers.test(E.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&_===xn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,R.matrixWorld);let L=t.update(R),B=R.material;if(Array.isArray(B)){let z=L.groups;for(let U=0,H=z.length;U<H;U++){let V=z[U],nt=B[V.materialIndex];if(nt&&nt.visible){let $=b(R,nt,S,_);R.onBeforeShadow(i,R,E,T,L,$,V),i.renderBufferDirect(T,null,L,$,R,V),R.onAfterShadow(i,R,E,T,L,$,V)}}}else if(B.visible){let z=b(R,B,S,_);R.onBeforeShadow(i,R,E,T,L,z,null),i.renderBufferDirect(T,null,L,z,R,null),R.onAfterShadow(i,R,E,T,L,z,null)}}let G=R.children;for(let L=0,B=G.length;L<B;L++)v(G[L],E,T,S,_)}function P(R){R.target.removeEventListener("dispose",P);for(let T in c){let S=c[T],_=R.target.uuid;_ in S&&(S[_].dispose(),delete S[_])}}}var Lg={[Xr]:qr,[Yr]:Jr,[Zr]:Kr,[ui]:$r,[qr]:Xr,[Jr]:Yr,[Kr]:Zr,[$r]:ui};function Ug(i,t){function e(){let N=!1,dt=new de,Y=null,j=new de(0,0,0,0);return{setMask:function(mt){Y!==mt&&!N&&(i.colorMask(mt,mt,mt,mt),Y=mt)},setLocked:function(mt){N=mt},setClear:function(mt,ft,zt,he,Me){Me===!0&&(mt*=he,ft*=he,zt*=he),dt.set(mt,ft,zt,he),j.equals(dt)===!1&&(i.clearColor(mt,ft,zt,he),j.copy(dt))},reset:function(){N=!1,Y=null,j.set(-1,0,0,0)}}}function n(){let N=!1,dt=!1,Y=null,j=null,mt=null;return{setReversed:function(ft){if(dt!==ft){let zt=t.get("EXT_clip_control");ft?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),dt=ft;let he=mt;mt=null,this.setClear(he)}},getReversed:function(){return dt},setTest:function(ft){ft?et(i.DEPTH_TEST):ct(i.DEPTH_TEST)},setMask:function(ft){Y!==ft&&!N&&(i.depthMask(ft),Y=ft)},setFunc:function(ft){if(dt&&(ft=Lg[ft]),j!==ft){switch(ft){case Xr:i.depthFunc(i.NEVER);break;case qr:i.depthFunc(i.ALWAYS);break;case Yr:i.depthFunc(i.LESS);break;case ui:i.depthFunc(i.LEQUAL);break;case Zr:i.depthFunc(i.EQUAL);break;case $r:i.depthFunc(i.GEQUAL);break;case Jr:i.depthFunc(i.GREATER);break;case Kr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}j=ft}},setLocked:function(ft){N=ft},setClear:function(ft){mt!==ft&&(dt&&(ft=1-ft),i.clearDepth(ft),mt=ft)},reset:function(){N=!1,Y=null,j=null,mt=null,dt=!1}}}function s(){let N=!1,dt=null,Y=null,j=null,mt=null,ft=null,zt=null,he=null,Me=null;return{setTest:function(te){N||(te?et(i.STENCIL_TEST):ct(i.STENCIL_TEST))},setMask:function(te){dt!==te&&!N&&(i.stencilMask(te),dt=te)},setFunc:function(te,tn,bn){(Y!==te||j!==tn||mt!==bn)&&(i.stencilFunc(te,tn,bn),Y=te,j=tn,mt=bn)},setOp:function(te,tn,bn){(ft!==te||zt!==tn||he!==bn)&&(i.stencilOp(te,tn,bn),ft=te,zt=tn,he=bn)},setLocked:function(te){N=te},setClear:function(te){Me!==te&&(i.clearStencil(te),Me=te)},reset:function(){N=!1,dt=null,Y=null,j=null,mt=null,ft=null,zt=null,he=null,Me=null}}}let r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,p=[],g=null,y=!1,m=null,f=null,A=null,b=null,v=null,P=null,R=null,E=new Wt(0,0,0),T=0,S=!1,_=null,C=null,G=null,L=null,B=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),U=!1,H=0,V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(V)[1]),U=H>=1):V.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),U=H>=2);let nt=null,$={},it=i.getParameter(i.SCISSOR_BOX),Q=i.getParameter(i.VIEWPORT),Mt=new de().fromArray(it),q=new de().fromArray(Q);function Z(N,dt,Y,j){let mt=new Uint8Array(4),ft=i.createTexture();i.bindTexture(N,ft),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<Y;zt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,j,0,i.RGBA,i.UNSIGNED_BYTE,mt):i.texImage2D(dt+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,mt);return ft}let st={};st[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(ui),Bt(!1),Ht(Do),et(i.CULL_FACE),I(ln);function et(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function ct(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function St(N,dt){return u[N]!==dt?(i.bindFramebuffer(N,dt),u[N]=dt,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=dt),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function pt(N,dt){let Y=p,j=!1;if(N){Y=d.get(dt),Y===void 0&&(Y=[],d.set(dt,Y));let mt=N.textures;if(Y.length!==mt.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let ft=0,zt=mt.length;ft<zt;ft++)Y[ft]=i.COLOR_ATTACHMENT0+ft;Y.length=mt.length,j=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,j=!0);j&&i.drawBuffers(Y)}function Ft(N){return g!==N?(i.useProgram(N),g=N,!0):!1}let Ot={[an]:i.FUNC_ADD,[_c]:i.FUNC_SUBTRACT,[xc]:i.FUNC_REVERSE_SUBTRACT};Ot[yc]=i.MIN,Ot[vc]=i.MAX;let Ct={[Mc]:i.ZERO,[Fs]:i.ONE,[Sc]:i.SRC_COLOR,[Sr]:i.SRC_ALPHA,[Cc]:i.SRC_ALPHA_SATURATE,[Tc]:i.DST_COLOR,[wc]:i.DST_ALPHA,[bc]:i.ONE_MINUS_SRC_COLOR,[hi]:i.ONE_MINUS_SRC_ALPHA,[Ac]:i.ONE_MINUS_DST_COLOR,[Ec]:i.ONE_MINUS_DST_ALPHA,[Rc]:i.CONSTANT_COLOR,[Pc]:i.ONE_MINUS_CONSTANT_COLOR,[Ic]:i.CONSTANT_ALPHA,[Dc]:i.ONE_MINUS_CONSTANT_ALPHA};function I(N,dt,Y,j,mt,ft,zt,he,Me,te){if(N===ln){y===!0&&(ct(i.BLEND),y=!1);return}if(y===!1&&(et(i.BLEND),y=!0),N!==Wr){if(N!==m||te!==S){if((f!==an||v!==an)&&(i.blendEquation(i.FUNC_ADD),f=an,v=an),te)switch(N){case ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uo:i.blendFunc(i.ONE,i.ONE);break;case No:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Fo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uo:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case No:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Fo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}A=null,b=null,P=null,R=null,E.set(0,0,0),T=0,m=N,S=te}return}mt=mt||dt,ft=ft||Y,zt=zt||j,(dt!==f||mt!==v)&&(i.blendEquationSeparate(Ot[dt],Ot[mt]),f=dt,v=mt),(Y!==A||j!==b||ft!==P||zt!==R)&&(i.blendFuncSeparate(Ct[Y],Ct[j],Ct[ft],Ct[zt]),A=Y,b=j,P=ft,R=zt),(he.equals(E)===!1||Me!==T)&&(i.blendColor(he.r,he.g,he.b,Me),E.copy(he),T=Me),m=N,S=!1}function re(N,dt){N.side===Je?ct(i.CULL_FACE):et(i.CULL_FACE);let Y=N.side===Ie;dt&&(Y=!Y),Bt(Y),N.blending===ci&&N.transparent===!1?I(ln):I(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let j=N.stencilWrite;o.setTest(j),j&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Xt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(N){_!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),_=N)}function Ht(N){N!==pc?(et(i.CULL_FACE),N!==C&&(N===Do?i.cullFace(i.BACK):N===mc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ct(i.CULL_FACE),C=N}function bt(N){N!==G&&(U&&i.lineWidth(N),G=N)}function Xt(N,dt,Y){N?(et(i.POLYGON_OFFSET_FILL),(L!==dt||B!==Y)&&(i.polygonOffset(dt,Y),L=dt,B=Y)):ct(i.POLYGON_OFFSET_FILL)}function Et(N){N?et(i.SCISSOR_TEST):ct(i.SCISSOR_TEST)}function w(N){N===void 0&&(N=i.TEXTURE0+z-1),nt!==N&&(i.activeTexture(N),nt=N)}function x(N,dt,Y){Y===void 0&&(nt===null?Y=i.TEXTURE0+z-1:Y=nt);let j=$[Y];j===void 0&&(j={type:void 0,texture:void 0},$[Y]=j),(j.type!==N||j.texture!==dt)&&(nt!==Y&&(i.activeTexture(Y),nt=Y),i.bindTexture(N,dt||st[N]),j.type=N,j.texture=dt)}function k(){let N=$[nt];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function K(){try{i.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function tt(){try{i.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{i.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function wt(){try{i.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ut(){try{i.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _t(){try{i.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Yt(){try{i.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function at(){try{i.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xt(){try{i.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Pt(){try{i.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Dt(N){Mt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Mt.copy(N))}function yt(N){q.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),q.copy(N))}function qt(N,dt){let Y=c.get(dt);Y===void 0&&(Y=new WeakMap,c.set(dt,Y));let j=Y.get(N);j===void 0&&(j=i.getUniformBlockIndex(dt,N.name),Y.set(N,j))}function kt(N,dt){let j=c.get(dt).get(N);l.get(dt)!==j&&(i.uniformBlockBinding(dt,j,N.__bindingPointIndex),l.set(dt,j))}function se(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},nt=null,$={},u={},d=new WeakMap,p=[],g=null,y=!1,m=null,f=null,A=null,b=null,v=null,P=null,R=null,E=new Wt(0,0,0),T=0,S=!1,_=null,C=null,G=null,L=null,B=null,Mt.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:ct,bindFramebuffer:St,drawBuffers:pt,useProgram:Ft,setBlending:I,setMaterial:re,setFlipSided:Bt,setCullFace:Ht,setLineWidth:bt,setPolygonOffset:Xt,setScissorTest:Et,activeTexture:w,bindTexture:x,unbindTexture:k,compressedTexImage2D:K,compressedTexImage3D:tt,texImage2D:xt,texImage3D:Pt,updateUBOMapping:qt,uniformBlockBinding:kt,texStorage2D:Yt,texStorage3D:at,texSubImage2D:J,texSubImage3D:wt,compressedTexSubImage2D:ut,compressedTexSubImage3D:_t,scissor:Dt,viewport:yt,reset:se}}function Ng(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Nt,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,x){return p?new OffscreenCanvas(w,x):Wi("canvas")}function y(w,x,k){let K=1,tt=Et(w);if((tt.width>k||tt.height>k)&&(K=k/Math.max(tt.width,tt.height)),K<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let J=Math.floor(K*tt.width),wt=Math.floor(K*tt.height);u===void 0&&(u=g(J,wt));let ut=x?g(J,wt):u;return ut.width=J,ut.height=wt,ut.getContext("2d").drawImage(w,0,0,J,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+J+"x"+wt+")."),ut}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){i.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(w,x,k,K,tt=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let J=x;if(x===i.RED&&(k===i.FLOAT&&(J=i.R32F),k===i.HALF_FLOAT&&(J=i.R16F),k===i.UNSIGNED_BYTE&&(J=i.R8)),x===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.R8UI),k===i.UNSIGNED_SHORT&&(J=i.R16UI),k===i.UNSIGNED_INT&&(J=i.R32UI),k===i.BYTE&&(J=i.R8I),k===i.SHORT&&(J=i.R16I),k===i.INT&&(J=i.R32I)),x===i.RG&&(k===i.FLOAT&&(J=i.RG32F),k===i.HALF_FLOAT&&(J=i.RG16F),k===i.UNSIGNED_BYTE&&(J=i.RG8)),x===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RG8UI),k===i.UNSIGNED_SHORT&&(J=i.RG16UI),k===i.UNSIGNED_INT&&(J=i.RG32UI),k===i.BYTE&&(J=i.RG8I),k===i.SHORT&&(J=i.RG16I),k===i.INT&&(J=i.RG32I)),x===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RGB8UI),k===i.UNSIGNED_SHORT&&(J=i.RGB16UI),k===i.UNSIGNED_INT&&(J=i.RGB32UI),k===i.BYTE&&(J=i.RGB8I),k===i.SHORT&&(J=i.RGB16I),k===i.INT&&(J=i.RGB32I)),x===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),k===i.UNSIGNED_INT&&(J=i.RGBA32UI),k===i.BYTE&&(J=i.RGBA8I),k===i.SHORT&&(J=i.RGBA16I),k===i.INT&&(J=i.RGBA32I)),x===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),x===i.RGBA){let wt=tt?ys:$t.getTransfer(K);k===i.FLOAT&&(J=i.RGBA32F),k===i.HALF_FLOAT&&(J=i.RGBA16F),k===i.UNSIGNED_BYTE&&(J=wt===ee?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function v(w,x){let k;return w?x===null||x===cn||x===Qi?k=i.DEPTH24_STENCIL8:x===yn?k=i.DEPTH32F_STENCIL8:x===Ki&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===cn||x===Qi?k=i.DEPTH_COMPONENT24:x===yn?k=i.DEPTH_COMPONENT32F:x===Ki&&(k=i.DEPTH_COMPONENT16),k}function P(w,x){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==le&&w.minFilter!==on?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function R(w){let x=w.target;x.removeEventListener("dispose",R),T(x),x.isVideoTexture&&h.delete(x)}function E(w){let x=w.target;x.removeEventListener("dispose",E),_(x)}function T(w){let x=n.get(w);if(x.__webglInit===void 0)return;let k=w.source,K=d.get(k);if(K){let tt=K[x.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&S(w),Object.keys(K).length===0&&d.delete(k)}n.remove(w)}function S(w){let x=n.get(w);i.deleteTexture(x.__webglTexture);let k=w.source,K=d.get(k);delete K[x.__cacheKey],a.memory.textures--}function _(w){let x=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(x.__webglFramebuffer[K]))for(let tt=0;tt<x.__webglFramebuffer[K].length;tt++)i.deleteFramebuffer(x.__webglFramebuffer[K][tt]);else i.deleteFramebuffer(x.__webglFramebuffer[K]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[K])}else{if(Array.isArray(x.__webglFramebuffer))for(let K=0;K<x.__webglFramebuffer.length;K++)i.deleteFramebuffer(x.__webglFramebuffer[K]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let K=0;K<x.__webglColorRenderbuffer.length;K++)x.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[K]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let k=w.textures;for(let K=0,tt=k.length;K<tt;K++){let J=n.get(k[K]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),n.remove(k[K])}n.remove(w)}let C=0;function G(){C=0}function L(){let w=C;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),C+=1,w}function B(w){let x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function z(w,x){let k=n.get(w);if(w.isVideoTexture&&bt(w),w.isRenderTargetTexture===!1&&w.version>0&&k.__version!==w.version){let K=w.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(k,w,x);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+x)}function U(w,x){let k=n.get(w);if(w.version>0&&k.__version!==w.version){q(k,w,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+x)}function H(w,x){let k=n.get(w);if(w.version>0&&k.__version!==w.version){q(k,w,x);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+x)}function V(w,x){let k=n.get(w);if(w.version>0&&k.__version!==w.version){Z(k,w,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+x)}let nt={[br]:i.REPEAT,[Hn]:i.CLAMP_TO_EDGE,[wr]:i.MIRRORED_REPEAT},$={[le]:i.NEAREST,[Hc]:i.NEAREST_MIPMAP_NEAREST,[Bs]:i.NEAREST_MIPMAP_LINEAR,[on]:i.LINEAR,[ta]:i.LINEAR_MIPMAP_NEAREST,[$n]:i.LINEAR_MIPMAP_LINEAR},it={[Yc]:i.NEVER,[Qc]:i.ALWAYS,[Zc]:i.LESS,[$o]:i.LEQUAL,[$c]:i.EQUAL,[jc]:i.GEQUAL,[Jc]:i.GREATER,[Kc]:i.NOTEQUAL};function Q(w,x){if(x.type===yn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===on||x.magFilter===ta||x.magFilter===Bs||x.magFilter===$n||x.minFilter===on||x.minFilter===ta||x.minFilter===Bs||x.minFilter===$n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,nt[x.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,nt[x.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,nt[x.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,$[x.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,$[x.minFilter]),x.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,it[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===le||x.minFilter!==Bs&&x.minFilter!==$n||x.type===yn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Mt(w,x){let k=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",R));let K=x.source,tt=d.get(K);tt===void 0&&(tt={},d.set(K,tt));let J=B(x);if(J!==w.__cacheKey){tt[J]===void 0&&(tt[J]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),tt[J].usedTimes++;let wt=tt[w.__cacheKey];wt!==void 0&&(tt[w.__cacheKey].usedTimes--,wt.usedTimes===0&&S(x)),w.__cacheKey=J,w.__webglTexture=tt[J].texture}return k}function q(w,x,k){let K=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(K=i.TEXTURE_3D);let tt=Mt(w,x),J=x.source;e.bindTexture(K,w.__webglTexture,i.TEXTURE0+k);let wt=n.get(J);if(J.version!==wt.__version||tt===!0){e.activeTexture(i.TEXTURE0+k);let ut=$t.getPrimaries($t.workingColorSpace),_t=x.colorSpace===Ln?null:$t.getPrimaries(x.colorSpace),Yt=x.colorSpace===Ln||ut===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Yt);let at=y(x.image,!1,s.maxTextureSize);at=Xt(x,at);let xt=r.convert(x.format,x.colorSpace),Pt=r.convert(x.type),Dt=b(x.internalFormat,xt,Pt,x.colorSpace,x.isVideoTexture);Q(K,x);let yt,qt=x.mipmaps,kt=x.isVideoTexture!==!0,se=wt.__version===void 0||tt===!0,N=J.dataReady,dt=P(x,at);if(x.isDepthTexture)Dt=v(x.format===ts,x.type),se&&(kt?e.texStorage2D(i.TEXTURE_2D,1,Dt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,xt,Pt,null));else if(x.isDataTexture)if(qt.length>0){kt&&se&&e.texStorage2D(i.TEXTURE_2D,dt,Dt,qt[0].width,qt[0].height);for(let Y=0,j=qt.length;Y<j;Y++)yt=qt[Y],kt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,yt.width,yt.height,xt,Pt,yt.data):e.texImage2D(i.TEXTURE_2D,Y,Dt,yt.width,yt.height,0,xt,Pt,yt.data);x.generateMipmaps=!1}else kt?(se&&e.texStorage2D(i.TEXTURE_2D,dt,Dt,at.width,at.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,at.width,at.height,xt,Pt,at.data)):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,xt,Pt,at.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){kt&&se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Dt,qt[0].width,qt[0].height,at.depth);for(let Y=0,j=qt.length;Y<j;Y++)if(yt=qt[Y],x.format!==Ne)if(xt!==null)if(kt){if(N)if(x.layerUpdates.size>0){let mt=nl(yt.width,yt.height,x.format,x.type);for(let ft of x.layerUpdates){let zt=yt.data.subarray(ft*mt/yt.data.BYTES_PER_ELEMENT,(ft+1)*mt/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,ft,yt.width,yt.height,1,xt,zt)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,yt.width,yt.height,at.depth,xt,yt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Dt,yt.width,yt.height,at.depth,0,yt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,yt.width,yt.height,at.depth,xt,Pt,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Dt,yt.width,yt.height,at.depth,0,xt,Pt,yt.data)}else{kt&&se&&e.texStorage2D(i.TEXTURE_2D,dt,Dt,qt[0].width,qt[0].height);for(let Y=0,j=qt.length;Y<j;Y++)yt=qt[Y],x.format!==Ne?xt!==null?kt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,yt.width,yt.height,xt,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Dt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,yt.width,yt.height,xt,Pt,yt.data):e.texImage2D(i.TEXTURE_2D,Y,Dt,yt.width,yt.height,0,xt,Pt,yt.data)}else if(x.isDataArrayTexture)if(kt){if(se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Dt,at.width,at.height,at.depth),N)if(x.layerUpdates.size>0){let Y=nl(at.width,at.height,x.format,x.type);for(let j of x.layerUpdates){let mt=at.data.subarray(j*Y/at.data.BYTES_PER_ELEMENT,(j+1)*Y/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,at.width,at.height,1,xt,Pt,mt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,xt,Pt,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Dt,at.width,at.height,at.depth,0,xt,Pt,at.data);else if(x.isData3DTexture)kt?(se&&e.texStorage3D(i.TEXTURE_3D,dt,Dt,at.width,at.height,at.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,xt,Pt,at.data)):e.texImage3D(i.TEXTURE_3D,0,Dt,at.width,at.height,at.depth,0,xt,Pt,at.data);else if(x.isFramebufferTexture){if(se)if(kt)e.texStorage2D(i.TEXTURE_2D,dt,Dt,at.width,at.height);else{let Y=at.width,j=at.height;for(let mt=0;mt<dt;mt++)e.texImage2D(i.TEXTURE_2D,mt,Dt,Y,j,0,xt,Pt,null),Y>>=1,j>>=1}}else if(qt.length>0){if(kt&&se){let Y=Et(qt[0]);e.texStorage2D(i.TEXTURE_2D,dt,Dt,Y.width,Y.height)}for(let Y=0,j=qt.length;Y<j;Y++)yt=qt[Y],kt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,xt,Pt,yt):e.texImage2D(i.TEXTURE_2D,Y,Dt,xt,Pt,yt);x.generateMipmaps=!1}else if(kt){if(se){let Y=Et(at);e.texStorage2D(i.TEXTURE_2D,dt,Dt,Y.width,Y.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,xt,Pt,at)}else e.texImage2D(i.TEXTURE_2D,0,Dt,xt,Pt,at);m(x)&&f(K),wt.__version=J.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Z(w,x,k){if(x.image.length!==6)return;let K=Mt(w,x),tt=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+k);let J=n.get(tt);if(tt.version!==J.__version||K===!0){e.activeTexture(i.TEXTURE0+k);let wt=$t.getPrimaries($t.workingColorSpace),ut=x.colorSpace===Ln?null:$t.getPrimaries(x.colorSpace),_t=x.colorSpace===Ln||wt===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);let Yt=x.isCompressedTexture||x.image[0].isCompressedTexture,at=x.image[0]&&x.image[0].isDataTexture,xt=[];for(let j=0;j<6;j++)!Yt&&!at?xt[j]=y(x.image[j],!0,s.maxCubemapSize):xt[j]=at?x.image[j].image:x.image[j],xt[j]=Xt(x,xt[j]);let Pt=xt[0],Dt=r.convert(x.format,x.colorSpace),yt=r.convert(x.type),qt=b(x.internalFormat,Dt,yt,x.colorSpace),kt=x.isVideoTexture!==!0,se=J.__version===void 0||K===!0,N=tt.dataReady,dt=P(x,Pt);Q(i.TEXTURE_CUBE_MAP,x);let Y;if(Yt){kt&&se&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,qt,Pt.width,Pt.height);for(let j=0;j<6;j++){Y=xt[j].mipmaps;for(let mt=0;mt<Y.length;mt++){let ft=Y[mt];x.format!==Ne?Dt!==null?kt?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,0,0,ft.width,ft.height,Dt,ft.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,qt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,0,0,ft.width,ft.height,Dt,yt,ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,qt,ft.width,ft.height,0,Dt,yt,ft.data)}}}else{if(Y=x.mipmaps,kt&&se){Y.length>0&&dt++;let j=Et(xt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,qt,j.width,j.height)}for(let j=0;j<6;j++)if(at){kt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,xt[j].width,xt[j].height,Dt,yt,xt[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,qt,xt[j].width,xt[j].height,0,Dt,yt,xt[j].data);for(let mt=0;mt<Y.length;mt++){let zt=Y[mt].image[j].image;kt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,0,0,zt.width,zt.height,Dt,yt,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,qt,zt.width,zt.height,0,Dt,yt,zt.data)}}else{kt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Dt,yt,xt[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,qt,Dt,yt,xt[j]);for(let mt=0;mt<Y.length;mt++){let ft=Y[mt];kt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,0,0,Dt,yt,ft.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,qt,Dt,yt,ft.image[j])}}}m(x)&&f(i.TEXTURE_CUBE_MAP),J.__version=tt.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function st(w,x,k,K,tt,J){let wt=r.convert(k.format,k.colorSpace),ut=r.convert(k.type),_t=b(k.internalFormat,wt,ut,k.colorSpace),Yt=n.get(x),at=n.get(k);if(at.__renderTarget=x,!Yt.__hasExternalTextures){let xt=Math.max(1,x.width>>J),Pt=Math.max(1,x.height>>J);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,J,_t,xt,Pt,x.depth,0,wt,ut,null):e.texImage2D(tt,J,_t,xt,Pt,0,wt,ut,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Ht(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,tt,at.__webglTexture,0,Bt(x)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,tt,at.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function et(w,x,k){if(i.bindRenderbuffer(i.RENDERBUFFER,w),x.depthBuffer){let K=x.depthTexture,tt=K&&K.isDepthTexture?K.type:null,J=v(x.stencilBuffer,tt),wt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ut=Bt(x);Ht(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ut,J,x.width,x.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,J,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,J,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,w)}else{let K=x.textures;for(let tt=0;tt<K.length;tt++){let J=K[tt],wt=r.convert(J.format,J.colorSpace),ut=r.convert(J.type),_t=b(J.internalFormat,wt,ut,J.colorSpace),Yt=Bt(x);k&&Ht(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,_t,x.width,x.height):Ht(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Yt,_t,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,_t,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ct(w,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=n.get(x.depthTexture);K.__renderTarget=x,(!K.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z(x.depthTexture,0);let tt=K.__webglTexture,J=Bt(x);if(x.depthTexture.format===Hi)Ht(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0);else if(x.depthTexture.format===ts)Ht(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function St(w){let x=n.get(w),k=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){let K=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),K){let tt=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,K.removeEventListener("dispose",tt)};K.addEventListener("dispose",tt),x.__depthDisposeCallback=tt}x.__boundDepthTexture=K}if(w.depthTexture&&!x.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");ct(x.__webglFramebuffer,w)}else if(k){x.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[K]),x.__webglDepthbuffer[K]===void 0)x.__webglDepthbuffer[K]=i.createRenderbuffer(),et(x.__webglDepthbuffer[K],w,!1);else{let tt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=x.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,J)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),et(x.__webglDepthbuffer,w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,tt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(w,x,k){let K=n.get(w);x!==void 0&&st(K.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&St(w)}function Ft(w){let x=w.texture,k=n.get(w),K=n.get(x);w.addEventListener("dispose",E);let tt=w.textures,J=w.isWebGLCubeRenderTarget===!0,wt=tt.length>1;if(wt||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=x.version,a.memory.textures++),J){k.__webglFramebuffer=[];for(let ut=0;ut<6;ut++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[ut]=[];for(let _t=0;_t<x.mipmaps.length;_t++)k.__webglFramebuffer[ut][_t]=i.createFramebuffer()}else k.__webglFramebuffer[ut]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let ut=0;ut<x.mipmaps.length;ut++)k.__webglFramebuffer[ut]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(wt)for(let ut=0,_t=tt.length;ut<_t;ut++){let Yt=n.get(tt[ut]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&Ht(w)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ut=0;ut<tt.length;ut++){let _t=tt[ut];k.__webglColorRenderbuffer[ut]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ut]);let Yt=r.convert(_t.format,_t.colorSpace),at=r.convert(_t.type),xt=b(_t.internalFormat,Yt,at,_t.colorSpace,w.isXRRenderTarget===!0),Pt=Bt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,xt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,k.__webglColorRenderbuffer[ut])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),et(k.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Q(i.TEXTURE_CUBE_MAP,x);for(let ut=0;ut<6;ut++)if(x.mipmaps&&x.mipmaps.length>0)for(let _t=0;_t<x.mipmaps.length;_t++)st(k.__webglFramebuffer[ut][_t],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,_t);else st(k.__webglFramebuffer[ut],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0);m(x)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let ut=0,_t=tt.length;ut<_t;ut++){let Yt=tt[ut],at=n.get(Yt);e.bindTexture(i.TEXTURE_2D,at.__webglTexture),Q(i.TEXTURE_2D,Yt),st(k.__webglFramebuffer,w,Yt,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,0),m(Yt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ut=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ut=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,K.__webglTexture),Q(ut,x),x.mipmaps&&x.mipmaps.length>0)for(let _t=0;_t<x.mipmaps.length;_t++)st(k.__webglFramebuffer[_t],w,x,i.COLOR_ATTACHMENT0,ut,_t);else st(k.__webglFramebuffer,w,x,i.COLOR_ATTACHMENT0,ut,0);m(x)&&f(ut),e.unbindTexture()}w.depthBuffer&&St(w)}function Ot(w){let x=w.textures;for(let k=0,K=x.length;k<K;k++){let tt=x[k];if(m(tt)){let J=A(w),wt=n.get(tt).__webglTexture;e.bindTexture(J,wt),f(J),e.unbindTexture()}}}let Ct=[],I=[];function re(w){if(w.samples>0){if(Ht(w)===!1){let x=w.textures,k=w.width,K=w.height,tt=i.COLOR_BUFFER_BIT,J=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(w),ut=x.length>1;if(ut)for(let _t=0;_t<x.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let _t=0;_t<x.length;_t++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),ut){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[_t]);let Yt=n.get(x[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Yt,0)}i.blitFramebuffer(0,0,k,K,0,0,k,K,tt,i.NEAREST),l===!0&&(Ct.length=0,I.length=0,Ct.push(i.COLOR_ATTACHMENT0+_t),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Ct.push(J),I.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ct))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ut)for(let _t=0;_t<x.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,wt.__webglColorRenderbuffer[_t]);let Yt=n.get(x[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,Yt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){let x=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Bt(w){return Math.min(s.maxSamples,w.samples)}function Ht(w){let x=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function bt(w){let x=a.render.frame;h.get(w)!==x&&(h.set(w,x),w.update())}function Xt(w,x){let k=w.colorSpace,K=w.format,tt=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||k!==di&&k!==Ln&&($t.getTransfer(k)===ee?(K!==Ne||tt!==Ke)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),x}function Et(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=G,this.setTexture2D=z,this.setTexture2DArray=U,this.setTexture3D=H,this.setTextureCube=V,this.rebindTextures=pt,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=Ot,this.updateMultisampleRenderTarget=re,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=st,this.useMultisampledRTT=Ht}function Fg(i,t){function e(n,s=Ln){let r,a=$t.getTransfer(s);if(n===Ke)return i.UNSIGNED_BYTE;if(n===na)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ia)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vo)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===zo)return i.BYTE;if(n===ko)return i.SHORT;if(n===Ki)return i.UNSIGNED_SHORT;if(n===ea)return i.INT;if(n===cn)return i.UNSIGNED_INT;if(n===yn)return i.FLOAT;if(n===ji)return i.HALF_FLOAT;if(n===Ho)return i.ALPHA;if(n===Go)return i.RGB;if(n===Ne)return i.RGBA;if(n===Wo)return i.LUMINANCE;if(n===Xo)return i.LUMINANCE_ALPHA;if(n===Hi)return i.DEPTH_COMPONENT;if(n===ts)return i.DEPTH_STENCIL;if(n===qo)return i.RED;if(n===es)return i.RED_INTEGER;if(n===Yo)return i.RG;if(n===sa)return i.RG_INTEGER;if(n===ns)return i.RGBA_INTEGER;if(n===zs||n===ks||n===Vs||n===Hs)if(a===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ks)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ra||n===aa||n===oa||n===la)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ra)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===la)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ca||n===ha||n===ua)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ca||n===ha)return a===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ua)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===da||n===fa||n===pa||n===ma||n===ga||n===_a||n===xa||n===ya||n===va||n===Ma||n===Sa||n===ba||n===wa||n===Ea)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===da)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===pa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ma)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ga)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_a)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ya)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===va)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ma)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Sa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ba)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ea)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Gs||n===Ta||n===Aa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Gs)return a===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ta)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Aa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Zo||n===Ca||n===Ra||n===Pa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Gs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ca)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ra)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Pa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Og=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ml=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let s=new Pe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new ke({vertexShader:Og,fragmentShader:Bg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ee(new Is(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gl=class extends Ze{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null,y=new ml,m=e.getContextAttributes(),f=null,A=null,b=[],v=[],P=new Nt,R=null,E=new we;E.viewport=new de;let T=new we;T.viewport=new de;let S=[E,T],_=new Gr,C=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Z=b[q];return Z===void 0&&(Z=new Zi,b[q]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(q){let Z=b[q];return Z===void 0&&(Z=new Zi,b[q]=Z),Z.getGripSpace()},this.getHand=function(q){let Z=b[q];return Z===void 0&&(Z=new Zi,b[q]=Z),Z.getHandSpace()};function L(q){let Z=v.indexOf(q.inputSource);if(Z===-1)return;let st=b[Z];st!==void 0&&(st.update(q.inputSource,q.frame,c||a),st.dispatchEvent({type:q.type,data:q.inputSource}))}function B(){s.removeEventListener("select",L),s.removeEventListener("selectstart",L),s.removeEventListener("selectend",L),s.removeEventListener("squeeze",L),s.removeEventListener("squeezestart",L),s.removeEventListener("squeezeend",L),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",z);for(let q=0;q<b.length;q++){let Z=v[q];Z!==null&&(v[q]=null,b[q].disconnect(Z))}C=null,G=null,y.reset(),t.setRenderTarget(f),p=null,d=null,u=null,s=null,A=null,Mt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",L),s.addEventListener("selectstart",L),s.addEventListener("selectend",L),s.addEventListener("squeeze",L),s.addEventListener("squeezestart",L),s.addEventListener("squeezeend",L),s.addEventListener("end",B),s.addEventListener("inputsourceschange",z),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(P),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let st=null,et=null,ct=null;m.depth&&(ct=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=m.stencil?ts:Hi,et=m.stencil?Qi:cn);let St={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(St),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),A=new mn(d.textureWidth,d.textureHeight,{format:Ne,type:Ke,depthTexture:new Ps(d.textureWidth,d.textureHeight,et,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let st={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,st),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),A=new mn(p.framebufferWidth,p.framebufferHeight,{format:Ne,type:Ke,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Mt.setContext(s),Mt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function z(q){for(let Z=0;Z<q.removed.length;Z++){let st=q.removed[Z],et=v.indexOf(st);et>=0&&(v[et]=null,b[et].disconnect(st))}for(let Z=0;Z<q.added.length;Z++){let st=q.added[Z],et=v.indexOf(st);if(et===-1){for(let St=0;St<b.length;St++)if(St>=v.length){v.push(st),et=St;break}else if(v[St]===null){v[St]=st,et=St;break}if(et===-1)break}let ct=b[et];ct&&ct.connect(st)}}let U=new D,H=new D;function V(q,Z,st){U.setFromMatrixPosition(Z.matrixWorld),H.setFromMatrixPosition(st.matrixWorld);let et=U.distanceTo(H),ct=Z.projectionMatrix.elements,St=st.projectionMatrix.elements,pt=ct[14]/(ct[10]-1),Ft=ct[14]/(ct[10]+1),Ot=(ct[9]+1)/ct[5],Ct=(ct[9]-1)/ct[5],I=(ct[8]-1)/ct[0],re=(St[8]+1)/St[0],Bt=pt*I,Ht=pt*re,bt=et/(-I+re),Xt=bt*-I;if(Z.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Xt),q.translateZ(bt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),ct[10]===-1)q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{let Et=pt+bt,w=Ft+bt,x=Bt-Xt,k=Ht+(et-Xt),K=Ot*Ft/w*Et,tt=Ct*Ft/w*Et;q.projectionMatrix.makePerspective(x,k,K,tt,Et,w),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function nt(q,Z){Z===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Z.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let Z=q.near,st=q.far;y.texture!==null&&(y.depthNear>0&&(Z=y.depthNear),y.depthFar>0&&(st=y.depthFar)),_.near=T.near=E.near=Z,_.far=T.far=E.far=st,(C!==_.near||G!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),C=_.near,G=_.far),E.layers.mask=q.layers.mask|2,T.layers.mask=q.layers.mask|4,_.layers.mask=E.layers.mask|T.layers.mask;let et=q.parent,ct=_.cameras;nt(_,et);for(let St=0;St<ct.length;St++)nt(ct[St],et);ct.length===2?V(_,E,T):_.projectionMatrix.copy(E.projectionMatrix),$(q,_,et)};function $(q,Z,st){st===null?q.matrix.copy(Z.matrixWorld):(q.matrix.copy(st.matrixWorld),q.matrix.invert(),q.matrix.multiply(Z.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Gi*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(_)};let it=null;function Q(q,Z){if(h=Z.getViewerPose(c||a),g=Z,h!==null){let st=h.views;p!==null&&(t.setRenderTargetFramebuffer(A,p.framebuffer),t.setRenderTarget(A));let et=!1;st.length!==_.cameras.length&&(_.cameras.length=0,et=!0);for(let pt=0;pt<st.length;pt++){let Ft=st[pt],Ot=null;if(p!==null)Ot=p.getViewport(Ft);else{let I=u.getViewSubImage(d,Ft);Ot=I.viewport,pt===0&&(t.setRenderTargetTextures(A,I.colorTexture,I.depthStencilTexture),t.setRenderTarget(A))}let Ct=S[pt];Ct===void 0&&(Ct=new we,Ct.layers.enable(pt),Ct.viewport=new de,S[pt]=Ct),Ct.matrix.fromArray(Ft.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(Ft.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),pt===0&&(_.matrix.copy(Ct.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),et===!0&&_.cameras.push(Ct)}let ct=s.enabledFeatures;if(ct&&ct.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&u){let pt=u.getDepthInformation(st[0]);pt&&pt.isValid&&pt.texture&&y.init(t,pt,s.renderState)}}for(let st=0;st<b.length;st++){let et=v[st],ct=b[st];et!==null&&ct!==void 0&&ct.update(et,Z,c||a)}it&&it(q,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}let Mt=new Ph;Mt.setAnimationLoop(Q),this.setAnimationLoop=function(q){it=q},this.dispose=function(){}}},Mi=new Le,zg=new ie;function kg(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Qo(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,A,b,v){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,v)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),y(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,A,b):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ie&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ie&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let A=t.get(f),b=A.envMap,v=A.envMapRotation;b&&(m.envMap.value=b,Mi.copy(v),Mi.x*=-1,Mi.y*=-1,Mi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Mi.y*=-1,Mi.z*=-1),m.envMapRotation.value.setFromMatrix4(zg.makeRotationFromEuler(Mi)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,A,b){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*A,m.scale.value=b*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,A){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ie&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function y(m,f){let A=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Vg(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,b){let v=b.program;n.uniformBlockBinding(A,v)}function c(A,b){let v=s[A.id];v===void 0&&(g(A),v=h(A),s[A.id]=v,A.addEventListener("dispose",m));let P=b.program;n.updateUBOMapping(A,P);let R=t.render.frame;r[A.id]!==R&&(d(A),r[A.id]=R)}function h(A){let b=u();A.__bindingPointIndex=b;let v=i.createBuffer(),P=A.__size,R=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,P,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,v),v}function u(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(A){let b=s[A.id],v=A.uniforms,P=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let R=0,E=v.length;R<E;R++){let T=Array.isArray(v[R])?v[R]:[v[R]];for(let S=0,_=T.length;S<_;S++){let C=T[S];if(p(C,R,S,P)===!0){let G=C.__offset,L=Array.isArray(C.value)?C.value:[C.value],B=0;for(let z=0;z<L.length;z++){let U=L[z],H=y(U);typeof U=="number"||typeof U=="boolean"?(C.__data[0]=U,i.bufferSubData(i.UNIFORM_BUFFER,G+B,C.__data)):U.isMatrix3?(C.__data[0]=U.elements[0],C.__data[1]=U.elements[1],C.__data[2]=U.elements[2],C.__data[3]=0,C.__data[4]=U.elements[3],C.__data[5]=U.elements[4],C.__data[6]=U.elements[5],C.__data[7]=0,C.__data[8]=U.elements[6],C.__data[9]=U.elements[7],C.__data[10]=U.elements[8],C.__data[11]=0):(U.toArray(C.__data,B),B+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(A,b,v,P){let R=A.value,E=b+"_"+v;if(P[E]===void 0)return typeof R=="number"||typeof R=="boolean"?P[E]=R:P[E]=R.clone(),!0;{let T=P[E];if(typeof R=="number"||typeof R=="boolean"){if(T!==R)return P[E]=R,!0}else if(T.equals(R)===!1)return T.copy(R),!0}return!1}function g(A){let b=A.uniforms,v=0,P=16;for(let E=0,T=b.length;E<T;E++){let S=Array.isArray(b[E])?b[E]:[b[E]];for(let _=0,C=S.length;_<C;_++){let G=S[_],L=Array.isArray(G.value)?G.value:[G.value];for(let B=0,z=L.length;B<z;B++){let U=L[B],H=y(U),V=v%P,nt=V%H.boundary,$=V+nt;v+=nt,$!==0&&P-$<H.storage&&(v+=P-$),G.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=v,v+=H.storage}}}let R=v%P;return R>0&&(v+=P-R),A.__size=v,A.__cache={},this}function y(A){let b={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(b.boundary=4,b.storage=4):A.isVector2?(b.boundary=8,b.storage=8):A.isVector3||A.isColor?(b.boundary=16,b.storage=12):A.isVector4?(b.boundary=16,b.storage=16):A.isMatrix3?(b.boundary=48,b.storage=48):A.isMatrix4?(b.boundary=64,b.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),b}function m(A){let b=A.target;b.removeEventListener("dispose",m);let v=a.indexOf(b.__bindingPointIndex);a.splice(v,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function f(){for(let A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Fa=class{constructor(t={}){let{canvas:e=th(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let g=new Uint32Array(4),y=new Int32Array(4),m=null,f=null,A=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Dn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,P=!1;this._outputColorSpace=Re;let R=0,E=0,T=null,S=-1,_=null,C=new de,G=new de,L=null,B=new Wt(0),z=0,U=e.width,H=e.height,V=1,nt=null,$=null,it=new de(0,0,U,H),Q=new de(0,0,U,H),Mt=!1,q=new Rs,Z=!1,st=!1,et=new ie,ct=new ie,St=new D,pt=new de,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ot=!1;function Ct(){return T===null?V:1}let I=n;function re(M,F){return e.getContext(M,F)}try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"175"}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",mt,!1),e.addEventListener("webglcontextcreationerror",ft,!1),I===null){let F="webgl2";if(I=re(F,M),I===null)throw re(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Bt,Ht,bt,Xt,Et,w,x,k,K,tt,J,wt,ut,_t,Yt,at,xt,Pt,Dt,yt,qt,kt,se,N;function dt(){Bt=new rm(I),Bt.init(),kt=new Fg(I,Bt),Ht=new jp(I,Bt,t,kt),bt=new Ug(I,Bt),Ht.reverseDepthBuffer&&d&&bt.buffers.depth.setReversed(!0),Xt=new lm(I),Et=new Mg,w=new Ng(I,Bt,bt,Et,Ht,kt,Xt),x=new tm(v),k=new sm(v),K=new fd(I),se=new Jp(I,K),tt=new am(I,K,Xt,se),J=new hm(I,tt,K,Xt),Dt=new cm(I,Ht,w),at=new Qp(Et),wt=new vg(v,x,k,Bt,Ht,se,at),ut=new kg(v,Et),_t=new bg,Yt=new Rg(Bt),Pt=new $p(v,x,k,bt,J,p,l),xt=new Dg(v,J,Ht),N=new Vg(I,Xt,Ht,bt),yt=new Kp(I,Bt,Xt),qt=new om(I,Bt,Xt),Xt.programs=wt.programs,v.capabilities=Ht,v.extensions=Bt,v.properties=Et,v.renderLists=_t,v.shadowMap=xt,v.state=bt,v.info=Xt}dt();let Y=new gl(v,I);this.xr=Y,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let M=Bt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Bt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(M){M!==void 0&&(V=M,this.setSize(U,H,!1))},this.getSize=function(M){return M.set(U,H)},this.setSize=function(M,F,W=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=M,H=F,e.width=Math.floor(M*V),e.height=Math.floor(F*V),W===!0&&(e.style.width=M+"px",e.style.height=F+"px"),this.setViewport(0,0,M,F)},this.getDrawingBufferSize=function(M){return M.set(U*V,H*V).floor()},this.setDrawingBufferSize=function(M,F,W){U=M,H=F,V=W,e.width=Math.floor(M*W),e.height=Math.floor(F*W),this.setViewport(0,0,M,F)},this.getCurrentViewport=function(M){return M.copy(C)},this.getViewport=function(M){return M.copy(it)},this.setViewport=function(M,F,W,X){M.isVector4?it.set(M.x,M.y,M.z,M.w):it.set(M,F,W,X),bt.viewport(C.copy(it).multiplyScalar(V).round())},this.getScissor=function(M){return M.copy(Q)},this.setScissor=function(M,F,W,X){M.isVector4?Q.set(M.x,M.y,M.z,M.w):Q.set(M,F,W,X),bt.scissor(G.copy(Q).multiplyScalar(V).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(M){bt.setScissorTest(Mt=M)},this.setOpaqueSort=function(M){nt=M},this.setTransparentSort=function(M){$=M},this.getClearColor=function(M){return M.copy(Pt.getClearColor())},this.setClearColor=function(){Pt.setClearColor(...arguments)},this.getClearAlpha=function(){return Pt.getClearAlpha()},this.setClearAlpha=function(){Pt.setClearAlpha(...arguments)},this.clear=function(M=!0,F=!0,W=!0){let X=0;if(M){let O=!1;if(T!==null){let rt=T.texture.format;O=rt===ns||rt===sa||rt===es}if(O){let rt=T.texture.type,ht=rt===Ke||rt===cn||rt===Ki||rt===Qi||rt===na||rt===ia,gt=Pt.getClearColor(),vt=Pt.getClearAlpha(),Lt=gt.r,It=gt.g,Tt=gt.b;ht?(g[0]=Lt,g[1]=It,g[2]=Tt,g[3]=vt,I.clearBufferuiv(I.COLOR,0,g)):(y[0]=Lt,y[1]=It,y[2]=Tt,y[3]=vt,I.clearBufferiv(I.COLOR,0,y))}else X|=I.COLOR_BUFFER_BIT}F&&(X|=I.DEPTH_BUFFER_BIT),W&&(X|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",mt,!1),e.removeEventListener("webglcontextcreationerror",ft,!1),Pt.dispose(),_t.dispose(),Yt.dispose(),Et.dispose(),x.dispose(),k.dispose(),J.dispose(),se.dispose(),N.dispose(),wt.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Gl),Y.removeEventListener("sessionend",Wl),ni.stop()};function j(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function mt(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let M=Xt.autoReset,F=xt.enabled,W=xt.autoUpdate,X=xt.needsUpdate,O=xt.type;dt(),Xt.autoReset=M,xt.enabled=F,xt.autoUpdate=W,xt.needsUpdate=X,xt.type=O}function ft(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function zt(M){let F=M.target;F.removeEventListener("dispose",zt),he(F)}function he(M){Me(M),Et.remove(M)}function Me(M){let F=Et.get(M).programs;F!==void 0&&(F.forEach(function(W){wt.releaseProgram(W)}),M.isShaderMaterial&&wt.releaseShaderCache(M))}this.renderBufferDirect=function(M,F,W,X,O,rt){F===null&&(F=Ft);let ht=O.isMesh&&O.matrixWorld.determinant()<0,gt=pu(M,F,W,X,O);bt.setMaterial(X,ht);let vt=W.index,Lt=1;if(X.wireframe===!0){if(vt=tt.getWireframeAttribute(W),vt===void 0)return;Lt=2}let It=W.drawRange,Tt=W.attributes.position,Zt=It.start*Lt,jt=(It.start+It.count)*Lt;rt!==null&&(Zt=Math.max(Zt,rt.start*Lt),jt=Math.min(jt,(rt.start+rt.count)*Lt)),vt!==null?(Zt=Math.max(Zt,0),jt=Math.min(jt,vt.count)):Tt!=null&&(Zt=Math.max(Zt,0),jt=Math.min(jt,Tt.count));let fe=jt-Zt;if(fe<0||fe===1/0)return;se.setup(O,X,gt,W,vt);let ue,Jt=yt;if(vt!==null&&(ue=K.get(vt),Jt=qt,Jt.setIndex(ue)),O.isMesh)X.wireframe===!0?(bt.setLineWidth(X.wireframeLinewidth*Ct()),Jt.setMode(I.LINES)):Jt.setMode(I.TRIANGLES);else if(O.isLine){let Rt=X.linewidth;Rt===void 0&&(Rt=1),bt.setLineWidth(Rt*Ct()),O.isLineSegments?Jt.setMode(I.LINES):O.isLineLoop?Jt.setMode(I.LINE_LOOP):Jt.setMode(I.LINE_STRIP)}else O.isPoints?Jt.setMode(I.POINTS):O.isSprite&&Jt.setMode(I.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Xs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Jt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Bt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Rt=O._multiDrawStarts,ve=O._multiDrawCounts,Qt=O._multiDrawCount,en=vt?K.get(vt).bytesPerElement:1,Ai=Et.get(X).currentProgram.getUniforms();for(let Oe=0;Oe<Qt;Oe++)Ai.setValue(I,"_gl_DrawID",Oe),Jt.render(Rt[Oe]/en,ve[Oe])}else if(O.isInstancedMesh)Jt.renderInstances(Zt,fe,O.count);else if(W.isInstancedBufferGeometry){let Rt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ve=Math.min(W.instanceCount,Rt);Jt.renderInstances(Zt,fe,ve)}else Jt.render(Zt,fe)};function te(M,F,W){M.transparent===!0&&M.side===Je&&M.forceSinglePass===!1?(M.side=Ie,M.needsUpdate=!0,nr(M,F,W),M.side=In,M.needsUpdate=!0,nr(M,F,W),M.side=Je):nr(M,F,W)}this.compile=function(M,F,W=null){W===null&&(W=M),f=Yt.get(W),f.init(F),b.push(f),W.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),M!==W&&M.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();let X=new Set;return M.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let rt=O.material;if(rt)if(Array.isArray(rt))for(let ht=0;ht<rt.length;ht++){let gt=rt[ht];te(gt,W,O),X.add(gt)}else te(rt,W,O),X.add(rt)}),f=b.pop(),X},this.compileAsync=function(M,F,W=null){let X=this.compile(M,F,W);return new Promise(O=>{function rt(){if(X.forEach(function(ht){Et.get(ht).currentProgram.isReady()&&X.delete(ht)}),X.size===0){O(M);return}setTimeout(rt,10)}Bt.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let tn=null;function bn(M){tn&&tn(M)}function Gl(){ni.stop()}function Wl(){ni.start()}let ni=new Ph;ni.setAnimationLoop(bn),typeof self<"u"&&ni.setContext(self),this.setAnimationLoop=function(M){tn=M,Y.setAnimationLoop(M),M===null?ni.stop():ni.start()},Y.addEventListener("sessionstart",Gl),Y.addEventListener("sessionend",Wl),this.render=function(M,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(F),F=Y.getCamera()),M.isScene===!0&&M.onBeforeRender(v,M,F,T),f=Yt.get(M,b.length),f.init(F),b.push(f),ct.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),q.setFromProjectionMatrix(ct),st=this.localClippingEnabled,Z=at.init(this.clippingPlanes,st),m=_t.get(M,A.length),m.init(),A.push(m),Y.enabled===!0&&Y.isPresenting===!0){let rt=v.xr.getDepthSensingMesh();rt!==null&&no(rt,F,-1/0,v.sortObjects)}no(M,F,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(nt,$),Ot=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Ot&&Pt.addToRenderList(m,M),this.info.render.frame++,Z===!0&&at.beginShadows();let W=f.state.shadowsArray;xt.render(W,M,F),Z===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,O=m.transmissive;if(f.setupLights(),F.isArrayCamera){let rt=F.cameras;if(O.length>0)for(let ht=0,gt=rt.length;ht<gt;ht++){let vt=rt[ht];ql(X,O,M,vt)}Ot&&Pt.render(M);for(let ht=0,gt=rt.length;ht<gt;ht++){let vt=rt[ht];Xl(m,M,vt,vt.viewport)}}else O.length>0&&ql(X,O,M,F),Ot&&Pt.render(M),Xl(m,M,F);T!==null&&E===0&&(w.updateMultisampleRenderTarget(T),w.updateRenderTargetMipmap(T)),M.isScene===!0&&M.onAfterRender(v,M,F),se.resetDefaultState(),S=-1,_=null,b.pop(),b.length>0?(f=b[b.length-1],Z===!0&&at.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function no(M,F,W,X){if(M.visible===!1)return;if(M.layers.test(F.layers)){if(M.isGroup)W=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(F);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||q.intersectsSprite(M)){X&&pt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ct);let ht=J.update(M),gt=M.material;gt.visible&&m.push(M,ht,gt,W,pt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||q.intersectsObject(M))){let ht=J.update(M),gt=M.material;if(X&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),pt.copy(M.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),pt.copy(ht.boundingSphere.center)),pt.applyMatrix4(M.matrixWorld).applyMatrix4(ct)),Array.isArray(gt)){let vt=ht.groups;for(let Lt=0,It=vt.length;Lt<It;Lt++){let Tt=vt[Lt],Zt=gt[Tt.materialIndex];Zt&&Zt.visible&&m.push(M,ht,Zt,W,pt.z,Tt)}}else gt.visible&&m.push(M,ht,gt,W,pt.z,null)}}let rt=M.children;for(let ht=0,gt=rt.length;ht<gt;ht++)no(rt[ht],F,W,X)}function Xl(M,F,W,X){let O=M.opaque,rt=M.transmissive,ht=M.transparent;f.setupLightsView(W),Z===!0&&at.setGlobalState(v.clippingPlanes,W),X&&bt.viewport(C.copy(X)),O.length>0&&er(O,F,W),rt.length>0&&er(rt,F,W),ht.length>0&&er(ht,F,W),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function ql(M,F,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new mn(1,1,{generateMipmaps:!0,type:Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float")?ji:Ke,minFilter:$n,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));let rt=f.state.transmissionRenderTarget[X.id],ht=X.viewport||C;rt.setSize(ht.z*v.transmissionResolutionScale,ht.w*v.transmissionResolutionScale);let gt=v.getRenderTarget();v.setRenderTarget(rt),v.getClearColor(B),z=v.getClearAlpha(),z<1&&v.setClearColor(16777215,.5),v.clear(),Ot&&Pt.render(W);let vt=v.toneMapping;v.toneMapping=Dn;let Lt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),Z===!0&&at.setGlobalState(v.clippingPlanes,X),er(M,W,X),w.updateMultisampleRenderTarget(rt),w.updateRenderTargetMipmap(rt),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let Tt=0,Zt=F.length;Tt<Zt;Tt++){let jt=F[Tt],fe=jt.object,ue=jt.geometry,Jt=jt.material,Rt=jt.group;if(Jt.side===Je&&fe.layers.test(X.layers)){let ve=Jt.side;Jt.side=Ie,Jt.needsUpdate=!0,Yl(fe,W,X,ue,Jt,Rt),Jt.side=ve,Jt.needsUpdate=!0,It=!0}}It===!0&&(w.updateMultisampleRenderTarget(rt),w.updateRenderTargetMipmap(rt))}v.setRenderTarget(gt),v.setClearColor(B,z),Lt!==void 0&&(X.viewport=Lt),v.toneMapping=vt}function er(M,F,W){let X=F.isScene===!0?F.overrideMaterial:null;for(let O=0,rt=M.length;O<rt;O++){let ht=M[O],gt=ht.object,vt=ht.geometry,Lt=ht.group,It=ht.material;It.allowOverride===!0&&X!==null&&(It=X),gt.layers.test(W.layers)&&Yl(gt,F,W,vt,It,Lt)}}function Yl(M,F,W,X,O,rt){M.onBeforeRender(v,F,W,X,O,rt),M.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),O.onBeforeRender(v,F,W,X,M,rt),O.transparent===!0&&O.side===Je&&O.forceSinglePass===!1?(O.side=Ie,O.needsUpdate=!0,v.renderBufferDirect(W,F,X,O,M,rt),O.side=In,O.needsUpdate=!0,v.renderBufferDirect(W,F,X,O,M,rt),O.side=Je):v.renderBufferDirect(W,F,X,O,M,rt),M.onAfterRender(v,F,W,X,O,rt)}function nr(M,F,W){F.isScene!==!0&&(F=Ft);let X=Et.get(M),O=f.state.lights,rt=f.state.shadowsArray,ht=O.state.version,gt=wt.getParameters(M,O.state,rt,F,W),vt=wt.getProgramCacheKey(gt),Lt=X.programs;X.environment=M.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(M.isMeshStandardMaterial?k:x).get(M.envMap||X.environment),X.envMapRotation=X.environment!==null&&M.envMap===null?F.environmentRotation:M.envMapRotation,Lt===void 0&&(M.addEventListener("dispose",zt),Lt=new Map,X.programs=Lt);let It=Lt.get(vt);if(It!==void 0){if(X.currentProgram===It&&X.lightsStateVersion===ht)return $l(M,gt),It}else gt.uniforms=wt.getUniforms(M),M.onBeforeCompile(gt,v),It=wt.acquireProgram(gt,vt),Lt.set(vt,It),X.uniforms=gt.uniforms;let Tt=X.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Tt.clippingPlanes=at.uniform),$l(M,gt),X.needsLights=gu(M),X.lightsStateVersion=ht,X.needsLights&&(Tt.ambientLightColor.value=O.state.ambient,Tt.lightProbe.value=O.state.probe,Tt.directionalLights.value=O.state.directional,Tt.directionalLightShadows.value=O.state.directionalShadow,Tt.spotLights.value=O.state.spot,Tt.spotLightShadows.value=O.state.spotShadow,Tt.rectAreaLights.value=O.state.rectArea,Tt.ltc_1.value=O.state.rectAreaLTC1,Tt.ltc_2.value=O.state.rectAreaLTC2,Tt.pointLights.value=O.state.point,Tt.pointLightShadows.value=O.state.pointShadow,Tt.hemisphereLights.value=O.state.hemi,Tt.directionalShadowMap.value=O.state.directionalShadowMap,Tt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Tt.spotShadowMap.value=O.state.spotShadowMap,Tt.spotLightMatrix.value=O.state.spotLightMatrix,Tt.spotLightMap.value=O.state.spotLightMap,Tt.pointShadowMap.value=O.state.pointShadowMap,Tt.pointShadowMatrix.value=O.state.pointShadowMatrix),X.currentProgram=It,X.uniformsList=null,It}function Zl(M){if(M.uniformsList===null){let F=M.currentProgram.getUniforms();M.uniformsList=as.seqWithValue(F.seq,M.uniforms)}return M.uniformsList}function $l(M,F){let W=Et.get(M);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function pu(M,F,W,X,O){F.isScene!==!0&&(F=Ft),w.resetTextureUnits();let rt=F.fog,ht=X.isMeshStandardMaterial?F.environment:null,gt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:di,vt=(X.isMeshStandardMaterial?k:x).get(X.envMap||ht),Lt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,It=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Tt=!!W.morphAttributes.position,Zt=!!W.morphAttributes.normal,jt=!!W.morphAttributes.color,fe=Dn;X.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(fe=v.toneMapping);let ue=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Jt=ue!==void 0?ue.length:0,Rt=Et.get(X),ve=f.state.lights;if(Z===!0&&(st===!0||M!==_)){let Ae=M===_&&X.id===S;at.setState(X,M,Ae)}let Qt=!1;X.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==ve.state.version||Rt.outputColorSpace!==gt||O.isBatchedMesh&&Rt.batching===!1||!O.isBatchedMesh&&Rt.batching===!0||O.isBatchedMesh&&Rt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Rt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Rt.instancing===!1||!O.isInstancedMesh&&Rt.instancing===!0||O.isSkinnedMesh&&Rt.skinning===!1||!O.isSkinnedMesh&&Rt.skinning===!0||O.isInstancedMesh&&Rt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Rt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Rt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Rt.instancingMorph===!1&&O.morphTexture!==null||Rt.envMap!==vt||X.fog===!0&&Rt.fog!==rt||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==at.numPlanes||Rt.numIntersection!==at.numIntersection)||Rt.vertexAlphas!==Lt||Rt.vertexTangents!==It||Rt.morphTargets!==Tt||Rt.morphNormals!==Zt||Rt.morphColors!==jt||Rt.toneMapping!==fe||Rt.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,Rt.__version=X.version);let en=Rt.currentProgram;Qt===!0&&(en=nr(X,F,O));let Ai=!1,Oe=!1,us=!1,ce=en.getUniforms(),We=Rt.uniforms;if(bt.useProgram(en.program)&&(Ai=!0,Oe=!0,us=!0),X.id!==S&&(S=X.id,Oe=!0),Ai||_!==M){bt.buffers.depth.getReversed()?(et.copy(M.projectionMatrix),nh(et),ih(et),ce.setValue(I,"projectionMatrix",et)):ce.setValue(I,"projectionMatrix",M.projectionMatrix),ce.setValue(I,"viewMatrix",M.matrixWorldInverse);let De=ce.map.cameraPosition;De!==void 0&&De.setValue(I,St.setFromMatrixPosition(M.matrixWorld)),Ht.logarithmicDepthBuffer&&ce.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ce.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),_!==M&&(_=M,Oe=!0,us=!0)}if(O.isSkinnedMesh){ce.setOptional(I,O,"bindMatrix"),ce.setOptional(I,O,"bindMatrixInverse");let Ae=O.skeleton;Ae&&(Ae.boneTexture===null&&Ae.computeBoneTexture(),ce.setValue(I,"boneTexture",Ae.boneTexture,w))}O.isBatchedMesh&&(ce.setOptional(I,O,"batchingTexture"),ce.setValue(I,"batchingTexture",O._matricesTexture,w),ce.setOptional(I,O,"batchingIdTexture"),ce.setValue(I,"batchingIdTexture",O._indirectTexture,w),ce.setOptional(I,O,"batchingColorTexture"),O._colorsTexture!==null&&ce.setValue(I,"batchingColorTexture",O._colorsTexture,w));let Xe=W.morphAttributes;if((Xe.position!==void 0||Xe.normal!==void 0||Xe.color!==void 0)&&Dt.update(O,W,en),(Oe||Rt.receiveShadow!==O.receiveShadow)&&(Rt.receiveShadow=O.receiveShadow,ce.setValue(I,"receiveShadow",O.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(We.envMap.value=vt,We.flipEnvMap.value=vt.isCubeTexture&&vt.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(We.envMapIntensity.value=F.environmentIntensity),Oe&&(ce.setValue(I,"toneMappingExposure",v.toneMappingExposure),Rt.needsLights&&mu(We,us),rt&&X.fog===!0&&ut.refreshFogUniforms(We,rt),ut.refreshMaterialUniforms(We,X,V,H,f.state.transmissionRenderTarget[M.id]),as.upload(I,Zl(Rt),We,w)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(as.upload(I,Zl(Rt),We,w),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ce.setValue(I,"center",O.center),ce.setValue(I,"modelViewMatrix",O.modelViewMatrix),ce.setValue(I,"normalMatrix",O.normalMatrix),ce.setValue(I,"modelMatrix",O.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let Ae=X.uniformsGroups;for(let De=0,io=Ae.length;De<io;De++){let ii=Ae[De];N.update(ii,en),N.bind(ii,en)}}return en}function mu(M,F){M.ambientLightColor.needsUpdate=F,M.lightProbe.needsUpdate=F,M.directionalLights.needsUpdate=F,M.directionalLightShadows.needsUpdate=F,M.pointLights.needsUpdate=F,M.pointLightShadows.needsUpdate=F,M.spotLights.needsUpdate=F,M.spotLightShadows.needsUpdate=F,M.rectAreaLights.needsUpdate=F,M.hemisphereLights.needsUpdate=F}function gu(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(M,F,W){let X=Et.get(M);X.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Et.get(M.texture).__webglTexture=F,Et.get(M.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,F){let W=Et.get(M);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0};let _u=I.createFramebuffer();this.setRenderTarget=function(M,F=0,W=0){T=M,R=F,E=W;let X=!0,O=null,rt=!1,ht=!1;if(M){let vt=Et.get(M);if(vt.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(I.FRAMEBUFFER,null),X=!1;else if(vt.__webglFramebuffer===void 0)w.setupRenderTarget(M);else if(vt.__hasExternalTextures)w.rebindTextures(M,Et.get(M.texture).__webglTexture,Et.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Tt=M.depthTexture;if(vt.__boundDepthTexture!==Tt){if(Tt!==null&&Et.has(Tt)&&(M.width!==Tt.image.width||M.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(M)}}let Lt=M.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(ht=!0);let It=Et.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(It[F])?O=It[F][W]:O=It[F],rt=!0):M.samples>0&&w.useMultisampledRTT(M)===!1?O=Et.get(M).__webglMultisampledFramebuffer:Array.isArray(It)?O=It[W]:O=It,C.copy(M.viewport),G.copy(M.scissor),L=M.scissorTest}else C.copy(it).multiplyScalar(V).floor(),G.copy(Q).multiplyScalar(V).floor(),L=Mt;if(W!==0&&(O=_u),bt.bindFramebuffer(I.FRAMEBUFFER,O)&&X&&bt.drawBuffers(M,O),bt.viewport(C),bt.scissor(G),bt.setScissorTest(L),rt){let vt=Et.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,vt.__webglTexture,W)}else if(ht){let vt=Et.get(M.texture),Lt=F;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,vt.__webglTexture,W,Lt)}else if(M!==null&&W!==0){let vt=Et.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,vt.__webglTexture,W)}S=-1},this.readRenderTargetPixels=function(M,F,W,X,O,rt,ht){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=Et.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ht!==void 0&&(gt=gt[ht]),gt){bt.bindFramebuffer(I.FRAMEBUFFER,gt);try{let vt=M.texture,Lt=vt.format,It=vt.type;if(!Ht.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=M.width-X&&W>=0&&W<=M.height-O&&I.readPixels(F,W,X,O,kt.convert(Lt),kt.convert(It),rt)}finally{let vt=T!==null?Et.get(T).__webglFramebuffer:null;bt.bindFramebuffer(I.FRAMEBUFFER,vt)}}},this.readRenderTargetPixelsAsync=async function(M,F,W,X,O,rt,ht){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=Et.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ht!==void 0&&(gt=gt[ht]),gt)if(F>=0&&F<=M.width-X&&W>=0&&W<=M.height-O){bt.bindFramebuffer(I.FRAMEBUFFER,gt);let vt=M.texture,Lt=vt.format,It=vt.type;if(!Ht.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Tt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Tt),I.bufferData(I.PIXEL_PACK_BUFFER,rt.byteLength,I.STREAM_READ),I.readPixels(F,W,X,O,kt.convert(Lt),kt.convert(It),0);let Zt=T!==null?Et.get(T).__webglFramebuffer:null;bt.bindFramebuffer(I.FRAMEBUFFER,Zt);let jt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await eh(I,jt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Tt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,rt),I.deleteBuffer(Tt),I.deleteSync(jt),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,F=null,W=0){let X=Math.pow(2,-W),O=Math.floor(M.image.width*X),rt=Math.floor(M.image.height*X),ht=F!==null?F.x:0,gt=F!==null?F.y:0;w.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,ht,gt,O,rt),bt.unbindTexture()};let xu=I.createFramebuffer(),yu=I.createFramebuffer();this.copyTextureToTexture=function(M,F,W=null,X=null,O=0,rt=null){rt===null&&(O!==0?(Xs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),rt=O,O=0):rt=0);let ht,gt,vt,Lt,It,Tt,Zt,jt,fe,ue=M.isCompressedTexture?M.mipmaps[rt]:M.image;if(W!==null)ht=W.max.x-W.min.x,gt=W.max.y-W.min.y,vt=W.isBox3?W.max.z-W.min.z:1,Lt=W.min.x,It=W.min.y,Tt=W.isBox3?W.min.z:0;else{let Xe=Math.pow(2,-O);ht=Math.floor(ue.width*Xe),gt=Math.floor(ue.height*Xe),M.isDataArrayTexture?vt=ue.depth:M.isData3DTexture?vt=Math.floor(ue.depth*Xe):vt=1,Lt=0,It=0,Tt=0}X!==null?(Zt=X.x,jt=X.y,fe=X.z):(Zt=0,jt=0,fe=0);let Jt=kt.convert(F.format),Rt=kt.convert(F.type),ve;F.isData3DTexture?(w.setTexture3D(F,0),ve=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(w.setTexture2DArray(F,0),ve=I.TEXTURE_2D_ARRAY):(w.setTexture2D(F,0),ve=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);let Qt=I.getParameter(I.UNPACK_ROW_LENGTH),en=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ai=I.getParameter(I.UNPACK_SKIP_PIXELS),Oe=I.getParameter(I.UNPACK_SKIP_ROWS),us=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ue.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ue.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Lt),I.pixelStorei(I.UNPACK_SKIP_ROWS,It),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Tt);let ce=M.isDataArrayTexture||M.isData3DTexture,We=F.isDataArrayTexture||F.isData3DTexture;if(M.isDepthTexture){let Xe=Et.get(M),Ae=Et.get(F),De=Et.get(Xe.__renderTarget),io=Et.get(Ae.__renderTarget);bt.bindFramebuffer(I.READ_FRAMEBUFFER,De.__webglFramebuffer),bt.bindFramebuffer(I.DRAW_FRAMEBUFFER,io.__webglFramebuffer);for(let ii=0;ii<vt;ii++)ce&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Et.get(M).__webglTexture,O,Tt+ii),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Et.get(F).__webglTexture,rt,fe+ii)),I.blitFramebuffer(Lt,It,ht,gt,Zt,jt,ht,gt,I.DEPTH_BUFFER_BIT,I.NEAREST);bt.bindFramebuffer(I.READ_FRAMEBUFFER,null),bt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(O!==0||M.isRenderTargetTexture||Et.has(M)){let Xe=Et.get(M),Ae=Et.get(F);bt.bindFramebuffer(I.READ_FRAMEBUFFER,xu),bt.bindFramebuffer(I.DRAW_FRAMEBUFFER,yu);for(let De=0;De<vt;De++)ce?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Xe.__webglTexture,O,Tt+De):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Xe.__webglTexture,O),We?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ae.__webglTexture,rt,fe+De):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ae.__webglTexture,rt),O!==0?I.blitFramebuffer(Lt,It,ht,gt,Zt,jt,ht,gt,I.COLOR_BUFFER_BIT,I.NEAREST):We?I.copyTexSubImage3D(ve,rt,Zt,jt,fe+De,Lt,It,ht,gt):I.copyTexSubImage2D(ve,rt,Zt,jt,Lt,It,ht,gt);bt.bindFramebuffer(I.READ_FRAMEBUFFER,null),bt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else We?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(ve,rt,Zt,jt,fe,ht,gt,vt,Jt,Rt,ue.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(ve,rt,Zt,jt,fe,ht,gt,vt,Jt,ue.data):I.texSubImage3D(ve,rt,Zt,jt,fe,ht,gt,vt,Jt,Rt,ue):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,rt,Zt,jt,ht,gt,Jt,Rt,ue.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,rt,Zt,jt,ue.width,ue.height,Jt,ue.data):I.texSubImage2D(I.TEXTURE_2D,rt,Zt,jt,ht,gt,Jt,Rt,ue);I.pixelStorei(I.UNPACK_ROW_LENGTH,Qt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,en),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ai),I.pixelStorei(I.UNPACK_SKIP_ROWS,Oe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,us),rt===0&&F.generateMipmaps&&I.generateMipmap(ve),bt.unbindTexture()},this.copyTextureToTexture3D=function(M,F,W=null,X=null,O=0){return Xs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,F,W,X,O)},this.initRenderTarget=function(M){Et.get(M).__webglFramebuffer===void 0&&w.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?w.setTextureCube(M,0):M.isData3DTexture?w.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?w.setTexture2DArray(M,0):w.setTexture2D(M,0),bt.unbindTexture()},this.resetState=function(){R=0,E=0,T=null,bt.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}};var Nh={type:"change"},yl={type:"start"},Oh={type:"end"},za=new qi,Fh=new Ye,Hg=Math.cos(70*Ko.DEG2RAD),_e=new D,Fe=2*Math.PI,ne={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},xl=1e-6,ka=class extends Ns{constructor(t,e=null){super(t,e),this.state=ne.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Yn.ROTATE,MIDDLE:Yn.DOLLY,RIGHT:Yn.PAN},this.touches={ONE:Zn.ROTATE,TWO:Zn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new ye,this._lastTargetPosition=new D,this._quat=new ye().setFromUnitVectors(t.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ji,this._sphericalDelta=new Ji,this._scale=1,this._panOffset=new D,this._rotateStart=new Nt,this._rotateEnd=new Nt,this._rotateDelta=new Nt,this._panStart=new Nt,this._panEnd=new Nt,this._panDelta=new Nt,this._dollyStart=new Nt,this._dollyEnd=new Nt,this._dollyDelta=new Nt,this._dollyDirection=new D,this._mouse=new Nt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Wg.bind(this),this._onPointerDown=Gg.bind(this),this._onPointerUp=Xg.bind(this),this._onContextMenu=jg.bind(this),this._onMouseWheel=Zg.bind(this),this._onKeyDown=$g.bind(this),this._onTouchStart=Jg.bind(this),this._onTouchMove=Kg.bind(this),this._onMouseDown=qg.bind(this),this._onMouseMove=Yg.bind(this),this._interceptControlDown=Qg.bind(this),this._interceptControlUp=t_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Nh),this.update(),this.state=ne.NONE}update(t=null){let e=this.object.position;_e.copy(e).sub(this.target),_e.applyQuaternion(this._quat),this._spherical.setFromVector3(_e),this.autoRotate&&this.state===ne.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Fe:n>Math.PI&&(n-=Fe),s<-Math.PI?s+=Fe:s>Math.PI&&(s-=Fe),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(_e.setFromSpherical(this._spherical),_e.applyQuaternion(this._quatInverse),e.copy(this.target).add(_e),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=_e.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let o=new D(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=_e.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(za.origin.copy(this.object.position),za.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(za.direction))<Hg?this.object.lookAt(this.target):(Fh.setFromNormalAndCoplanarPoint(this.object.up,this.target),za.intersectPlane(Fh,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>xl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>xl||this._lastTargetPosition.distanceToSquared(this.target)>xl?(this.dispatchEvent(Nh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Fe/60*this.autoRotateSpeed*t:Fe/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){_e.setFromMatrixColumn(e,0),_e.multiplyScalar(-t),this._panOffset.add(_e)}_panUp(t,e){this.screenSpacePanning===!0?_e.setFromMatrixColumn(e,1):(_e.setFromMatrixColumn(e,0),_e.crossVectors(this.object.up,_e)),_e.multiplyScalar(t),this._panOffset.add(_e)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;_e.copy(s).sub(this.target);let r=_e.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Fe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Fe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Fe*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Fe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Fe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Nt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Gg(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Wg(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Xg(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Oh),this.state=ne.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function qg(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Yn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ne.DOLLY;break;case Yn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ne.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ne.ROTATE}break;case Yn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ne.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ne.PAN}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(yl)}function Yg(i){switch(this.state){case ne.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ne.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ne.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Zg(i){this.enabled===!1||this.enableZoom===!1||this.state!==ne.NONE||(i.preventDefault(),this.dispatchEvent(yl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Oh))}function $g(i){this.enabled!==!1&&this._handleKeyDown(i)}function Jg(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Zn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ne.TOUCH_ROTATE;break;case Zn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ne.TOUCH_PAN;break;default:this.state=ne.NONE}break;case 2:switch(this.touches.TWO){case Zn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ne.TOUCH_DOLLY_PAN;break;case Zn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ne.TOUCH_DOLLY_ROTATE;break;default:this.state=ne.NONE}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(yl)}function Kg(i){switch(this._trackPointer(i),this.state){case ne.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ne.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ne.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ne.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ne.NONE}}function jg(i){this.enabled!==!1&&i.preventDefault()}function Qg(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function t_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var e_=Object.defineProperty,n_=(i,t,e)=>t in i?e_(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,ot=(i,t,e)=>n_(i,typeof t!="symbol"?t+"":t,e),$s=class i{constructor(){ot(this,"min",new D(1/0,1/0,1/0)),ot(this,"max",new D(-1/0,-1/0,-1/0)),ot(this,"center",new D),ot(this,"halfExtents",new D)}reset(){this.min.set(1/0,1/0,1/0),this.max.set(-1/0,-1/0,-1/0),this.center.set(0,0,0),this.halfExtents.set(0,0,0)}expandByPoint(t){this.min.x=Math.min(this.min.x,t.x),this.min.y=Math.min(this.min.y,t.y),this.min.z=Math.min(this.min.z,t.z),this.max.x=Math.max(this.max.x,t.x),this.max.y=Math.max(this.max.y,t.y),this.max.z=Math.max(this.max.z,t.z),this.updateDerived()}expandByBox(t){this.min.x=Math.min(this.min.x,t.min.x),this.min.y=Math.min(this.min.y,t.min.y),this.min.z=Math.min(this.min.z,t.min.z),this.max.x=Math.max(this.max.x,t.max.x),this.max.y=Math.max(this.max.y,t.max.y),this.max.z=Math.max(this.max.z,t.max.z),this.updateDerived()}updateDerived(){this.center.addVectors(this.min,this.max).multiplyScalar(.5),this.halfExtents.subVectors(this.max,this.min).multiplyScalar(.5)}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}toBox3(){return new gn().set(this.min,this.max)}clone(){let t=new i;return t.min.copy(this.min),t.max.copy(this.max),t.center.copy(this.center),t.halfExtents.copy(this.halfExtents),t}},wl=class{constructor(t=0){ot(this,"numSplats",0),ot(this,"positions"),ot(this,"rotations"),ot(this,"scales"),ot(this,"colors"),ot(this,"opacities"),ot(this,"boundingBox",new $s),this.numSplats=t,this.allocateBuffers(t)}allocateBuffers(t){this.positions=new Float32Array(t*3),this.rotations=new Float32Array(t*4),this.scales=new Float32Array(t*3),this.colors=new Float32Array(t*3),this.opacities=new Float32Array(t)}setSplat(t,e,n,s,r,a){if(t>=this.numSplats)throw new Error(`Splat index out of bounds: ${t} >= ${this.numSplats}`);let o=t*3,l=t*4,c=t*3,h=t*3;this.positions[o]=e.x,this.positions[o+1]=e.y,this.positions[o+2]=e.z,this.rotations[l]=n.x,this.rotations[l+1]=n.y,this.rotations[l+2]=n.z,this.rotations[l+3]=n.w,this.scales[c]=s.x,this.scales[c+1]=s.y,this.scales[c+2]=s.z,this.colors[h]=r.r,this.colors[h+1]=r.g,this.colors[h+2]=r.b,this.opacities[t]=a}getSplat(t){if(t>=this.numSplats)throw new Error(`Splat index out of bounds: ${t} >= ${this.numSplats}`);let e=t*3,n=t*4,s=t*3,r=t*3;return{position:new D(this.positions[e],this.positions[e+1],this.positions[e+2]),rotation:new ye(this.rotations[n],this.rotations[n+1],this.rotations[n+2],this.rotations[n+3]),scale:new D(Math.exp(this.scales[s]),Math.exp(this.scales[s+1]),Math.exp(this.scales[s+2])),color:new Wt(this.colors[r],this.colors[r+1],this.colors[r+2]),opacity:this.opacities[t]}}calculateBoundingBox(){this.boundingBox.reset();let t=new D;for(let e=0;e<this.numSplats;e++){let n=e*3;t.set(this.positions[n],this.positions[n+1],this.positions[n+2]),this.boundingBox.expandByPoint(t)}return this.boundingBox}createDebugGeometry(){let t=new Ue;t.setAttribute("position",new oe(this.positions,3));let e=new Float32Array(this.numSplats*3),n=new ye,s=new Le;for(let r=0;r<this.numSplats;r++){let a=r*4,o=r*3;n.set(this.rotations[a],this.rotations[a+1],this.rotations[a+2],this.rotations[a+3]),s.setFromQuaternion(n),e[o]=s.x,e[o+1]=s.y,e[o+2]=s.z}return t.setAttribute("rotation",new oe(e,3)),t.setAttribute("scale",new oe(this.scales,3)),t.setAttribute("color",new oe(this.colors,3)),t.setAttribute("opacity",new oe(this.opacities,1)),t}dispose(){this.numSplats=0,this.scales=new Float32Array(0),this.colors=new Float32Array(0),this.positions=new Float32Array(0),this.rotations=new Float32Array(0),this.opacities=new Float32Array(0)}},Ha=class{constructor(t,e,n){ot(this,"ranges"),ot(this,"version",1),ot(this,"numSplats",0),ot(this,"boundingBox",new $s),ot(this,"sh0"),ot(this,"quats"),ot(this,"scales"),ot(this,"means_l"),ot(this,"means_u"),this.ranges=e,this.numSplats=t,this.sh0=n.sh0,this.quats=n.quats,this.scales=n.scales,this.means_l=n.means_l,this.means_u=n.means_u,this.boundingBox=this.calculateBoundingBox()}calculateBoundingBox(){this.boundingBox.reset();let{mins:t,maxs:e}=this.ranges.means,n=s=>Math.sign(s)*(Math.exp(Math.abs(s))-1);return this.boundingBox.center.set((n(t[0])+n(e[0]))*.5,(n(t[1])+n(e[1]))*.5,(n(t[2])+n(e[2]))*.5),this.boundingBox.halfExtents.set((n(e[0])-n(t[0]))*.5,(n(e[1])-n(t[1]))*.5,(n(e[2])-n(t[2]))*.5),this.boundingBox}dispose(){this.sh0.dispose(),this.quats.dispose(),this.scales.dispose(),this.means_l.dispose(),this.means_u.dispose()}},Ga=class{constructor(t,e,n){ot(this,"ranges"),ot(this,"version",2),ot(this,"numSplats",0),ot(this,"boundingBox",new $s),ot(this,"sh0"),ot(this,"quats"),ot(this,"scales"),ot(this,"means_l"),ot(this,"means_u"),this.ranges=e,this.numSplats=t,this.sh0=n.sh0,this.quats=n.quats,this.scales=n.scales,this.means_l=n.means_l,this.means_u=n.means_u,this.boundingBox=this.calculateBoundingBox()}calculateBoundingBox(){this.boundingBox.reset();let{mins:t,maxs:e}=this.ranges.means,n=s=>Math.sign(s)*(Math.exp(Math.abs(s))-1);return this.boundingBox.center.set((n(t[0])+n(e[0]))*.5,(n(t[1])+n(e[1]))*.5,(n(t[2])+n(e[2]))*.5),this.boundingBox.halfExtents.set((n(e[0])-n(t[0]))*.5,(n(e[1])-n(t[1]))*.5,(n(e[2])-n(t[2]))*.5),this.boundingBox}dispose(){this.sh0.dispose(),this.quats.dispose(),this.scales.dispose(),this.means_l.dispose(),this.means_u.dispose()}},Ys=class{constructor(t,e,n,s,r,a,o,l){ot(this,"numSplats"),ot(this,"textureWidth"),ot(this,"textureHeight"),ot(this,"ranges"),ot(this,"centers"),ot(this,"boundingBox"),ot(this,"packedColor"),ot(this,"packedGeometry"),this.numSplats=t,this.textureWidth=e,this.textureHeight=n,this.boundingBox=l,this.ranges=o,this.centers=s,this.packedColor=a,this.packedGeometry=r}dispose(){this.centers=new Float32Array(0),this.packedColor=new Uint8Array(0),this.packedGeometry=new Uint32Array(0)}},El=class extends Ze{constructor(){super(),ot(this,"worker"),ot(this,"centers",null),ot(this,"orderTexture",null),ot(this,"chunks",null),ot(this,"lastCameraPosition",new D),ot(this,"lastCameraDirection",new D);let t=this.createWorkerCode(),e=new Blob([t],{type:"application/javascript"});this.worker=new Worker(URL.createObjectURL(e)),this.worker.onmessage=this.onWorkerMessage.bind(this)}onWorkerMessage(t){if(!this.orderTexture||!this.orderTexture.image)return console.error("SplatSorter: Order texture not initialized!");let{order:e,count:n}=t.data,s=this.orderTexture.image.data;if(!(s instanceof Uint32Array))return console.error("SplatSorter: Order texture data is not a Uint32Array!");s.set(new Uint32Array(e)),this.orderTexture.source.data.updateRanges||(this.orderTexture.source.data.updateRanges=[]),this.orderTexture.needsUpdate=!0;let r=s.buffer.slice(0),a={order:r};this.worker.postMessage(a,[r]),this.dispatchEvent({type:"updated",count:n})}init(t,e,n,s=!1){if(!t||!(t.image.data instanceof Uint32Array))throw new Error("SplatSorter: Invalid orderTexture provided. Must be DataTexture with Uint32Array data.");if(!e||e.length%3!==0)throw new Error("SplatSorter: Invalid centers array provided. Length must be multiple of 3.");if(t.image.data.length<e.length/3)throw new Error("SplatSorter: orderTexture data buffer is smaller than the number of splats.");if(e.buffer.byteLength===0)throw new Error("SplatSorter: positions buffer is detached (likely React StrictMode + cached asset). ");let r=e.length/3;this.orderTexture=t,s?this.centers=null:this.centers=e.slice();let a=this.orderTexture.image.data;for(let u=0;u<r;u++)a[u]=u;this.orderTexture.source.data.updateRanges||(this.orderTexture.source.data.updateRanges=[]),this.orderTexture.needsUpdate=!0;let o=a.buffer.slice(0),l=s?e.buffer:e.buffer.slice(0),c={order:o,centers:l},h=[o,l];if(n){this.chunks=n.slice();let u=this.chunks.buffer.slice(0);c.chunks=u,h.push(u)}this.worker.postMessage(c,h),queueMicrotask(()=>{this.dispatchEvent({type:"updated",count:r})})}setMapping(t){if(!this.centers)return console.warn("SplatSorter: Cannot set mapping before initialization.");let e,n=[];if(!t){let o=this.centers.buffer.slice(0);return e={centers:o,mapping:null},n.push(o),this.worker.postMessage(e,n)}let s=new Float32Array(t.length*3);for(let o=0;o<t.length;o++){let l=t[o];if(l*3+2>=this.centers.length){console.warn(`SplatSorter: Mapping index ${l} out of bounds.`);continue}let c=l*3,h=o*3;s[h+0]=this.centers[c+0],s[h+1]=this.centers[c+1],s[h+2]=this.centers[c+2]}let r=s.buffer.slice(0),a=t.buffer.slice(0);e={centers:r,mapping:a},n.push(r,a),this.worker.postMessage(e,n)}setCamera(t,e){let n=this.lastCameraPosition.distanceToSquared(t)>1e-7,s=this.lastCameraDirection.dot(e)<.9999;if(!n&&!s)return;this.lastCameraPosition.copy(t),this.lastCameraDirection.copy(e);let r={cameraPosition:{x:t.x,y:t.y,z:t.z},cameraDirection:{x:e.x,y:e.y,z:e.z}};this.worker.postMessage(r)}dispose(){this.worker&&this.worker.terminate(),this.orderTexture=null,this.centers=null,this.chunks=null}createWorkerCode(){return`(${(function(){let t=null,e=null,n=null,s=null,r=null,a=null,o=!1,l={x:0,y:0,z:0},c={x:0,y:0,z:0},h={x:0,y:0,z:0},u={x:0,y:0,z:0},d=null,p=null,g=32,y=new Array(g).fill(0),m=new Array(g).fill(0),f=new Array(g).fill(0),A=(v,P,R)=>{for(;v<=P;){let E=P+v>>1,T=R(E);if(T>0)v=E+1;else if(T<0)P=E-1;else return E}return~v},b=()=>{if(!t||!e||!r||!a)return;if(e.length===0){let Q={order:t.buffer,count:0};self.postMessage(Q,[t.buffer]),t=null;return}let v=r.x,P=r.y,R=r.z,E=a.x,T=a.y,S=a.z,_=1e-4,C=Math.abs(v-l.x)>_||Math.abs(P-l.y)>_||Math.abs(R-l.z)>_,G=Math.abs(E-c.x)>_||Math.abs(T-c.y)>_||Math.abs(S-c.z)>_;if(!o&&!C&&!G)return;o=!1,l.x=v,l.y=P,l.z=R,c.x=E,c.y=T,c.z=S;let L=1/0,B=-1/0;for(let Q=0;Q<8;++Q){let Mt=Q&1?h.x:u.x,q=Q&2?h.y:u.y,Z=Q&4?h.z:u.z,st=Mt*E+q*T+Z*S;L=Math.min(L,st),B=Math.max(B,st)}let z=e.length/3,U=B-L,H=(1<<Math.max(10,Math.min(20,Math.ceil(Math.log2(z/4)))))+1;if((!d||d.length!==z)&&(d=new Uint32Array(z)),!p||p.length!==H?p=new Uint32Array(H):p.fill(0),U<1e-7){for(let Q=0;Q<z;++Q)d[Q]=0;p[0]=z}else if(n&&n.length>0){let Q=n.length/6;y.fill(0);for(let Z=0;Z<Q;++Z){let st=Z*6,et=n[st+0],ct=n[st+1],St=n[st+2],pt=n[st+3],Ft=et*E+ct*T+St*S-L,Ot=Ft-pt,Ct=Ft+pt,I=Math.max(0,Math.floor(Ot*g/U)),re=Math.min(g,Math.ceil(Ct*g/U));for(let Bt=I;Bt<re;++Bt)y[Bt]++}let Mt=0;for(let Z=0;Z<g;++Z)Mt+=y[Z];f[0]=0,m[0]=0;for(let Z=1;Z<g;++Z)f[Z-1]=y[Z-1]/Mt*H>>>0,m[Z]=m[Z-1]+f[Z-1];f[g-1]=y[g-1]/Mt*H>>>0;let q=U/g;for(let Z=0;Z<z;++Z){let st=Z*3,et=e[st+0],ct=e[st+1],St=e[st+2],pt=et*E+ct*T+St*S,Ft=(B-pt)/q,Ot=Math.max(0,Math.min(g-1,Math.floor(Ft))),Ct=Ft-Ot,I=m[Ot]+f[Ot]*Ct>>>0,re=Math.min(I,H-1);d[Z]=re,p[re]++}}else{let Q=(H-1)/U;for(let Mt=0;Mt<z;++Mt){let q=Mt*3,Z=e[q+0],st=e[q+1],et=e[q+2],ct=Z*E+st*T+et*S,St=(B-ct)*Q>>>0,pt=Math.min(St,H-1);d[Mt]=pt,p[pt]++}}for(let Q=1;Q<H;Q++)p[Q]+=p[Q-1];for(let Q=z-1;Q>=0;Q--){let Mt=d[Q],q=--p[Mt];t[q]=s?s[Q]:Q}let V=v*E+P*T+R*S,nt=Q=>{if(!t)return-1/0;let Mt=t[Q],q=Mt;if(!e||q*3+2>=e.length)return-1/0;let Z=q*3;return e[Z]*E+e[Z+1]*T+e[Z+2]*S-V},$=z;if(z>0&&nt(z-1)<0){let Q=A(0,z-1,nt);$=Q<0?~Q:Q}let it={order:t.buffer,count:$};self.postMessage(it,[t.buffer]),t=null};self.onmessage=v=>{let P=v.data;P.order&&(t=new Uint32Array(P.order));let R=!1;if(P.centers&&(e=new Float32Array(P.centers),R=!0,o=!0),Object.prototype.hasOwnProperty.call(P,"mapping")&&(s=P.mapping?new Uint32Array(P.mapping):null,o=!0),P.chunks){if(n=new Float32Array(P.chunks),n.length>0&&n[3]>0)for(let E=0;E<n.length/6;++E){let T=E*6,S=n[T+0],_=n[T+1],C=n[T+2],G=n[T+3],L=n[T+4],B=n[T+5];n[T+0]=(S+G)*.5,n[T+1]=(_+L)*.5,n[T+2]=(C+B)*.5,n[T+3]=Math.sqrt((G-S)**2+(L-_)**2+(B-C)**2)*.5}o=!0}if(R&&e&&e.length>0){h.x=u.x=e[0],h.y=u.y=e[1],h.z=u.z=e[2];for(let E=1;E<e.length/3;E++){let T=E*3;h.x=Math.min(h.x,e[T+0]),u.x=Math.max(u.x,e[T+0]),h.y=Math.min(h.y,e[T+1]),u.y=Math.max(u.y,e[T+1]),h.z=Math.min(h.z,e[T+2]),u.z=Math.max(u.z,e[T+2])}}else R&&e&&e.length===0&&(h.x=u.x=h.y=u.y=h.z=u.z=0);P.cameraPosition&&(r=P.cameraPosition),P.cameraDirection&&(a=P.cameraDirection),b()}}).toString()})();`}},i_={type:"wave",defaultDuration:3,shaderCode:`
void applyAnimation(
    inout vec3 position,
    inout vec3 scale,
    inout vec4 color,
    float progress,
    vec3 center
) {
    const float DIST_K     = 0.3;
    const float WAVE_GAIN  = 1.2;
    const float INV_WAVE_W = 20.0;
    const vec3  GLOW       = vec3(1.0, 1.0, 1.0);

    float dist = length(position - center);
    float normalizedDist = 1.0 - exp(-dist * DIST_K);
    float waveProgress = progress * WAVE_GAIN;

    float glowIntensity = clamp(1.0 - abs(normalizedDist - waveProgress) * INV_WAVE_W, 0.0, 1.0);
    color.rgb = mix(color.rgb, GLOW, glowIntensity);
}
`},s_={type:"spread",defaultDuration:3,shaderCode:`
void applyAnimation(
    inout vec3 position,
    inout vec3 scale,
    inout vec4 color,
    float progress,
    vec3 center
) {
    const float DIST_K      = 0.3;
    const float WAVE_GAIN   = 1.2;
    const float SPHERE_LOG  = -6.0;
    const float INV_WAVE_W  = 20.0;  // 1.0 / 0.05 wave width, precomputed
    const vec3 GOLD = vec3(1.0, 1.0, 1.0);   // pure white

    float dist = length(position - center);
    float normalizedDist = 1.0 - exp(-dist * DIST_K);
    float waveProgress = progress * WAVE_GAIN;

    float revealed = step(normalizedDist, waveProgress);
    scale = mix(vec3(SPHERE_LOG), scale, revealed);

    float glowIntensity = clamp(1.0 - abs(normalizedDist - waveProgress) * INV_WAVE_W, 0.0, 1.0);
    color.rgb = mix(color.rgb, GOLD, glowIntensity);
}
`},r_={type:"none",defaultDuration:0,shaderCode:`
void applyAnimation(
    inout vec3 position,
    inout vec3 scale,
    inout vec4 color,
    float progress,
    vec3 center
) {}
`},Bh={spread:s_,wave:i_,none:r_},Gh=i=>Bh[i]??Bh.none,zh={linear:i=>i,easeInQuad:i=>i*i,easeOutQuad:i=>i*(2-i),easeInOutQuad:i=>i<.5?2*i*i:-1+(4-2*i)*i,easeInCubic:i=>i*i*i,easeOutCubic:i=>1-Math.pow(1-i,3),easeInOutCubic:i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,easeOutExpo:i=>i===1?1:1-Math.pow(2,-10*i)},a_=i=>zh[i]??zh.linear,Tl=class{constructor(t){ot(this,"_progress",0),ot(this,"_isPlaying",!1),ot(this,"_isComplete",!1),ot(this,"_startTime",0),ot(this,"_duration"),ot(this,"_delay"),ot(this,"_easing"),ot(this,"_type"),ot(this,"_autoPlay"),ot(this,"_center",new D);let e=Gh(t.type);this._type=t.type,this._duration=t.duration??e.defaultDuration,this._delay=t.delay??0,this._easing=a_(t.easing??"easeOutCubic"),this._autoPlay=t.autoPlay??!0}get progress(){return this._progress}get isPlaying(){return this._isPlaying}get isComplete(){return this._isComplete}get type(){return this._type}get center(){return this._center}setCenter(t){this._center.copy(t)}play(){this._startTime=-1,this._isPlaying=!0,this._isComplete=!1,this._progress=0}stop(){this._isPlaying=!1}reset(){this._progress=0,this._isPlaying=!1,this._isComplete=!1,this._startTime=0}complete(){this._progress=1,this._isPlaying=!1,this._isComplete=!0}update(t){if(!this._isPlaying)return!1;this._startTime<0&&(this._startTime=t+this._delay);let e=t-this._startTime;if(e<0)return!1;let n=Math.min(e/this._duration,1);return this._progress=this._easing(n),n>=1&&(this._isPlaying=!1,this._isComplete=!0,this._progress=1),!0}shouldAutoPlay(){return this._autoPlay&&!this._isComplete}},Al=class{constructor(t){ot(this,"packedGeometry"),ot(this,"packedColor"),ot(this,"orderTexture"),ot(this,"width"),ot(this,"height"),this.width=t.textureWidth,this.height=t.textureHeight,this.packedColor=this.createColorTexture(t),this.packedGeometry=this.createGeometryTexture(t),this.orderTexture=this.createOrderTexture(t.numSplats)}createGeometryTexture(t){let e=new mi(t.packedGeometry,this.width,this.height,ns,cn);return e.internalFormat="RGBA32UI",e.minFilter=le,e.magFilter=le,e.needsUpdate=!0,e}createColorTexture(t){let e=new mi(t.packedColor,this.width,this.height,Ne,Ke);return e.minFilter=le,e.magFilter=le,e.needsUpdate=!0,e}createOrderTexture(t){let e=new Uint32Array(this.width*this.height);for(let s=0;s<t;s++)e[s]=s;let n=new mi(e,this.width,this.height,es,cn);return n.minFilter=le,n.magFilter=le,n.needsUpdate=!0,n}dispose(){this.packedGeometry.dispose(),this.packedColor.dispose(),this.orderTexture.dispose()}},kh=`
precision highp float;
precision highp int;
precision highp usampler2D;
precision highp sampler2D;

uniform int texWidth;
uniform vec2 viewport;
uniform uint numSplats;

// --- Unified Packed Textures ---
uniform usampler2D packedGeometry; // RGBA32UI: Geometry (Pos, Rot, Scale)
uniform sampler2D packedColor;    // RGBA8: Color (RGB) + Opacity (A)
uniform usampler2D splatOrder;    // R32UI: Sort Index

// --- Decompression Ranges ---
uniform vec3 meansMin;
uniform vec3 meansMax;
uniform vec3 scalesMin;
uniform vec3 scalesMax;
uniform vec3 sh0Min;
uniform vec3 sh0Max;

// --- Animation Uniforms ---
uniform float animationProgress;  // 0 = start, 1 = complete
uniform vec3 animationCenter;     // Center point for animation

/* @ANIMATION_CODE */

// --- Attributes ---
in uint splatInstanceIndex;

// --- Outputs ---
out vec4 vColor;
out vec2 vUv;

// --- Constants ---
const vec4 DISCARD_VERTEX = vec4(0.0, 0.0, 2.0, 1.0);
const float SH_C0 = 0.28209479177387814; // 1/(2*sqrt(pi))
const float QUAT_NORM = 1.41421356237; // sqrt(2)

// --- Helper Functions ---

// Extract raw bytes as integers (no /255 )
uvec4 unpackBytes(uint v) {
    return (uvec4(v) >> uvec4(24u, 16u, 8u, 0u)) & 0xffu;
}

mat3 quatToMat3(vec4 R) {
    vec4 R2 = R + R;
    float X = R2.x * R.w;
    vec4 Y = R2.y * R;
    vec4 Z = R2.z * R;
    float W = R2.w * R.w;

    return mat3(
        1.0 - Z.z - W,
              Y.z + X,
              Y.w - Z.x,
              Y.z - X,
        1.0 - Y.y - W,
              Z.w + Y.x,
              Y.w + Z.x,
              Z.w - Y.x,
        1.0 - Y.y - Z.z
    );
}

void getModelCovariance(vec3 scale, vec4 rotation, out vec3 covA, out vec3 covB) {
    mat3 rot = quatToMat3(rotation);
    mat3 M = transpose(mat3(
        scale.x * rot[0],
        scale.y * rot[1],
        scale.z * rot[2]
    ));

    covA = vec3(dot(M[0], M[0]), dot(M[0], M[1]), dot(M[0], M[2]));
    covB = vec3(dot(M[1], M[1]), dot(M[1], M[2]), dot(M[2], M[2]));
}

// --- Main ---
void main() {
    // Calculate Instance ID & Source Data UV
    uint instanceOffset = uint(position.z);
    uint orderIndex = splatInstanceIndex + instanceOffset;

    if (orderIndex >= numSplats) {
        gl_Position = DISCARD_VERTEX;
        return;
    }

    uint w = uint(texWidth);
    ivec2 orderUV = ivec2(int(orderIndex % w), int(orderIndex / w));

    // Fetch original splat ID from the order texture
    uint splatID = texelFetch(splatOrder, orderUV, 0).r;
    ivec2 dataUV = ivec2(int(splatID % w), int(splatID / w));

    // Fetch Packed Data
    // x: Means Low, y: Means High, z: Rotation, w: Scale
    uvec4 geom = texelFetch(packedGeometry, dataUV, 0); 
    vec4 colorRaw = texelFetch(packedColor, dataUV, 0);

    // Decompress Position (Means) (assume world-space)
    // Reconstruct 16-bit values from two 8-bit channels
    uvec3 lo = unpackBytes(geom.x).xyz;
    uvec3 hi = unpackBytes(geom.y).xyz;

    // (hi << 8) | lo  => 0..65535  then normalize
    vec3 meansNorm = vec3((hi << 8u) | lo) * (1.0 / 65535.0);
    vec3 modelCenter = mix(meansMin, meansMax, meansNorm);

    // Decompress Rotation (Quaternions)
    uvec4 qB = unpackBytes(geom.z);
    vec3 abc = (vec3(qB.xyz) * (1.0 / 255.0) - 0.5) * QUAT_NORM;
    float d = sqrt(max(0.0, 1.0 - dot(abc, abc)));
    uint mode = qB.w; // already 0..3


    // Reconstruct Quaternion (x, y, z, w)
    // quat in (w,x,y,z)
    vec4 quat;
    if (mode == 0u)      quat = vec4(d, abc);            // (w, x, y, z)
    else if (mode == 1u) quat = vec4(abc.x, d, abc.yz);  // stored (w,y,z)
    else if (mode == 2u) quat = vec4(abc.xy, d, abc.z);  // stored (w,x,z)
    else                 quat = vec4(abc, d);            // stored (w,x,y)

    // Decompress Scale (log-space)
    uvec3 sB = unpackBytes(geom.w).xyz;
    vec3 sNorm = vec3(sB) * (1.0 / 255.0);
    vec3 scale = mix(scalesMin, scalesMax, sNorm); // log-space scale

    // Decompress Color & Opacity
    vec4 clr;
    vec3 sh = mix(sh0Min, sh0Max, colorRaw.rgb);
    clr.rgb = vec3(0.5) + sh * SH_C0;
    clr.a = colorRaw.a; // Opacity passed directly (linear or sigmoid handled by loader)

    // --- Apply Animation (modifies position, scale, color in place) ---
    /* @ANIMATION_CALL */

    // Convert log-space scale to linear scale
    scale = exp(scale);

    // --- Standard Gaussian Splat Projection ---

    // View Space Setup
    mat4 modelView = modelViewMatrix;
    vec4 centerView = modelView * vec4(modelCenter, 1.0);

    // Cull behind camera
    if (centerView.z > -0.2) {
        gl_Position = DISCARD_VERTEX;
        return;
    }

    // Covariance in 3D
    vec3 covA, covB;
    getModelCovariance(scale, quat, covA, covB);

    // Project to 2D
    float focalX = viewport.x * projectionMatrix[0][0];
    float focalY = viewport.y * projectionMatrix[1][1];
    float J1 = focalX / centerView.z;
    vec2 J2 = -J1 / centerView.z * centerView.xy;

    mat3 J = mat3(
        J1,   0.0,  J2.x,
        0.0,  J1,   J2.y,
        0.0,  0.0,  0.0
    );

    mat3 W = transpose(mat3(modelView));
    mat3 T = W * J;
    mat3 Vrk = mat3(
        covA.x, covA.y, covA.z,
        covA.y, covB.x, covB.y,
        covA.z, covB.y, covB.z
    );
    mat3 cov = transpose(T) * Vrk * T;

    // Eigendecomposition for Quad dimensions
    float diagonal1 = cov[0][0] + 0.3;
    float offDiagonal = cov[0][1];
    float diagonal2 = cov[1][1] + 0.3;

    float mid = 0.5 * (diagonal1 + diagonal2);
    float radius = length(vec2((diagonal1 - diagonal2) * 0.5, offDiagonal));
    float lambda1 = mid + radius;
    float lambda2 = max(mid - radius, 0.1);

    // Screen space quad vectors
    float vmin = min(1024.0, min(viewport.x, viewport.y)); // Safety clamp
    float l1 = 2.0 * min(sqrt(2.0 * lambda1), vmin);
    float l2 = 2.0 * min(sqrt(2.0 * lambda2), vmin);

    // Discard tiny splats
    // TODO: this branch might create some performance issues - check
    if (animationProgress >= 1.0) {
        if (l1 < 2.0 && l2 < 2.0) {
            gl_Position = DISCARD_VERTEX;
            return;
        }
    }

    vec2 diagVec = normalize(vec2(offDiagonal, lambda1 - diagonal1));
    vec2 v1 = l1 * diagVec;
    vec2 v2 = l2 * vec2(diagVec.y, -diagVec.x);

    // Vertex Position (Quad Expansion)
    vec4 centerProj = projectionMatrix * centerView;
    vec2 c = centerProj.ww / viewport; // Correction for clip space
    
    // Frustum cull
    if (any(greaterThan(abs(centerProj.xy) - vec2(max(l1, l2)) * c, centerProj.ww))) {
        gl_Position = DISCARD_VERTEX;
        return;
    }

    // Quad offset based on 'position' attribute (-1 to 1)
    vec2 offset = (position.x * v1 + position.y * v2) * c;
    
    // Corner Clipping (for gaussian shape)
    // Assuming simple linear opacity here, otherwise inverse sigmoid logic required
    float alpha = max(clr.a, 1.0/255.0);
    float clip = min(1.0, sqrt(-log(1.0 / 255.0 / alpha)) / 2.0);
    
    offset *= clip;
    vec2 clippedUV = position.xy * clip;

    gl_Position = centerProj + vec4(offset, 0.0, 0.0);
    
    // Outputs
    vUv = clippedUV;
    vColor = vec4(max(clr.rgb, vec3(0.0)), clr.a);
}
`,o_=`
precision highp float;

in vec4 vColor; // Color and opacity passed from vertex shader
in vec2 vUv;    // Quad UV coordinates (-1 to 1) passed from vertex shader

out vec4 fragColor; // Output variable

// Fast approximate e^x based on https://nic.schraudolph.org/pubs/Schraudolph99.pdf
const float EXP_A = 12102203.0;     // \u2248 2^23 / ln(2)
const int EXP_BC_RMS = 1064866808;  // (127 << 23) - 60801 * 8
float fastExp(float x) {
    int i = int(EXP_A * x) + EXP_BC_RMS;
    return intBitsToFloat(i);
}

void main(void) {

    float distSq = dot(vUv, vUv); // Calculate squared distance from center (in the quad's coordinate system)
    if (distSq > 1.0) discard; // Discard fragments outside the circle inscribed in the quad

    // Calculate Gaussian function: alpha = opacity * exp(-distSq * factor)
    // The factor 4.0 corresponds to the original implementation's scaling.
    // factor = 1 / (2 * sigma^2), where sigma controls the spread.
    // Using 4.0 implies sigma^2 = 1/8.
    float alpha = fastExp(-distSq * 4.0) * vColor.a;

    if (alpha < 1.0 / 255.0) discard; // Discard fragments with very low alpha

    // Premultiply color by alpha (required for correct blending)
    fragColor = vec4(vColor.rgb * alpha, alpha);
}
`,Cl=class extends ke{constructor(t={}){let e={packedGeometry:{value:null},packedColor:{value:null},splatOrder:{value:null},meansMin:{value:new D},meansMax:{value:new D},scalesMin:{value:new D},scalesMax:{value:new D},sh0Min:{value:new D},sh0Max:{value:new D},texWidth:{value:0},viewport:{value:new Nt(1,1)},numSplats:{value:0},animationProgress:{value:1},animationCenter:{value:new D}};super({uniforms:e,vertexShader:kh,fragmentShader:o_,transparent:!0,glslVersion:Ws,blendSrc:Fs,blendSrcAlpha:Fs,blending:Wr,blendEquation:an,blendEquationAlpha:an,blendDst:hi,blendDstAlpha:hi,depthTest:!0,depthWrite:!1,side:Je,alphaTest:t.alphaTest??0,toneMapped:t.toneMapped??!1}),ot(this,"_shaderTemplate"),t.alphaHash&&(this.alphaHash=!0,this.depthWrite=!0,this.blending=ln),this._shaderTemplate=kh}setTexWidth(t){this.uniforms.texWidth.value=t|0}updateViewport(t,e){this.uniforms.viewport.value.set(t,e)}setPackedGeometry(t){this.uniforms.packedGeometry.value=t}setPackedColor(t){this.uniforms.packedColor.value=t}setOrderTexture(t){this.uniforms.splatOrder.value=t}setRanges(t){this.uniforms.meansMin.value.copy(t.means.min),this.uniforms.meansMax.value.copy(t.means.max),this.uniforms.scalesMin.value.copy(t.scales.min),this.uniforms.scalesMax.value.copy(t.scales.max),this.uniforms.sh0Min.value.copy(t.sh0.min),this.uniforms.sh0Max.value.copy(t.sh0.max)}setNumSplats(t){this.uniforms.numSplats.value=t}setAnimation(t){let e=this._shaderTemplate;t&&t.type!=="none"?(e=e.replace("/* @ANIMATION_CODE */",t.shaderCode),e=e.replace("/* @ANIMATION_CALL */",`if (animationProgress < 1.0) {
    applyAnimation(modelCenter, scale, clr, animationProgress, animationCenter);
}`)):(e=e.replace("/* @ANIMATION_CODE */",""),e=e.replace("/* @ANIMATION_CALL */","")),this.vertexShader=e,this.needsUpdate=!0}setAnimationProgress(t){this.uniforms.animationProgress.value=t}setAnimationCenter(t){this.uniforms.animationCenter.value.copy(t)}},Wh=class Va extends Ee{constructor(t,e={}){let n=new Cl(e),s=Va.createInstancedGeometry(t.numSplats,Va.INSTANCE_SIZE);super(s,n),ot(this,"sorter"),ot(this,"options"),ot(this,"splatData"),ot(this,"textureManager"),ot(this,"animation",null),ot(this,"material"),ot(this,"geometry"),ot(this,"lastCameraPositionLocal",new D),ot(this,"lastCameraDirectionLocal",new D),ot(this,"invModelMatrix",new ie),ot(this,"_vpW",-1),ot(this,"_vpH",-1),ot(this,"_size",new Nt),ot(this,"_camPosW",new D),ot(this,"_camDirW",new D),ot(this,"_camPosL",new D),ot(this,"_camDirL",new D),ot(this,"onSorterUpdated",a=>{let o=a.count;this.geometry.instanceCount=Math.ceil(o/Va.INSTANCE_SIZE),this.material.setNumSplats(o)}),this.geometry=s,this.material=n,this.options={autoSort:!0,...e},this.splatData=t,this.frustumCulled=!1,this.sorter=new El,this.textureManager=new Al(t);let r=this.createChunks()||void 0;if(r===null&&console.warn("Visus: Could not create sorter chunks, bounding box might be invalid."),r=void 0,this.sorter.addEventListener("updated",this.onSorterUpdated),this.sorter.init(this.textureManager.orderTexture,this.splatData.centers,r??void 0,!this.options.keepSplatData),this.material.setRanges(t.ranges),this.material.setTexWidth(t.textureWidth),this.material.setPackedColor(this.textureManager.packedColor),this.material.setOrderTexture(this.textureManager.orderTexture),this.material.setPackedGeometry(this.textureManager.packedGeometry),this.material.setNumSplats(0),e.animation&&e.animation.type!=="none"){this.animation=new Tl(e.animation);let a=new D;t.boundingBox.toBox3().getCenter(a),this.animation.setCenter(a);let o=Gh(e.animation.type);this.material.setAnimation(o),this.material.setAnimationCenter(a),this.material.setAnimationProgress(0)}this.geometry.boundingBox=t.boundingBox.toBox3(),this.geometry.boundingSphere=new Gn,this.geometry.boundingBox.getBoundingSphere(this.geometry.boundingSphere),this.options.keepSplatData||(this.splatData=null)}static createInstancedGeometry(t,e){let n=Math.ceil(t/e),s=new Ue,r=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),a=new Uint16Array([0,1,2,0,2,3]),o=new Float32Array(12*e);for(let u=0;u<e;u++){let d=u*4*3;for(let p=0;p<4;p++)o[d+p*3+0]=r[p*3+0],o[d+p*3+1]=r[p*3+1],o[d+p*3+2]=u}let l=new Uint32Array(6*e);for(let u=0;u<e;u++){let d=u*6,p=u*4;l[d+0]=a[0]+p,l[d+1]=a[1]+p,l[d+2]=a[2]+p,l[d+3]=a[3]+p,l[d+4]=a[4]+p,l[d+5]=a[5]+p}s.setAttribute("position",new oe(o,3)),s.setIndex(new oe(l,1));let c=new Us;c.index=s.index,c.setAttribute("position",s.getAttribute("position"));let h=new Uint32Array(n);for(let u=0;u<n;u++)h[u]=u*e;return c.setAttribute("splatInstanceIndex",new Cs(h,1,!1)),c.instanceCount=0,c}createChunks(){if(!this.splatData)return null;let t=this.splatData.boundingBox;return t.min.x===1/0||t.max.x===-1/0?null:new Float32Array([t.min.x,t.min.y,t.min.z,t.max.x,t.max.y,t.max.z])}updateViewport(t,e){t===this._vpW&&e===this._vpH||(this._vpW=t,this._vpH=e,this.material.updateViewport(t,e))}sort(t){t.getWorldPosition(this._camPosW),t.getWorldDirection(this._camDirW),this.invModelMatrix.copy(this.matrixWorld).invert(),this._camPosL.copy(this._camPosW).applyMatrix4(this.invModelMatrix),this._camDirL.copy(this._camDirW).transformDirection(this.invModelMatrix);let e=this.lastCameraPositionLocal.distanceToSquared(this._camPosL)>1e-6,n=this.lastCameraDirectionLocal.dot(this._camDirL)<.999;this.options.autoSort&&(e||n)&&(this.lastCameraPositionLocal.copy(this._camPosL),this.lastCameraDirectionLocal.copy(this._camDirL),this.sorter.setCamera(this._camPosL,this._camDirL))}onBeforeRender(t,e,n){if(this.sort(n),t.getSize(this._size),this.updateViewport(this._size.x,this._size.y),this.animation){if(!this.animation.isPlaying&&this.animation.shouldAutoPlay())return this.animation.play();if(!this.animation.isPlaying||this.animation.isComplete)return;let s=performance.now()/1e3;this.animation.update(s)&&this.material.setAnimationProgress(this.animation.progress)}}dispose(){this.sorter.removeEventListener("updated",this.onSorterUpdated),this.sorter.dispose(),this.geometry.dispose(),this.material.dispose(),this.textureManager.dispose()}};ot(Wh,"INSTANCE_SIZE",128);var Xh=Wh,ls=.28209479177387814,wi=class{static packPly(t){let e=t.numSplats,n=Math.ceil(Math.sqrt(e)),s=Math.ceil(e/n),r=n*s,{ranges:a,colorScale:o}=this.calculatePlyRanges(t),l=new Uint32Array(r*4),c=new Uint8Array(r*4),h=new ye;for(let u=0;u<e;u++){let d=u*4,p=u*3,g=u*4,y=t.positions[p+0],m=t.positions[p+1],f=t.positions[p+2],A=this.clamp01(this.norm(y,a.means.min.x,a.means.max.x)),b=this.clamp01(this.norm(m,a.means.min.y,a.means.max.y)),v=this.clamp01(this.norm(f,a.means.min.z,a.means.max.z)),P=A*65535|0,R=b*65535|0,E=v*65535|0;l[d+0]=this.pack4Bytes(P&255,R&255,E&255,0),l[d+1]=this.pack4Bytes(P>>8,R>>8,E>>8,0),h.set(t.rotations[g],t.rotations[g+1],t.rotations[g+2],t.rotations[g+3]).normalize();let T=h.w,S=h.x,_=h.y,C=h.z,G=Math.abs(T),L=Math.abs(S),B=Math.abs(_),z=Math.abs(C),U=0,H=G;L>H&&(H=L,U=1),B>H&&(H=B,U=2),z>H&&(H=z,U=3),(U===0?T:U===1?S:U===2?_:C)<0&&(T=-T,S=-S,_=-_,C=-C);let V=0,nt=0,$=0;U===0&&(V=S,nt=_,$=C),U===1&&(V=T,nt=_,$=C),U===2&&(V=T,nt=S,$=C),U===3&&(V=T,nt=S,$=_);let it=re=>Math.min(255,Math.max(0,Math.round((.5+re/Math.SQRT2)*255)));l[d+2]=this.pack4Bytes(it(V),it(nt),it($),U);let Q=this.norm(t.scales[p+0],a.scales.min.x,a.scales.max.x),Mt=this.norm(t.scales[p+1],a.scales.min.y,a.scales.max.y),q=this.norm(t.scales[p+2],a.scales.min.z,a.scales.max.z);l[d+3]=this.pack4Bytes(Math.floor(Q*255),Math.floor(Mt*255),Math.floor(q*255),0);let Z=this.clamp01(t.colors[p+0]*o),st=this.clamp01(t.colors[p+1]*o),et=this.clamp01(t.colors[p+2]*o),ct=(Z-.5)/ls,St=(st-.5)/ls,pt=(et-.5)/ls,Ft=this.clamp01(this.norm(ct,a.sh0.min.x,a.sh0.max.x)),Ot=this.clamp01(this.norm(St,a.sh0.min.y,a.sh0.max.y)),Ct=this.clamp01(this.norm(pt,a.sh0.min.z,a.sh0.max.z)),I=this.clamp01(t.opacities[u]);c[d+0]=Math.round(Ft*255),c[d+1]=Math.round(Ot*255),c[d+2]=Math.round(Ct*255),c[d+3]=Math.round(I*255)}return new Ys(e,n,s,t.positions,l,c,a,t.boundingBox)}static packSogs(t){var e,n,s;let r=t.numSplats,a=Math.ceil(Math.sqrt(r)),o=Math.ceil(r/a),l=((e=t.means_l)==null?void 0:e.image)??((n=t.sh0)==null?void 0:n.image)??((s=t.quats)==null?void 0:s.image);l&&typeof l.width=="number"&&typeof l.height=="number"&&(a=l.width,o=l.height);let c=a*o;if(c<r)throw new Error(`SOG v1 texture too small: ${a}x${o}=${c} < count=${r}`);let h=this.convertSogsRanges(t.ranges),u=t.ranges.means.mins[0],d=t.ranges.means.mins[1],p=t.ranges.means.mins[2],g=t.ranges.means.maxs[0],y=t.ranges.means.maxs[1],m=t.ranges.means.maxs[2],f=L=>Math.sign(L)*(Math.exp(Math.abs(L))-1),A=new D(f(u),f(d),f(p)),b=new D(f(g),f(y),f(m));h.means.min.copy(A),h.means.max.copy(b);let v=t,P=this.getPixels(v.means_l),R=this.getPixels(v.means_u),E=this.getPixels(v.quats),T=this.getPixels(v.scales),S=this.getPixels(v.sh0),_=new Uint32Array(c*4),C=new Uint8Array(c*4),G=new Float32Array(r*3);for(let L=0;L<r;L++){let B=L*4,z=R[B+0],U=P[B+0],H=R[B+1],V=P[B+1],nt=R[B+2],$=P[B+2],it=(z<<8|U)/65535,Q=(H<<8|V)/65535,Mt=(nt<<8|$)/65535,q=this.sogsDecode(it,u,g),Z=this.sogsDecode(Q,d,y),st=this.sogsDecode(Mt,p,m);G[L*3+0]=q,G[L*3+1]=Z,G[L*3+2]=st;let et=this.clamp01(this.norm(q,A.x,b.x))*65535|0,ct=this.clamp01(this.norm(Z,A.y,b.y))*65535|0,St=this.clamp01(this.norm(st,A.z,b.z))*65535|0;_[B+0]=this.pack4Bytes(et&255,ct&255,St&255,0),_[B+1]=this.pack4Bytes(et>>8,ct>>8,St>>8,0),_[B+3]=this.pack4Bytes(T[B],T[B+1],T[B+2],0);let pt=E[B+3]-252;_[B+2]=this.pack4Bytes(E[B+0],E[B+1],E[B+2],pt),C[B+0]=S[B],C[B+1]=S[B+1],C[B+2]=S[B+2];let Ft=S[B+3]/255,Ot=t.ranges.sh0.mins[3]+(t.ranges.sh0.maxs[3]-t.ranges.sh0.mins[3])*Ft,Ct=1/(1+Math.exp(-Ot));C[B+3]=Math.round(Math.max(0,Math.min(1,Ct))*255)}return new Ys(r,a,o,G,_,C,h,t.boundingBox)}static packSog2(t){var e,n,s;let r=t.numSplats,a=Math.ceil(Math.sqrt(r)),o=Math.ceil(r/a),l=((e=t.means_l)==null?void 0:e.image)??((n=t.sh0)==null?void 0:n.image)??((s=t.quats)==null?void 0:s.image);l&&typeof l.width=="number"&&typeof l.height=="number"&&(a=l.width,o=l.height);let c=a*o;if(c<r)throw new Error(`SOG v2 texture too small: ${a}x${o}=${c} < count=${r}`);let h=t.ranges.means.mins[0],u=t.ranges.means.mins[1],d=t.ranges.means.mins[2],p=t.ranges.means.maxs[0],g=t.ranges.means.maxs[1],y=t.ranges.means.maxs[2],m=z=>Math.sign(z)*(Math.exp(Math.abs(z))-1),f=new D(m(h),m(u),m(d)),A=new D(m(p),m(g),m(y)),b=z=>{let U=1/0,H=-1/0;for(let $ of z)Number.isFinite($)&&(U=Math.min(U,$),H=Math.max(H,$));(!Number.isFinite(U)||!Number.isFinite(H))&&(U=0,H=1);let V=H-U||1,nt=new Uint8Array(256);for(let $=0;$<256;$++){let it=(($<z.length&&Number.isFinite(z[$])?z[$]:U+(H-U)*($/255))-U)/V,Q=Math.max(0,Math.min(255,Math.round(it*255)));nt[$]=Q}return{cbMin:U,cbMax:H,lut:nt}},v=b(t.ranges.scales.codebook),P=b(t.ranges.sh0.codebook),R={means:{min:f.clone(),max:A.clone()},scales:{min:new D(v.cbMin,v.cbMin,v.cbMin),max:new D(v.cbMax,v.cbMax,v.cbMax)},sh0:{min:new D(P.cbMin,P.cbMin,P.cbMin),max:new D(P.cbMax,P.cbMax,P.cbMax)}},E=this.getPixels(t.means_l),T=this.getPixels(t.means_u),S=this.getPixels(t.quats),_=this.getPixels(t.scales),C=this.getPixels(t.sh0),G=new Uint32Array(c*4),L=new Uint8Array(c*4),B=new Float32Array(r*3);for(let z=0;z<r;z++){let U=z*4,H=T[U+0],V=E[U+0],nt=T[U+1],$=E[U+1],it=T[U+2],Q=E[U+2],Mt=(H<<8|V)/65535,q=(nt<<8|$)/65535,Z=(it<<8|Q)/65535,st=this.sogsDecode(Mt,h,p),et=this.sogsDecode(q,u,g),ct=this.sogsDecode(Z,d,y);B[z*3+0]=st,B[z*3+1]=et,B[z*3+2]=ct;let St=this.clamp01(this.norm(st,f.x,A.x))*65535|0,pt=this.clamp01(this.norm(et,f.y,A.y))*65535|0,Ft=this.clamp01(this.norm(ct,f.z,A.z))*65535|0;G[U+0]=this.pack4Bytes(St&255,pt&255,Ft&255,0),G[U+1]=this.pack4Bytes(St>>8,pt>>8,Ft>>8,0);let Ot=S[U+3]-252&3;G[U+2]=this.pack4Bytes(S[U+0],S[U+1],S[U+2],Ot);let Ct=v.lut[_[U+0]],I=v.lut[_[U+1]],re=v.lut[_[U+2]];G[U+3]=this.pack4Bytes(Ct,I,re,0),L[U+0]=P.lut[C[U+0]],L[U+1]=P.lut[C[U+1]],L[U+2]=P.lut[C[U+2]],L[U+3]=C[U+3]}return new Ys(r,a,o,B,G,L,R,t.boundingBox)}static pack4Bytes(t,e,n,s){return(t&255)<<24|(e&255)<<16|(n&255)<<8|s&255}static getPixels(t){let e=t.image,n=e.width,s=e.height;if(e.data&&(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray))return new Uint8Array(e.data);let r=document.createElement("canvas");r.width=n,r.height=s;let a=r.getContext("2d",{willReadFrequently:!0});if(!a)throw new Error("Canvas init failed");return a.drawImage(e,0,0),new Uint8Array(a.getImageData(0,0,n,s).data)}static convertSogsRanges(t){let e=n=>new D(n[0],n[1],n[2]);return{sh0:{min:e(t.sh0.mins),max:e(t.sh0.maxs)},means:{min:e(t.means.mins),max:e(t.means.maxs)},scales:{min:e(t.scales.mins),max:e(t.scales.maxs)}}}static calculatePlyRanges(t){let e=new D(1/0,1/0,1/0),n=new D(-1/0,-1/0,-1/0),s=new D(1/0,1/0,1/0),r=new D(-1/0,-1/0,-1/0),a=new D(1/0,1/0,1/0),o=new D(-1/0,-1/0,-1/0),l=0;for(let h=0;h<t.numSplats;h++){let u=h*3,d=t.positions[u+0],p=t.positions[u+1],g=t.positions[u+2];e.x=Math.min(e.x,d),n.x=Math.max(n.x,d),e.y=Math.min(e.y,p),n.y=Math.max(n.y,p),e.z=Math.min(e.z,g),n.z=Math.max(n.z,g),s.x=Math.min(s.x,t.scales[u]),r.x=Math.max(r.x,t.scales[u]),s.y=Math.min(s.y,t.scales[u+1]),r.y=Math.max(r.y,t.scales[u+1]),s.z=Math.min(s.z,t.scales[u+2]),r.z=Math.max(r.z,t.scales[u+2]),l=Math.max(l,t.colors[u],t.colors[u+1],t.colors[u+2])}let c=l>1.5?1/255:1;for(let h=0;h<t.numSplats;h++){let u=h*3,d=this.clamp01(t.colors[u+0]*c),p=this.clamp01(t.colors[u+1]*c),g=this.clamp01(t.colors[u+2]*c),y=(d-.5)/ls,m=(p-.5)/ls,f=(g-.5)/ls;a.x=Math.min(a.x,y),o.x=Math.max(o.x,y),a.y=Math.min(a.y,m),o.y=Math.max(o.y,m),a.z=Math.min(a.z,f),o.z=Math.max(o.z,f)}return{colorScale:c,ranges:{sh0:{min:a,max:o},means:{min:e,max:n},scales:{min:s,max:r}}}}static clamp01(t){return Math.max(0,Math.min(1,t))}static norm(t,e,n){return(t-e)/(n-e||1)}static sogsDecode(t,e,n){let s=e+(n-e)*t;return Math.sign(s)*(Math.exp(Math.abs(s))-1)}},Wa=class extends _n{constructor(t,e){super(t),ot(this,"requestId",0),ot(this,"worker"),ot(this,"pendingCallbacks",new Map),this.withCredentials=e?.withCredentials??!1;let n=this.createWorkerCode(),s=new Blob([n],{type:"application/javascript"});this.worker=new Worker(URL.createObjectURL(s)),this.worker.onmessage=this.onWorkerMessage.bind(this)}onWorkerMessage(t){let{requestId:e,error:n,result:s}=t.data,r=this.pendingCallbacks.get(e);if(!r)return console.warn(`PlyLoader: Received response for unknown request ${e}`);if(this.pendingCallbacks.delete(e),n)return r.reject(new Error(n));if(!s)return r.reject(new Error("Worker returned no result"));try{let a=new wl(0);a.numSplats=s.numSplats,a.positions=new Float32Array(s.positions),a.rotations=new Float32Array(s.rotations),a.scales=new Float32Array(s.scales),a.colors=new Float32Array(s.colors),a.opacities=new Float32Array(s.opacities),a.boundingBox.min.set(s.boundingBox.minX,s.boundingBox.minY,s.boundingBox.minZ),a.boundingBox.max.set(s.boundingBox.maxX,s.boundingBox.maxY,s.boundingBox.maxZ),this.worker.terminate();let o=wi.packPly(a);a.dispose(),r.resolve(o)}catch(a){r.reject(a)}}load(t,e,n,s){let r=new qn(this.manager);r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setPath(this.path),r.setWithCredentials(this.withCredentials),r.load(t,a=>{this.parseAsync(a).then(o=>{e&&e(o)}).catch(o=>{s?s(o):console.error(o),this.manager.itemError(t)})},n,s)}loadAsync(t,e){return new Promise((n,s)=>{let r=new qn(this.manager);r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setPath(this.path),r.setWithCredentials(this.withCredentials),r.load(t,a=>{this.parseAsync(a).then(n).catch(o=>{s(o),this.manager.itemError(t)})},e,a=>{s(a),this.manager.itemError(t)})})}parseAsync(t){return new Promise((e,n)=>{let s=this.requestId++;this.pendingCallbacks.set(s,{resolve:e,reject:n});let r={requestId:s,buffer:t};this.worker.postMessage(r,[t])})}dispose(){this.worker&&this.worker.terminate(),this.pendingCallbacks.clear()}createWorkerCode(){return`(${(function(){self.onmessage=e=>{let{requestId:n,buffer:s}=e.data;try{let r=t(s),a={requestId:n,result:r};self.postMessage(a,[r.positions,r.rotations,r.scales,r.colors,r.opacities])}catch(r){let a={requestId:n,error:r instanceof Error?r.message:String(r)};self.postMessage(a)}};function t(e){let n=new TextDecoder,s=new Uint8Array(e),r=[112,108,121,10],a=`
end_header
`;for(let $=0;$<r.length;$++)if(s[$]!==r[$])throw new Error("Invalid PLY file: Missing magic bytes");let o=0;for(let $=0;$<s.length-a.length;$++){let it=!0;for(let Q=0;Q<a.length;Q++)if(s[$+Q]!==a.charCodeAt(Q)){it=!1;break}if(it){o=$+a.length;break}}if(o===0)throw new Error("Invalid PLY file: Could not find end of header");let l=n.decode(s.subarray(0,o)).split(`
`),c=[],h=null;for(let $=1;$<l.length;$++){let it=l[$].trim();if(it===""||it==="end_header")continue;let Q=it.split(" ");switch(Q[0]){case"format":h=Q[1];break;case"element":c.push({name:Q[1],count:parseInt(Q[2],10),properties:[]});break;case"property":if(c.length===0)throw new Error("Invalid PLY file: Property without element");c[c.length-1].properties.push({type:Q[1],name:Q[2]});break}}if(h!=="binary_little_endian")throw new Error(`Unsupported PLY format: ${h}`);let u=c.find($=>$.name==="vertex");if(!u)throw new Error("Invalid PLY file: No vertex element found");let d=u.count,p=new Float32Array(d*3),g=new Float32Array(d*4),y=new Float32Array(d*3),m=new Float32Array(d*3),f=new Float32Array(d),A=new DataView(e),b=o,v=$=>u.properties.findIndex(it=>it.name===$),P=v("x"),R=v("y"),E=v("z"),T=[v("rot_0"),v("rot_1"),v("rot_2"),v("rot_3")],S=[v("scale_0"),v("scale_1"),v("scale_2")],_=[v("f_dc_0"),v("f_dc_1"),v("f_dc_2")],C=v("opacity");if([P,R,E,...T,...S,..._,C].some($=>$===-1))throw new Error("Invalid PLY file: Missing required properties");let G=.28209479177387814,L=$=>{if($>0)return 1/(1+Math.exp(-$));let it=Math.exp($);return it/(1+it)},B=1/0,z=1/0,U=1/0,H=-1/0,V=-1/0,nt=-1/0;for(let $=0;$<d;$++){let it=[];for(let Ht=0;Ht<u.properties.length;Ht++){let bt=u.properties[Ht].type,Xt;switch(bt){case"char":Xt=A.getInt8(b),b+=1;break;case"uchar":Xt=A.getUint8(b),b+=1;break;case"short":Xt=A.getInt16(b,!0),b+=2;break;case"ushort":Xt=A.getUint16(b,!0),b+=2;break;case"int":Xt=A.getInt32(b,!0),b+=4;break;case"uint":Xt=A.getUint32(b,!0),b+=4;break;case"float":Xt=A.getFloat32(b,!0),b+=4;break;case"double":Xt=A.getFloat64(b,!0),b+=8;break;default:throw new Error(`Unsupported property type: ${bt}`)}it.push(Xt)}let Q=it[P],Mt=it[R],q=it[E],Z=$*3;p[Z]=Q,p[Z+1]=Mt,p[Z+2]=q,B=Math.min(B,Q),z=Math.min(z,Mt),U=Math.min(U,q),H=Math.max(H,Q),V=Math.max(V,Mt),nt=Math.max(nt,q);let st=it[T[1]],et=it[T[2]],ct=it[T[3]],St=it[T[0]],pt=Math.sqrt(st*st+et*et+ct*ct+St*St);pt>0&&(st/=pt,et/=pt,ct/=pt,St/=pt),St<0&&(st=-st,et=-et,ct=-ct,St=-St);let Ft=$*4;g[Ft]=st,g[Ft+1]=et,g[Ft+2]=ct,g[Ft+3]=St;let Ot=$*3;y[Ot]=it[S[0]],y[Ot+1]=it[S[1]],y[Ot+2]=it[S[2]];let Ct=.5+it[_[0]]*G,I=.5+it[_[1]]*G,re=.5+it[_[2]]*G;Ct=Math.max(0,Math.min(1,Ct)),I=Math.max(0,Math.min(1,I)),re=Math.max(0,Math.min(1,re));let Bt=$*3;m[Bt]=Ct,m[Bt+1]=I,m[Bt+2]=re,f[$]=L(it[C])}return{numSplats:d,positions:p.buffer,rotations:g.buffer,scales:y.buffer,colors:m.buffer,opacities:f.buffer,boundingBox:{minX:B,minY:z,minZ:U,maxX:H,maxY:V,maxZ:nt}}}}).toString()})();`}},He=Uint8Array,cs=Uint16Array,l_=Int32Array,qh=new He([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Yh=new He([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),c_=new He([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Zh=function(i,t){for(var e=new cs(31),n=0;n<31;++n)e[n]=t+=1<<i[n-1];for(var s=new l_(e[30]),n=1;n<30;++n)for(var r=e[n];r<e[n+1];++r)s[r]=r-e[n]<<5|n;return{b:e,r:s}},$h=Zh(qh,2),Jh=$h.b,h_=$h.r;Jh[28]=258,h_[258]=28;var u_=Zh(Yh,0),d_=u_.b,Rl=new cs(32768);for(Kt=0;Kt<32768;++Kt)Un=(Kt&43690)>>1|(Kt&21845)<<1,Un=(Un&52428)>>2|(Un&13107)<<2,Un=(Un&61680)>>4|(Un&3855)<<4,Rl[Kt]=((Un&65280)>>8|(Un&255)<<8)>>1;var Un,Kt,Zs=function(i,t,e){for(var n=i.length,s=0,r=new cs(t);s<n;++s)i[s]&&++r[i[s]-1];var a=new cs(t);for(s=1;s<t;++s)a[s]=a[s-1]+r[s-1]<<1;var o;if(e){o=new cs(1<<t);var l=15-t;for(s=0;s<n;++s)if(i[s])for(var c=s<<4|i[s],h=t-i[s],u=a[i[s]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)o[Rl[u]>>l]=c}else for(o=new cs(n),s=0;s<n;++s)i[s]&&(o[s]=Rl[a[i[s]-1]++]>>15-i[s]);return o},Js=new He(288);for(Kt=0;Kt<144;++Kt)Js[Kt]=8;var Kt;for(Kt=144;Kt<256;++Kt)Js[Kt]=9;var Kt;for(Kt=256;Kt<280;++Kt)Js[Kt]=7;var Kt;for(Kt=280;Kt<288;++Kt)Js[Kt]=8;var Kt,Kh=new He(32);for(Kt=0;Kt<32;++Kt)Kh[Kt]=5;var Kt,f_=Zs(Js,9,1),p_=Zs(Kh,5,1),vl=function(i){for(var t=i[0],e=1;e<i.length;++e)i[e]>t&&(t=i[e]);return t},hn=function(i,t,e){var n=t/8|0;return(i[n]|i[n+1]<<8)>>(t&7)&e},Ml=function(i,t){var e=t/8|0;return(i[e]|i[e+1]<<8|i[e+2]<<16)>>(t&7)},m_=function(i){return(i+7)/8|0},Il=function(i,t,e){return(t==null||t<0)&&(t=0),(e==null||e>i.length)&&(e=i.length),new He(i.subarray(t,e))},g_=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],je=function(i,t,e){var n=new Error(t||g_[i]);if(n.code=i,Error.captureStackTrace&&Error.captureStackTrace(n,je),!e)throw n;return n},__=function(i,t,e,n){var s=i.length,r=n?n.length:0;if(!s||t.f&&!t.l)return e||new He(0);var a=!e,o=a||t.i!=2,l=t.i;a&&(e=new He(s*3));var c=function(Ft){var Ot=e.length;if(Ft>Ot){var Ct=new He(Math.max(Ot*2,Ft));Ct.set(e),e=Ct}},h=t.f||0,u=t.p||0,d=t.b||0,p=t.l,g=t.d,y=t.m,m=t.n,f=s*8;do{if(!p){h=hn(i,u,1);var A=hn(i,u+1,3);if(u+=3,A)if(A==1)p=f_,g=p_,y=9,m=5;else if(A==2){var b=hn(i,u,31)+257,v=hn(i,u+10,15)+4,P=b+hn(i,u+5,31)+1;u+=14;for(var R=new He(P),E=new He(19),T=0;T<v;++T)E[c_[T]]=hn(i,u+T*3,7);u+=v*3;for(var S=vl(E),_=(1<<S)-1,C=Zs(E,S,1),T=0;T<P;){var G=C[hn(i,u,_)];u+=G&15;var L=G>>4;if(L<16)R[T++]=L;else{var B=0,z=0;for(L==16?(z=3+hn(i,u,3),u+=2,B=R[T-1]):L==17?(z=3+hn(i,u,7),u+=3):L==18&&(z=11+hn(i,u,127),u+=7);z--;)R[T++]=B}}var U=R.subarray(0,b),H=R.subarray(b);y=vl(U),m=vl(H),p=Zs(U,y,1),g=Zs(H,m,1)}else je(1);else{var L=m_(u)+4,V=i[L-4]|i[L-3]<<8,nt=L+V;if(nt>s){l&&je(0);break}o&&c(d+V),e.set(i.subarray(L,nt),d),t.b=d+=V,t.p=u=nt*8,t.f=h;continue}if(u>f){l&&je(0);break}}o&&c(d+131072);for(var $=(1<<y)-1,it=(1<<m)-1,Q=u;;Q=u){var B=p[Ml(i,u)&$],Mt=B>>4;if(u+=B&15,u>f){l&&je(0);break}if(B||je(2),Mt<256)e[d++]=Mt;else if(Mt==256){Q=u,p=null;break}else{var q=Mt-254;if(Mt>264){var T=Mt-257,Z=qh[T];q=hn(i,u,(1<<Z)-1)+Jh[T],u+=Z}var st=g[Ml(i,u)&it],et=st>>4;st||je(3),u+=st&15;var H=d_[et];if(et>3){var Z=Yh[et];H+=Ml(i,u)&(1<<Z)-1,u+=Z}if(u>f){l&&je(0);break}o&&c(d+131072);var ct=d+q;if(d<H){var St=r-H,pt=Math.min(H,ct);for(St+d<0&&je(3);d<pt;++d)e[d]=n[St+d]}for(;d<ct;++d)e[d]=e[d-H]}}t.l=p,t.p=Q,t.b=d,t.f=h,p&&(h=1,t.m=y,t.d=g,t.n=m)}while(!h);return d!=e.length&&a?Il(e,0,d):e.subarray(0,d)},x_=new He(0),Mn=function(i,t){return i[t]|i[t+1]<<8},un=function(i,t){return(i[t]|i[t+1]<<8|i[t+2]<<16|i[t+3]<<24)>>>0},Sl=function(i,t){return un(i,t)+un(i,t+4)*4294967296};function y_(i,t){return __(i,{i:2},t&&t.out,t&&t.dictionary)}var Pl=typeof TextDecoder<"u"&&new TextDecoder,v_=0;try{Pl.decode(x_,{stream:!0}),v_=1}catch{}var M_=function(i){for(var t="",e=0;;){var n=i[e++],s=(n>127)+(n>223)+(n>239);if(e+s>i.length)return{s:t,r:Il(i,e-1)};s?s==3?(n=((n&15)<<18|(i[e++]&63)<<12|(i[e++]&63)<<6|i[e++]&63)-65536,t+=String.fromCharCode(55296|n>>10,56320|n&1023)):s&1?t+=String.fromCharCode((n&31)<<6|i[e++]&63):t+=String.fromCharCode((n&15)<<12|(i[e++]&63)<<6|i[e++]&63):t+=String.fromCharCode(n)}};function S_(i,t){if(t){for(var e="",n=0;n<i.length;n+=16384)e+=String.fromCharCode.apply(null,i.subarray(n,n+16384));return e}else{if(Pl)return Pl.decode(i);var s=M_(i),r=s.s,e=s.r;return e.length&&je(8),r}}var b_=function(i,t){return t+30+Mn(i,t+26)+Mn(i,t+28)},w_=function(i,t,e){var n=Mn(i,t+28),s=S_(i.subarray(t+46,t+46+n),!(Mn(i,t+8)&2048)),r=t+46+n,a=un(i,t+20),o=e&&a==4294967295?E_(i,r):[a,un(i,t+24),un(i,t+42)],l=o[0],c=o[1],h=o[2];return[Mn(i,t+10),l,c,s,r+Mn(i,t+30)+Mn(i,t+32),h]},E_=function(i,t){for(;Mn(i,t)!=1;t+=4+Mn(i,t+2));return[Sl(i,t+12),Sl(i,t+4),Sl(i,t+20)]};function T_(i,t){for(var e={},n=i.length-22;un(i,n)!=101010256;--n)(!n||i.length-n>65558)&&je(13);var s=Mn(i,n+8);if(!s)return{};var r=un(i,n+16),a=r==4294967295||s==65535;if(a){var o=un(i,n-12);a=un(i,o)==101075792,a&&(s=un(i,o+32),r=un(i,o+48))}for(var l=0;l<s;++l){var c=w_(i,r,a),h=c[0],u=c[1],d=c[2],p=c[3],g=c[4],y=c[5],m=b_(i,y);r=g,h?h==8?e[p]=y_(i.subarray(m,m+u),{out:new He(d)}):je(14,"unknown compression type "+h):e[p]=Il(i,m,m+u)}return e}var qa=i=>typeof i=="number"&&Number.isFinite(i),Jn=(i,t)=>{let e=i[t];if(typeof e!="object"||e===null)throw new Error(`Invalid SOG metadata section: ${t}`);return e},Kn=(i,t)=>{let e=i.files;if(!Array.isArray(e))throw new Error(`${t}.files is not an array`);if(!e.every(n=>typeof n=="string"))throw new Error(`${t}.files contains non-strings`);return e},bl=(i,t)=>{let e=i.mins,n=i.maxs;if(!Array.isArray(e)||e.length!==3)throw new Error(`${t}.mins must be length-3`);if(!Array.isArray(n)||n.length!==3)throw new Error(`${t}.maxs must be length-3`);if(![...e,...n].every(qa))throw new Error(`${t}.mins/maxs must be finite numbers`);return{mins:[e[0],e[1],e[2]],maxs:[n[0],n[1],n[2]]}},A_=(i,t)=>{let e=i.mins,n=i.maxs;if(!Array.isArray(e)||e.length!==4)throw new Error(`${t}.mins must be length-4`);if(!Array.isArray(n)||n.length!==4)throw new Error(`${t}.maxs must be length-4`);if(![...e,...n].every(qa))throw new Error(`${t}.mins/maxs must be finite numbers`);return{mins:[e[0],e[1],e[2],e[3]],maxs:[n[0],n[1],n[2],n[3]]}},Vh=(i,t)=>{let e=i.codebook;if(!Array.isArray(e))throw new Error(`${t}.codebook is not an array`);if(!e.every(qa))throw new Error(`${t}.codebook contains non-finite numbers`);return e},Hh=i=>{if(typeof i!="object"||i===null)throw new Error("Invalid SOG metadata: not an object");let t=i,e=t.version??1;if(e!==1&&e!==2)throw new Error(`Unsupported SOG version: ${String(e)}`);if(e===1){let c=Jn(t,"means"),h=Jn(t,"sh0"),u=Jn(t,"quats"),d=Jn(t,"scales"),p=typeof t.count=="number"&&Number.isFinite(t.count)?t.count:void 0,g=Array.isArray(c.shape)?c.shape:void 0,y=g&&typeof g[0]=="number"?g[0]:void 0;if(p===void 0&&y===void 0)throw new Error("Invalid SOGS metadata: unable to determine splat count");if(p!==void 0&&y!==void 0&&p!==y)throw new Error("Inconsistent SOGS metadata: count does not match means.shape[0]");return{version:1,numSplats:(p??y)|0,files:{sh0:Kn(h,"sh0"),means:Kn(c,"means"),quats:Kn(u,"quats"),scales:Kn(d,"scales")},ranges:{sh0:A_(h,"sh0"),means:bl(c,"means"),scales:bl(d,"scales")}}}let n=t.count;if(!qa(n))throw new Error('Invalid SOG v2 metadata: missing/invalid "count"');let s=n|0,r=Jn(t,"means"),a=Jn(t,"sh0"),o=Jn(t,"quats"),l=Jn(t,"scales");return{version:2,numSplats:s,files:{sh0:Kn(a,"sh0"),means:Kn(r,"means"),quats:Kn(o,"quats"),scales:Kn(l,"scales")},ranges:{means:bl(r,"means"),sh0:{codebook:Vh(a,"sh0")},scales:{codebook:Vh(l,"scales")}},antialias:typeof t.antialias=="boolean"?t.antialias:void 0}},Xa=class extends _n{constructor(t,e){super(t),this.withCredentials=e?.withCredentials??!1}isZipBuffer(t){if(t.byteLength<4)return!1;let e=new Uint8Array(t,0,4);return e[0]===80&&e[1]===75&&e[2]===3&&e[3]===4}load(t,e,n,s){let r=new qn(this.manager);r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setPath(this.path),r.setWithCredentials(this.withCredentials),r.load(t,a=>{this.parseAsync(t,a).then(o=>{e&&e(o)}).catch(o=>{this.manager.itemError(t),s&&s(o),console.error("Error loading SOGS meta:",o)})},n,s)}loadAsync(t,e){return new Promise((n,s)=>{let r=new qn(this.manager);r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setPath(this.path),r.setWithCredentials(this.withCredentials),r.load(t,a=>{this.parseAsync(t,a).then(n).catch(o=>{s(o),this.manager.itemError(t)})},e,a=>{s(a),this.manager.itemError(t)})})}async parseAsync(t,e){if(!(e instanceof ArrayBuffer))throw new Error("SOGS loader: expected ArrayBuffer payload");if(this.isZipBuffer(e))return this.parseZipAsync(e);let n=new TextDecoder("utf-8").decode(e),s=JSON.parse(n);return this.parseMetaAsync(t,s)}async parseMetaAsync(t,e){let n=Hh(e),{numSplats:s,files:r,ranges:a,version:o}=n,l=new $i(this.manager);l.setPath(this.path),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials);let c=(b,v)=>{try{return new URL(v,b).toString()}catch{return b.substring(0,b.lastIndexOf("/")+1)+v}},h=(b,v)=>{let P=c(t,b);return new Promise((R,E)=>{l.load(P,T=>{T.generateMipmaps=!1,T.magFilter=le,T.minFilter=le,T.flipY=!1,R(T)},void 0,T=>{let S=T instanceof Error?T.message:String(T);E(new Error(`SOGS loader: failed to load ${v} (${b}): ${S}`))})})};if(!Array.isArray(r.sh0)||r.sh0.length<1)throw new Error("SOGS loader: files.sh0 must have at least 1 entry (sh0)");if(!Array.isArray(r.means)||r.means.length<2)throw new Error("SOGS loader: files.means must have at least 2 entries (means_l, means_u)");if(!Array.isArray(r.quats)||r.quats.length<1)throw new Error("SOGS loader: files.quats must have at least 1 entry");if(!Array.isArray(r.scales)||r.scales.length<1)throw new Error("SOGS loader: files.scales must have at least 1 entry");let[u,d,p,g,y]=await Promise.all([h(r.means[0],"means_l"),h(r.means[1],"means_u"),h(r.quats[0],"quats"),h(r.scales[0],"scales"),h(r.sh0[0],"sh0")]),m={means_l:u,means_u:d,quats:p,scales:g,sh0:y};if(o===1){let b=new Ha(s,a,m),v=wi.packSogs(b);return b.dispose(),v}let f=new Ga(s,a,m),A=wi.packSog2(f);return f.dispose(),A}async parseZipAsync(t){let e=T_(new Uint8Array(t)),n=Object.keys(e),s=n.find(_=>_.toLowerCase().endsWith("meta.json"))??null;if(!s)throw new Error("SOGS loader: zip missing meta.json");let r=s.includes("/")?s.slice(0,s.lastIndexOf("/")+1):"",a=new TextDecoder,o=JSON.parse(a.decode(e[s])),l=Hh(o),{numSplats:c,files:h,ranges:u,version:d}=l,p=_=>_.replace(/\\/g,"/").replace(/^\.?\//,""),g=_=>{let C=p(_),G=[p(r+C),C];for(let z of G){let U=e[z];if(U)return U}let L=C.split("/").pop(),B=n.find(z=>p(z).endsWith("/"+C))??n.find(z=>p(z).endsWith("/"+L))??n.find(z=>p(z)===L)??null;if(B)return e[B];throw new Error(`SOGS loader: zip missing file "${_}"`)},y=_=>{let C=_.toLowerCase();return C.endsWith(".png")?"image/png":C.endsWith(".jpg")||C.endsWith(".jpeg")?"image/jpeg":C.endsWith(".webp")?"image/webp":"application/octet-stream"},m=new $i(this.manager);m.setRequestHeader(this.requestHeader),m.setWithCredentials(this.withCredentials);let f=(_,C)=>{let G=g(_),L=new Blob([G],{type:y(_)}),B=URL.createObjectURL(L);return new Promise((z,U)=>{m.load(B,H=>{URL.revokeObjectURL(B),H.generateMipmaps=!1,H.magFilter=le,H.minFilter=le,H.flipY=!1,z(H)},void 0,H=>{URL.revokeObjectURL(B);let V=H instanceof Error?H.message:String(H);U(new Error(`SOGS loader: failed to load ${C} from zip (${_}): ${V}`))})})};if(!Array.isArray(h.sh0)||h.sh0.length<1)throw new Error("SOGS loader: files.sh0 must have at least 1 entry (sh0)");if(!Array.isArray(h.means)||h.means.length<2)throw new Error("SOGS loader: files.means must have at least 2 entries (means_l, means_u)");if(!Array.isArray(h.quats)||h.quats.length<1)throw new Error("SOGS loader: files.quats must have at least 1 entry");if(!Array.isArray(h.scales)||h.scales.length<1)throw new Error("SOGS loader: files.scales must have at least 1 entry");let[A,b,v,P,R]=await Promise.all([f(h.means[0],"means_l"),f(h.means[1],"means_u"),f(h.quats[0],"quats"),f(h.scales[0],"scales"),f(h.sh0[0],"sh0")]),E={means_l:A,means_u:b,quats:v,scales:P,sh0:R};if(d===1){let _=new Ha(c,u,E),C=wi.packSogs(_);return _.dispose(),C}let T=new Ga(c,u,E),S=wi.packSog2(T);return T.dispose(),S}};var C_=()=>({lift:0,sway:0,roll:0,yaw:0,pitch:0,height:1,bend:0}),At=(i=0,t=1,e=0,n=0)=>({...C_(),roll:i,height:t,yaw:e,pitch:n}),R_=[At(),At(-3,.99,-1),At(-8,.98,-2),At(3,1.01,1),At(15,1.015,3),At(10,1.005,2),At(-6,.99,-1),At(-10,1,-2),At(-3,1.005,0),At(5,1,1),At(3,1,0),At(-1.5),At(),At()],Qh=[At(),At(-2,.99),At(-6,.94),At(0,1.045),At(5,1.025,1),At(9,1.01,2),At(10,1,3),At(6,1,2),At(-2,1.025,1),At(-11,.91,-2),At(7,1.02,1),At(4,1.005,1),At(-3,.995),At(1),At(),At()],tu=[At(),At(-3,.99,-3),At(-9,.94,-10),At(-12,1.04,0),At(-20,1.025,24),At(-27,1.01,78),At(-30,1,145),At(-30,1,225),At(-24,1,290),At(-13,1.015,333),At(-4,1.035,358),At(10,.91,367),At(-9,.985,365),At(6,1.02,358),At(-3,1,360),At(1,1,360),At(),At()];function eu(i,t,e,n,s){for(let r=t;r<=e;r++){let a=(r-t)/(e-t);i[r].lift=4*n*a*(1-a),i[r].sway=s*Math.sin(Math.PI*a)}}eu(Qh,3,9,.24,.045);eu(tu,3,11,.26,.06);function Ll(i){return Array.from({length:i.length+8},(t,e)=>{let n=e<=12?e/3:e-8,s=Math.floor(n),r=n-s;return i[s]+((i[s+1]??i[s])-i[s])*r})}var Dl=[[0,0,0],[4,1,1],[7,1,1],[11,-1,1],[14,-1,1],[18,1,0],[21,1,0],[25,0,-1],[28,0,-1],[40,0,0],[42,0,0]];function jh(i){let t=Dl.findIndex(([h])=>h>=i);if(t<=0)return{x:0,y:0};let[e,n,s]=Dl[t-1],[r,a,o]=Dl[t],l=(i-e)/(r-e),c=l*l*(3-2*l);return{x:n+(a-n)*c,y:s+(o-s)*c}}var Ya=Array.from({length:43},(i,t)=>({...jh(t),pitch:4*jh(Math.max(0,t-2)).y})),P_=[[0,1],[.015,.99],[.04,.97],[.08,.94],[.14,.9],[.22,.86],[.24,.86],[.24,.87],[.18,.91],[.08,.98],[-.05,1.06],[-.18,1.12],[-.24,1.14],[-.24,1.14],[-.2,1.11],[-.12,1.06],[-.02,1],[.07,.96],[.1,.95],[.08,.97],[.03,.99],[-.03,1.02],[-.04,1.02],[-.02,1.01],[0,1],[0,1]].map(([i,t])=>({...At(0,t),bend:i})),Sn={rock:{name:"Rock",frames:R_},hop:{name:"Little hop",frames:Qh},spin:{name:"Tilted spin",frames:tu},blink:{name:"Double blink",fps:24,frames:Array.from({length:24},()=>At())},look:{name:"Look around",frames:Ya.map(i=>At(0,1,0,i.pitch))},flex:{name:"Body flex",frames:P_},curious:{name:"Curiosity",frames:Ll([0,-1,-3,-5,-7,-7,-7,-7,-6,-4,-2,0,1,0,0,0,0,0]).map(i=>At(i,1,i*.35))}};function nu(i,t){let e=Sn[i].frames;return e[Math.max(0,Math.min(e.length-1,t))]}var Ul={hybrid:{file:"hybrid/kettle-body-32k.sog",count:32768,bytes:414243,title:"32k + curved eye recesses",eyes:!0},original:{file:"kettle.ply",count:262144,bytes:17826208,title:"Original PLY",eyes:!1},full:{file:"optimized/kettle-full.sog",count:262144,bytes:2992064,title:"SOG \xB7 full detail",eyes:!1},"64k":{file:"optimized/kettle-64k.sog",count:65536,bytes:800656,title:"SOG \xB7 64k",eyes:!1},"32k":{file:"optimized/kettle-32k.sog",count:32768,bytes:418296,title:"SOG \xB7 32k",eyes:!1}},Ks={min:[-.4453687369823456,-.4977874159812927,-.4721851348876953],max:[.471529483795166,.5043943524360657,.4717373847961426]};var Nl={coordinateSystem:"Original IDOL PLY coordinates; x is front and y is down",coefficients:[.38423788014943294,.5170498538257163,-.0036520446948364207,-1.0445970793462895,.009618536975603244,-.7799992722103738],colorCoefficients:[[.11755186608464822,-.23947375275012397,-.0031029024692677994],[.18958910635768797,-.20556295827577975,.0002871420605541326],[.2934991904964731,-.20585297131519326,.00716057612187883]],samples:363,rmsSourceUnits:.0022978462865689605,method:"Quadratic fit to robust upper-envelope navy samples outside both eye cavities"};var Ge=128,I_=[.107,-.108];function Za(i,t,e,n){let s=Math.min(n,t,e),r=Math.cos(i),a=Math.sin(i);return[(t-s)*Math.sign(r)+s*r,(e-s)*Math.sign(a)+s*a]}function D_(i,t,e=0){let[n,s,r,a,o,l]=Nl.coefficients,c=n+s*i+r*t+a*i*i+o*i*t+l*t*t+.0015,h=new D(1,-(s+2*a*i+o*t),-(r+o*i+2*l*t)).normalize();return[c-e*h.x,i-e*h.y,t-e*h.z]}function L_(i,t){return Nl.colorCoefficients.map(([e,n,s])=>Math.max(.018,Math.min(.4,e+n*i+s*t)))}function iu(i,t){let e=t.max.y-t.min.y,n=12,s=1+n*Ge,r=[];for(let d=0;d<Ge;d++)r.push(0,1+(d+1)%Ge,1+d);for(let d=1;d<n;d++)for(let p=0;p<Ge;p++){let g=1+(d-1)*Ge+p,y=1+d*Ge+p,m=1+(d-1)*Ge+(p+1)%Ge,f=1+d*Ge+(p+1)%Ge;r.push(g,f,y,g,m,f)}let a=new pi({vertexColors:!0}),o=I_.map(d=>{let p=new Ue;p.setIndex(r),p.setAttribute("position",new oe(new Float32Array(s*3),3).setUsage(Ia)),p.setAttribute("color",new oe(new Float32Array(s*3),3).setUsage(Ia));let g=new Ee(p,a);return g.frustumCulled=!1,i.add(g),{center:d,geometry:p,tones:new Float32Array(s),rgb:new Float32Array(s*3)}}),l=new D(1,1.3,.7).normalize(),c=new D,h=new Wt;function u(d,p,g,y,m,f){let[A,b,v]=D_(g,y,m);d.geometry.attributes.position.setXYZ(p,(A-t.center.x)/e,(t.max.y-b)/e,(t.center.z-v)/e),d.tones[p]=f,d.rgb.set(L_(g,y),p*3)}return{apply(d){o.forEach((p,g)=>{let y=d.open[g],m=.029*d.width,f=Math.max(.0018,.065*y),A=Math.max(.003,.027*Math.sqrt(y)),b=.103-(d.gazeY??0),v=p.center-d.gaze,P=Math.max(.06,y);u(p,0,b,v,A,2);for(let R=0;R<n;R++)for(let E=0;E<Ge;E++){let T=2*Math.PI*(E+.5)/Ge,S,_,C,G;if(R<4){let L=(R+1)/4;[S,_]=Za(T,m*L,f*L,.029*L),C=A,G=2}else if(R<8){let L=[.002,.004,.008,.011],B=[.95,.48,.1,0],z=[.26,.48,.78,1],U=R-4;[S,_]=Za(T,m+L[U],f+L[U]*P,.029+L[U]),C=A*B[U],G=z[U]}else{let L=(R-7)/4,B=Za(T,m+.011,f+.011*P,.04),z=Za(T,.078,.142,.065);S=(1-L)*(v+B[0])+L*(p.center+z[0])-v,_=(1-L)*B[1]+L*(.103+z[1]-b),C=0,G=1}u(p,1+R*Ge+E,b+_,v+S,C,G)}p.geometry.attributes.position.needsUpdate=!0,p.geometry.computeVertexNormals();for(let R=0;R<s;R++){c.fromBufferAttribute(p.geometry.attributes.normal,R);let E=.65+.35*Math.max(0,c.dot(l)),T=p.tones[R];if(T>1.5)h.setRGB(.99*E,.61*E,.2*E);else{let S=T===1?1:T*(.65+.35*Math.max(0,c.dot(l)));h.setRGB(p.rgb[R*3]*S,p.rgb[R*3+1]*S,p.rgb[R*3+2]*S)}h.convertSRGBToLinear(),p.geometry.attributes.color.setXYZ(R,h.r,h.g,h.b)}p.geometry.attributes.color.needsUpdate=!0})},vertices:s*2}}var U_=()=>({open:[1,1],width:1,gaze:0,gazeY:0}),N_=Ll([0,.1,.35,.7,1,1,1,1,1,.85,.65,.4,.2,.05,0,0,0,0]);function su(i,t){let e=U_();if(i==="blink"){let n=[4,5,12,13].includes(t),s=[3,6,11,14].includes(t);e.open=[n?.025:s?.5:1,n?.025:s?.5:1]}else if(i==="curious"){let n=N_[t]??0;e.open=[1-.55*n,1+.25*n],e.width=1+.035*n,e.gaze=-.011*n}else if(i==="look"){let n=Ya[t]??Ya[0];e.gaze=n.x?-.024*n.x:0,e.gazeY=.028*n.y}else if(i==="hop"||i==="spin"){let n=t===1?.5:t===2?.025:t===3?.6:1;e.open=[n,n]}return e}function ru(i){let t=new ie,e=new Ut,n=new ie,s=new D,r=new D,a=new D(1/0,1/0,1/0),o=new D;i.sort=l=>{i.options.autoSort&&(t.copy(i.matrixWorld).invert(),l.getWorldPosition(s).applyMatrix4(t),l.getWorldDirection(r),e.setFromMatrix4(i.matrixWorld).transpose(),r.applyMatrix3(e).normalize(),(!n.equals(i.matrixWorld)||a.distanceToSquared(s)>1e-6||o.dot(r)<.999)&&(n.copy(i.matrixWorld),a.copy(s),o.copy(r),i.sorter.setCamera(s,r)))}}var Qn=new URLSearchParams(location.search),cu=Object.hasOwn(Ul,Qn.get("asset"))?Qn.get("asset"):"hybrid",jn=Ul[cu],kl=document.querySelector("#quality");kl.value=cu;kl.onchange=()=>{Qn.set("asset",kl.value),location.search=Qn.toString()};var $a=document.querySelector("#stage"),Fl=document.querySelector("#status"),Ja=document.querySelector("#frame"),O_=document.querySelector("#frame-label"),hu=document.querySelector("#pause"),Qa=new As;Qa.background=new Wt("white");var hs=new we(35,1,.01,100),ei=new Fa({antialias:!0,preserveDrawingBuffer:!0});ei.setPixelRatio(Math.min(devicePixelRatio,2));ei.outputColorSpace=Re;$a.prepend(ei.domElement);var ti=new ka(hs,ei.domElement);ti.enablePan=!1;ti.minDistance=1.5;ti.maxDistance=16;var js=new fn;Qa.add(js);var Ei=new fn;Ei.matrixAutoUpdate=!1;js.add(Ei);var Qe=Object.hasOwn(Sn,Qn.get("motion"))?Qn.get("motion"):"blink",to=0,Vl=0,eo=!1,uu=!1,Hl=null,Ka=()=>Sn[Qe].fps??12,du=[],Ol=!1,ja=!0;function Qs(){ja=!0,!eo&&!Ol&&(Ol=!0,requestAnimationFrame(()=>{Ol=!1,ti.update(),ja=!1,ei.render(Qa,hs)}))}ti.addEventListener("change",Qs);var au=new ie,ou=new D,Bl=new ye,lu=new Le(0,0,0,"YXZ"),zl=new D,B_=new D,z_=document.querySelector("#duration");function Ti(i){to=i;let t=nu(Qe,i),e=Math.PI/180;lu.set(t.roll*e,t.yaw*e,t.pitch*e,"YXZ"),Bl.setFromEuler(lu);let n=1/Math.sqrt(t.height);zl.set(n,t.height,n),js.quaternion.copy(Bl),js.scale.copy(zl),Ei.matrix.set(1,t.bend,0,0,0,1,0,0,0,0,1,0,0,0,0,1),Ei.matrixWorldNeedsUpdate=!0,au.compose(B_,Bl,zl).multiply(Ei.matrix);let s=1/0;for(let r of du)ou.copy(r).applyMatrix4(au),s=Math.min(s,ou.y);js.position.set(0,t.lift-(Number.isFinite(s)?s:0),t.sway),Hl&&Hl.apply(su(Qe,i)),Ja.max=Sn[Qe].frames.length-1,Ja.value=i,O_.textContent=`Frame ${i+1} / ${Sn[Qe].frames.length}`,z_.textContent=`${(Sn[Qe].frames.length/Ka()).toFixed(2)} s \xB7 ${Ka()} fps`,Qs()}function tr(i){eo=i,hu.textContent=i?"Pause":"Play",i&&(Vl=performance.now()-to*1e3/Ka()),ei.setAnimationLoop(i?k_:null),Qs()}function fu(i){$a.dataset.view=i;let t={front:[3.6,.72,0],quarter:[3.18,.85,1.8],back:[-3.6,.72,0],side:[0,.72,3.6],logo:[13.5,1.25,0],detail:[1.75,.61,1]};hs.position.set(...t[i]),ti.target.set(0,i==="detail"?.4:.52,0),ti.update(),document.querySelectorAll("[data-view]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.view===i)))}fu(["front","quarter","back","side","logo","detail"].includes(Qn.get("view"))?Qn.get("view"):"front");new ResizeObserver(()=>{let{width:i,height:t}=$a.getBoundingClientRect();ei.setSize(i,t),hs.aspect=i/t,hs.updateProjectionMatrix(),Qs()}).observe($a);document.querySelectorAll("[data-view]").forEach(i=>i.onclick=()=>fu(i.dataset.view));document.querySelectorAll("[data-motion]").forEach(i=>i.onclick=()=>{Qe=i.dataset.motion,document.querySelectorAll("[data-motion]").forEach(t=>t.setAttribute("aria-pressed",String(t===i))),Ti(0),tr(!0)});hu.onclick=()=>{to===Sn[Qe].frames.length-1&&Ti(0),tr(!eo)};Ja.oninput=()=>{tr(!1),Ti(Number(Ja.value))};try{Fl.textContent=`Loading ${jn.title} \xB7 ${(jn.bytes/1e6).toFixed(2)} MB\u2026`;let i=jn.file.endsWith(".sog")?new Xa:new Wa,t=await i.loadAsync("./"+jn.file),e={min:new D(...Ks.min),max:new D(...Ks.max),center:new D(...Ks.min).add(new D(...Ks.max)).multiplyScalar(.5)},n=e.max.y-e.min.y,s=Math.max(1,Math.floor(t.numSplats/2048));for(let a=0;a<t.numSplats;a+=s)du.push(new D((t.centers[a*3]-e.center.x)/n,(e.max.y-t.centers[a*3+1])/n,(e.center.z-t.centers[a*3+2])/n));let r=new Xh(t,{autoSort:!0});ru(r),r.sorter.addEventListener("updated",Qs),r.scale.setScalar(1/n),r.rotation.x=Math.PI,r.position.set(-e.center.x/n,e.max.y/n,e.center.z/n),Ei.add(r),jn.eyes?Hl=iu(Ei,e):Qe="rock",uu=!0,Fl.textContent=`${jn.title} \xB7 ${t.numSplats.toLocaleString("en")} splats \xB7 ${(jn.bytes/1e6).toFixed(2)} MB`,i.dispose&&i.dispose(),document.querySelectorAll("button").forEach(a=>a.disabled=!!(a.dataset.eyeOnly&&!jn.eyes)),document.querySelector(`[data-motion="${Qe}"]`).setAttribute("aria-pressed","true"),Ti(0),matchMedia("(prefers-reduced-motion: reduce)").matches||tr(!0)}catch(i){Fl.textContent=`Could not render the model: ${i.message}`,console.error(i)}function k_(i){if(uu&&eo){let t=Math.max(0,Math.floor((i-Vl)*Ka()/1e3));t>=Sn[Qe].frames.length?document.querySelector("#loop").checked?(Vl=i,Ti(0)):(Ti(Sn[Qe].frames.length-1),tr(!1)):t!==to&&Ti(t)}ti.update(),ja&&(ja=!1,ei.render(Qa,hs))}
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
