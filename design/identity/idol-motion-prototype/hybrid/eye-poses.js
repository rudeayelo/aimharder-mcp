const neutral=()=>({open:[1,1],width:1,gaze:0});
export function eyePoseAt(mode,frame) {
  const pose=neutral();
  if(mode==='blink') {
    // Two quick blinks: one halfway exposure, two closed, one halfway.
    // Four open exposures separate the blinks. Eye-only playback is 24 fps.
    const closed=[4,5,12,13].includes(frame);
    const half=[3,6,11,14].includes(frame);
    pose.open=[closed?.025:half?.5:1,closed?.025:half?.5:1];
  } else if(mode==='curious') {
    const strength=[0,.1,.35,.7,1,1,1,1,1,.85,.65,.4,.2,.05,0,0,0,0][frame]??0;
    pose.open=[1-.12*strength,1+.12*strength];
    pose.width=1+.035*strength;
    pose.gaze=-.011*strength;
  } else if(mode==='hop'||mode==='spin') {
    const open=frame===1?.5:frame===2?.025:frame===3?.6:1;
    pose.open=[open,open];
  }
  return pose;
}
