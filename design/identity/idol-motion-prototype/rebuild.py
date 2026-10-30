"""Rebuild this isolated study; optional local model conversion, no API calls."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--models', action='store_true', help='Also regenerate every SOG model')
parser.add_argument('--eyes', action='store_true', help='Regenerate only the hybrid body before bundling')
args = parser.parse_args()
converter = ['npm', 'exec', '--yes', '--package=@playcanvas/splat-transform@3.10.3', '--', 'splat-transform', '-w', '-g', 'cpu', '--max-workers', '2']
if args.models:
    subprocess.run(converter + [str(HERE/'kettle.ply'), str(HERE/'optimized/kettle-full.sog')], check=True)
    with tempfile.TemporaryDirectory(prefix='aimharder-kettle-') as scratch:
        for count, label in [(65536, '64k'), (32768, '32k')]:
            intermediate = str(Path(scratch)/f'{label}.ply')
            subprocess.run(converter + [str(HERE/'kettle.ply'), '--decimate', str(count), intermediate], check=True)
            subprocess.run(converter + [intermediate, str(HERE/f'optimized/kettle-{label}.sog')], check=True)

if args.models or args.eyes:
    with tempfile.TemporaryDirectory(prefix='aimharder-eye-body-') as scratch:
        clean=str(Path(scratch)/'clean.ply')
        decimated=str(Path(scratch)/'32k.ply')
        subprocess.run(['python3',str(HERE/'hybrid/prepare-body.py'),clean],check=True)
        subprocess.run(converter+[clean,'--decimate','32768',decimated],check=True)
        subprocess.run(converter+[decimated,str(HERE/'hybrid/kettle-body-32k.sog')],check=True)

profiles = {}
source_bytes = (HERE/'kettle.ply').stat().st_size
for key, filename, count, title in [
    ('hybrid', 'hybrid/kettle-body-32k.sog', 32768, '32k + curved eye recesses'),
    ('original', 'kettle.ply', 262144, 'Original PLY'),
    ('full', 'optimized/kettle-full.sog', 262144, 'SOG · full detail'),
    ('64k', 'optimized/kettle-64k.sog', 65536, 'SOG · 64k'),
    ('32k', 'optimized/kettle-32k.sog', 32768, 'SOG · 32k'),
]:
    data = (HERE/filename).read_bytes()
    profiles[key] = dict(file=filename, count=count, bytes=len(data), title=title,eyes=key=='hybrid')

bounds = {'min': [-0.4453687369823456,-0.4977874159812927,-0.4721851348876953], 'max': [0.471529483795166,0.5043943524360657,0.4717373847961426]}
(HERE/'asset-profiles.js').write_text('export const PROFILES = '+json.dumps(profiles,indent=2)+';\n// Canonical framing from the unchanged source PLY, shared by all profiles.\nexport const SOURCE_BOUNDS = '+json.dumps(bounds)+';\n')
subprocess.run([
    'npm','exec','--yes','--package=esbuild@0.25.12','--','esbuild',
    str(HERE/'motion.js'),'--bundle','--minify','--format=esm','--target=es2022',
    '--alias:three='+str(HERE/'vendor/three.module.js'),'--legal-comments=eof',
    '--outfile='+str(HERE/'motion.bundle.js')
], check=True, cwd=ROOT)

bundle = (HERE/'motion.bundle.js').read_bytes()
report = {
    'tools': {'splat-transform':'3.10.3','esbuild':'0.25.12'},
    'baseline': {'commit':'ff717ef','javascriptBytes':2097151,'sourceGzipEstimateBytes':13396475},
    'sourceSha256': hashlib.sha256((HERE/'kettle.ply').read_bytes()).hexdigest(),
    'javascript': {'bundleBytes':len(bundle), 'gzipEstimateBytes':len(gzip.compress(bundle,compresslevel=9,mtime=0)), 'gzipActuallyServed':False},
    'profiles': {}
}
for key, profile in profiles.items():
    data = (HERE/profile['file']).read_bytes()
    report['profiles'][key] = {
        **profile, 'sha256':hashlib.sha256(data).hexdigest(),
        'modelReductionPercent':round((1-len(data)/source_bytes)*100,2),
        'bundlePlusModelBytes':len(bundle)+len(data)
    }
(HERE/'optimized/manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
