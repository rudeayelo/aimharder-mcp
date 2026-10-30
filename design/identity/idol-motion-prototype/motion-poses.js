// Hand-posed stop-motion exposures. Timing is in frames, not display refreshes.
export const FPS = 12;
const neutral = () => ({ lift:0, sway:0, roll:0, yaw:0, pitch:0, height:1 });
const pose = (roll=0, height=1, yaw=0, pitch=0) => ({...neutral(), roll, height, yaw, pitch});

// Unequal spacing gives a quick impulse and a slower, diminishing recovery.
const rock = [
  pose(), pose(-3,.99,-1), pose(-8,.98,-2), pose(3,1.01,1),
  pose(15,1.015,3), pose(10,1.005,2), pose(-6,.99,-1),
  pose(-10,1,-2), pose(-3,1.005,0), pose(5,1,1),
  pose(3,1,0), pose(-1.5), pose(), pose()
];
const hop = [
  pose(), pose(-2,.99), pose(-6,.94), pose(0,1.045),
  pose(5,1.025,1), pose(9,1.01,2), pose(10,1,3),
  pose(6,1,2), pose(-2,1.025,1), pose(-11,.91,-2),
  pose(7,1.02,1), pose(4,1.005,1), pose(-3,.995),
  pose(1), pose(), pose()
];
const spin = [
  pose(), pose(-3,.99,-3), pose(-9,.94,-10), pose(-12,1.04,0),
  pose(-20,1.025,24), pose(-27,1.01,78), pose(-30,1,145),
  pose(-30,1,225), pose(-24,1,290), pose(-13,1.015,333),
  pose(-4,1.035,358), pose(10,.91,367), pose(-9,.985,365),
  pose(6,1.02,358), pose(-3,1,360), pose(1,1,360), pose(), pose()
];
function flight(track, takeoff, landing, height, sideways) {
  // A parabola changes spacing naturally: fast near the ground, slow at the apex.
  for (let f=takeoff; f<=landing; f++) {
    const t=(f-takeoff)/(landing-takeoff);
    track[f].lift=4*height*t*(1-t);
    track[f].sway=sideways*Math.sin(Math.PI*t);
  }
}
flight(hop,3,9,.24,.045);
flight(spin,3,11,.26,.06);

// Stretch only the four-frame approach to twelve frames. Hold and return keep
// their original exposure spacing; body and eyes share this timing.
export function curiosityTrack(values) {
  return Array.from({length:values.length+8},(_,frame)=>{
    const sourceFrame=frame<=12?frame/3:frame-8;
    const before=Math.floor(sourceFrame), fraction=sourceFrame-before;
    return values[before]+((values[before+1]??values[before])-values[before])*fraction;
  });
}
export const CLIPS = {
  rock:{name:'Rock', frames:rock},
  hop:{name:'Little hop', frames:hop},
  spin:{name:'Tilted spin', frames:spin},
  blink:{name:'Double blink',fps:24,frames:Array.from({length:24},()=>pose())},
  curious:{name:'Curiosity',frames:curiosityTrack([0,-1,-3,-5,-7,-7,-7,-7,-6,-4,-2,0,1,0,0,0,0,0]).map(angle=>pose(angle,1,angle*.35))}
};
export function poseAt(mode, frame) {
  const frames=CLIPS[mode].frames;
  return frames[Math.max(0,Math.min(frames.length-1,frame))];
}
