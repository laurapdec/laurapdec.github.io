import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { FaMapMarkerAlt } from 'react-icons/fa'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function MapView({ onSelectLocation, selectedLocationId, className = '' }){
  const [locations, setLocations] = useState([])
  const [active, setActive] = useState(null)
    const [hovered, setHovered] = useState(null)
    const containerRef = useRef(null)
    const [projScale, setProjScale] = useState(120)

  useEffect(()=>{
    fetch('/data/locations.json').then(r=>r.json()).then(setLocations).catch(()=>setLocations([]))
  },[])

    // adapt projection scale to container width so map doesn't overwhelm layout
    useEffect(()=>{
        function updateScale(){
            const w = containerRef.current?.clientWidth || 800
            // choose sane scale breakpoints
            let s = 120
            if (w < 480) s = 70
            else if (w < 768) s = 100
            else if (w < 1100) s = 140
            else s = 160
            setProjScale(s)
        }
        updateScale()
        window.addEventListener('resize', updateScale)
        return () => window.removeEventListener('resize', updateScale)
    },[])

    return (
        <div ref={containerRef} className={`w-full max-w-full h-80 md:h-[48vh] mx-auto flex items-center justify-center relative ${className}`}>
        <div className="card p-4 w-full h-full">
            <ComposableMap
                projectionConfig={{ scale: projScale }}
                style={{ width: '100%', height: '100%' }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map(geo => (
                            <Geography key={geo.rsmKey} geography={geo} fill="#eeeeee" stroke="#0060b9ff" />
                        ))
                    }
                </Geographies>
                                                            {locations.map((loc) => (
                                                                <Marker key={loc.id} coordinates={[loc.lon, loc.lat]}>
                                                                    <g transform="translate(-12, -24)"
                                                                     onPointerEnter={(e)=>{
                                                                                 const rect = containerRef.current?.getBoundingClientRect()
                                                                                 const x = rect ? e.clientX - rect.left : e.clientX
                                                                                 const y = rect ? e.clientY - rect.top : e.clientY
                                                                                 setHovered({loc, x, y})
                                                                             }}
                                                                     onPointerMove={(e)=>{
                                                                                 const rect = containerRef.current?.getBoundingClientRect()
                                                                                 const x = rect ? e.clientX - rect.left : e.clientX
                                                                                 const y = rect ? e.clientY - rect.top : e.clientY
                                                                                 setHovered(prev=> prev ? {...prev, x, y} : {loc, x, y})
                                                                             }}
                                                                     onPointerLeave={()=>setHovered(null)}
                                                                     onClick={() => {
                                                                         setActive(loc)
                                                                         if (onSelectLocation) onSelectLocation(loc.id)
                                                                     }}
                                                                     style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
                                                                                                    <FaMapMarkerAlt size={ selectedLocationId === loc.id ? 32 : 24 } color={ selectedLocationId === loc.id ? '#f472b6' : '#06b6d4' } style={{ filter: 'drop-shadow(0 2px 4px #0004)' }} />
                                                                                                    {selectedLocationId === loc.id && (
                                                                                                        <text x={28} y={6} fontSize={12} fill="#000000ff" stroke="#0b1220" strokeWidth={0.5} style={{ paintOrder: 'stroke' }}>{loc.name}</text>
                                                                                                    )}
                                                </g>
                                <rect x={-20} y={-40} width={40} height={40} fill="transparent" style={{pointerEvents: 'none'}} />
                            </Marker>
                        ))}
            </ComposableMap>
        </div>

    <AnimatePresence>
            {active && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
                    <motion.div className="bg-gray-900 rounded-lg p-6 max-w-xl" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-2">{active.name}</h3>
                        {active.institution && <div className="muted mb-2">{active.institution}</div>}
                        {active.years && <div className="mb-2">{active.years}</div>}
                        {active.description && <p className="mb-3">{active.description}</p>}
                        {active.projects && active.projects.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Projects</h4>
                                <ul className="mt-2 muted">{active.projects.map((p, idx) => (<li key={idx}>{p}</li>))}</ul>
                            </div>
                        )}
                        <div className="mt-4 text-right"><button onClick={() => setActive(null)} className="px-4 py-2 bg-accent rounded text-black">Close</button></div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        {/* hover tooltip - single tooltip prevents overlapping labels */}
        <AnimatePresence>
            {hovered && hovered.loc && (
                    <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: hovered.x + 12,
                        top: hovered.y - 36,
                        transform: 'translate(0,0)'
                    }}
                >
                    <div className="bg-gray-900 text-white text-sm rounded py-1 px-2 shadow-lg whitespace-nowrap">
                        <strong className="block">{hovered.loc.name}</strong>
                        {hovered.loc.years && <span className="muted text-xs">{hovered.loc.years}</span>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)
}
