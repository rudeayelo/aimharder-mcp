"""Fit the curved face and clear complete fixed sockets for deformable recesses."""
from pathlib import Path
import argparse,array,hashlib,json,math,statistics

parser=argparse.ArgumentParser()
parser.add_argument('output',help='Temporary PLY destination')
args=parser.parse_args()
here=Path(__file__).resolve().parent
source=here.parent/'kettle.ply'
b=source.read_bytes();offset=b.index(b'end_header\n')+11
values=array.array('f',b[offset:])

def capsule_distance(y,z,cy=.103,cz=.107,half=.125,radius=.070):
    return math.hypot(z-cz,max(0,abs(y-cy)-(half-radius)))-radius

def solve(rows,targets):
    n=len(rows[0]);m=[[sum(r[i]*r[j] for r in rows) for j in range(n)]+[sum(r[i]*v for r,v in zip(rows,targets))] for i in range(n)]
    for i in range(n):
        pivot=max(range(i,n),key=lambda j:abs(m[j][i]));m[i],m[pivot]=m[pivot],m[i]
        divisor=m[i][i]
        if abs(divisor)<1e-12:raise ValueError('Degenerate face fit')
        m[i]=[v/divisor for v in m[i]]
        for j in range(n):
            if j!=i:
                factor=m[j][i];m[j]=[a-factor*c for a,c in zip(m[j],m[i])]
    return [row[-1] for row in m]

def terms(y,z):return [1,y,z,y*y,y*z,z*z]
def evaluate(coeff,y,z):return sum(a*v for a,v in zip(coeff,terms(y,z)))

# Use upper-envelope navy samples surrounding the sockets, never the cavity walls.
cells={}
for i in range(0,len(values),17):
    x,y,z=values[i:i+3]
    rgb=[.5+.28209479177387814*values[i+j] for j in (6,7,8)]
    if not(x>.30 and -.055<y<.285 and abs(z)<.265 and values[i+9]>2 and rgb[0]<.18 and rgb[1]<.23 and .07<rgb[2]<.33):continue
    if min(capsule_distance(y,z,half=.112,radius=.059),capsule_distance(y,z,cz=-.108,half=.112,radius=.059))<0:continue
    cells.setdefault((round(y/.018),round(z/.018)),[]).append((x,y,z,*rgb))
samples=[]
for points in cells.values():
    if len(points)<3:continue
    points.sort();samples.append(points[int((len(points)-1)*.85)])
for iteration in range(3):
    coeff=solve([terms(p[1],p[2])for p in samples],[p[0]for p in samples])
    if iteration<2:samples=[p for p in samples if abs(p[0]-evaluate(coeff,p[1],p[2]))<.012]
color_coeff=[solve([[1,p[1],p[2]]for p in samples],[p[j]for p in samples])for j in (3,4,5)]
fit={'coordinateSystem':'Original IDOL PLY coordinates; x is front and y is down','coefficients':coeff,'colorCoefficients':color_coeff,'samples':len(samples),'rmsSourceUnits':math.sqrt(statistics.mean((p[0]-evaluate(coeff,p[1],p[2]))**2 for p in samples)),'method':'Quadratic fit to robust upper-envelope navy samples outside both eye cavities'}
(here/'face-surface.json').write_text(json.dumps(fit,indent=2)+'\n')
(here/'face-surface.js').write_text('export const SURFACE = '+json.dumps(fit,indent=2)+';\n')
changed=0
for i in range(0,len(values),17):
    x,y,z=values[i:i+3]
    if min(capsule_distance(y,z),capsule_distance(y,z,cz=-.108))>=0:continue
    surface=evaluate(coeff,y,z)
    if x<surface-.09:continue
    # Remove the entire original recess, including the stationary rim and wall.
    # Keep dark backing well behind the new dynamically carved surface.
    values[i]=surface-.085
    for j,c in zip((6,7,8),color_coeff):
        color=max(.015,min(.4,c[0]+c[1]*y+c[2]*z))
        values[i+j]=(color-.5)/.28209479177387814
    changed+=1
Path(args.output).write_bytes(b[:offset]+values.tobytes())
manifest={'sourceSha256':hashlib.sha256(b).hexdigest(),'editedGaussians':changed,'operation':'Clear complete original eye cavities, rims and warm fill within bounded capsule regions; place navy backing 0.085 source units behind the fitted curved face; source unchanged','surfaceFit':'face-surface.json','subsequentProcessing':'Decimate to 32768 Gaussians; encode SOG v2','ownerAcceptance':'pending'}
(here/'body-edit.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'edit':manifest,'surface':fit},indent=2))
