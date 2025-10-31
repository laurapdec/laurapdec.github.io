"""
Generates a locations JSON for the frontend map using equirectangular projection.
Run: python3 tools/generate_locations.py
This will write `public/data/locations.json` that the React app can fetch.

Fields: id, name, institution, years, description, projects, lat, lon, x, y
x/y are percentages suitable for absolute positioning on an equirectangular world map image.
"""
import json
from math import isfinite

# Locations with real lat/lon (adjustable)
locations = [
    {
        "id": "ensma",
        "name": "ISAE-ENSMA (École Nationale Supérieure de Mécanique et d’Aérotechnique)",
        "institution": "ISAE-ENSMA (École Nationale Supérieure de Mécanique et d’Aérotechnique) (ENSMA)",
        "years": "2021-2024 (Feb)",
        "description": "Mastère (Research) - Aéronautique et Espace; Diplôme d'Ingénieur.",
        "projects": ["Research projects in aeronautics"],
        "lat": 46.651,
        "lon": 0.416
    },
    {
        "id": "ufu",
        "name": "UFU",
        "institution": "Federal University of Uberlândia",
        "years": "until 2021",
        "description": "Undergraduate studies in engineering.",
        "projects": ["Undergrad projects"],
        "lat": -18.912,
        "lon": -48.275
    },
    {
        "id": "safran",
        "name": "Safran (Internship)",
        "institution": "Safran",
        "years": "Internship",
        "description": "Industrial internship in aerospace engineering.",
        "projects": ["Industrial project work"],
        "lat": 48.866,
        "lon": 2.333
    },
    {
        "id": "airbus",
        "name": "Airbus (PhD)",
        "institution": "Airbus",
        "years": "PhD candidacy (stopped)",
        "description": "PhD work in aerospace (discontinued).",
        "projects": ["PhD research"],
        "lat": 43.6045,
        "lon": 1.444
    },
    {
        "id": "iit",
        "name": "IIT (placeholder)",
        "institution": "IIT - please update campus",
        "years": "",
        "description": "Add exact IIT campus latitude/longitude to place this pin accurately.",
        "projects": [],
        "lat": 12.9916,
        "lon": 80.2337
    }
]

# equirectangular projection to x/y percent
def latlon_to_pct(lat, lon):
    # lon: -180..180 -> x: 0..100
    # lat: 90..-90 -> y: 0..100
    x = (lon + 180.0) / 360.0 * 100.0
    y = (90.0 - lat) / 180.0 * 100.0
    if not (isfinite(x) and isfinite(y)):
        raise ValueError('Invalid lat/lon')
    return round(x, 4), round(y, 4)

out = []
for loc in locations:
    x, y = latlon_to_pct(loc['lat'], loc['lon'])
    loc_out = {k: loc[k] for k in ('id','name','institution','years','description','projects')}
    loc_out.update({'lat': loc['lat'], 'lon': loc['lon'], 'x': x, 'y': y})
    out.append(loc_out)

output_path = 'public/data/locations.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=2, ensure_ascii=False)

print(f'Wrote {len(out)} locations to {output_path}')
