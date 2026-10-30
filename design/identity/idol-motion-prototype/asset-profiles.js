export const PROFILES = {
  "hybrid": {
    "file": "hybrid/kettle-body-32k.sog",
    "count": 32768,
    "bytes": 414243,
    "title": "32k + curved eye recesses",
    "eyes": true
  },
  "original": {
    "file": "kettle.ply",
    "count": 262144,
    "bytes": 17826208,
    "title": "Original PLY",
    "eyes": false
  },
  "full": {
    "file": "optimized/kettle-full.sog",
    "count": 262144,
    "bytes": 2992064,
    "title": "SOG \u00b7 full detail",
    "eyes": false
  },
  "64k": {
    "file": "optimized/kettle-64k.sog",
    "count": 65536,
    "bytes": 800656,
    "title": "SOG \u00b7 64k",
    "eyes": false
  },
  "32k": {
    "file": "optimized/kettle-32k.sog",
    "count": 32768,
    "bytes": 418296,
    "title": "SOG \u00b7 32k",
    "eyes": false
  }
};
// Canonical framing from the unchanged source PLY, shared by all profiles.
export const SOURCE_BOUNDS = {"min": [-0.4453687369823456, -0.4977874159812927, -0.4721851348876953], "max": [0.471529483795166, 0.5043943524360657, 0.4717373847961426]};
