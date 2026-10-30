"""Create an eye-free derivative for the hybrid study; original PLY stays untouched."""
from pathlib import Path
import argparse,array,hashlib,json

parser=argparse.ArgumentParser()
parser.add_argument('output',help='Temporary PLY destination')
args=parser.parse_args()
here=Path(__file__).resolve().parent
source=here.parent/'kettle.ply'
b=source.read_bytes();offset=b.index(b'end_header\n')+11
values=array.array('f',b[offset:]);changed=0
for i in range(0,len(values),17):
    x,y,z=values[i:i+3]
    r,g,blue=(.5+.28209479177387814*values[i+j] for j in (6,7,8))
    # Restrict removal to the two existing eye wells; retain the dark rims.
    if x>.34 and -.005<y<.19 and .052<abs(z)<.163 and r>.17 and r>g*1.06 and r>blue*1.45:
        # Recess the former orange fill and recolor it as navy backing. This
        # preserves an opaque socket behind the new independently animated eye.
        values[i] = x-.028
        for j,color in zip((6,7,8),(.065,.115,.18)):
            values[i+j]=(color-.5)/.28209479177387814
        changed+=1
Path(args.output).write_bytes(b[:offset]+values.tobytes())
manifest={'sourceSha256':hashlib.sha256(b).hexdigest(),'editedGaussians':changed,'operation':'Navy backing and 0.028 source-unit recession of warm eye-fill Gaussians inside fixed eye ROIs; no source overwrite','subsequentProcessing':'Decimate to 32768 Gaussians; encode SOG v2','ownerAcceptance':'pending'}
(here/'body-edit.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
