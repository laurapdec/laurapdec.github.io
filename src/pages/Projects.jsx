import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCard from '../components/ProjectCard'

// simple heuristic tag mapping
const KEYWORD_TAGS = [
  ['pytorch', 'PyTorch'],
  ['pytorch', 'Deep Learning'],
  ['tensorflow', 'TensorFlow'],
  ['slAM', 'SLAM'],
  ['slam', 'SLAM'],
  ['cv', 'Computer Vision'],
  ['vision', 'Computer Vision'],
  ['cfd', 'CFD'],
  ['combust', 'CFD'],
  ['python', 'Python'],
  ['fortran', 'Fortran'],
  ['catia', 'CAD'],
  ['onnx', 'ONNX'],
  ['web', 'Web'],
  ['react', 'Web'],
  ['model compression', 'Model Compression'],
  ['compression', 'Model Compression'],
  ['slAM', 'SLAM']
]

function deriveTags(p) {
  const text = `${p.title || ''} ${p.description || ''}`.toLowerCase()
  const tags = new Set((p.tags || []).map(t => (''+t).toString()))
  for (const [kw, tag] of KEYWORD_TAGS) {
    if (text.includes(kw.toLowerCase())) tags.add(tag)
  }
  // ensure ML/CV presence if likely
  if (text.includes('vision') || text.includes('slam') || text.includes('depth') || text.includes('camera')) tags.add('Computer Vision')
  if (text.includes('pytorch') || text.includes('neural') || text.includes('network')) tags.add('Machine Learning')
  return Array.from(tags)
}

export default function Projects() {
  const { t } = useTranslation()
  const raw = t('projects', { returnObjects: true }) || []
  const projects = useMemo(() => raw.map(p => ({ ...p, _tags: deriveTags(p) })), [raw])

  // build tag list
  const allTags = useMemo(() => {
    const m = new Map()
    projects.forEach(p => {
      (p._tags || []).forEach(tag => m.set(tag, (m.get(tag) || 0) + 1))
    })
    return Array.from(m.entries()).sort((a,b) => b[1]-a[1]).map(e=>e[0])
  }, [projects])

  const [filter, setFilter] = useState(null)

  const visible = filter ? projects.filter(p => (p._tags || []).includes(filter)) : projects

  return (
  <div className="site-scroll" style={{paddingTop: '174px'}}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Projects</h1>
        <p className="text-muted mb-6">Selected work — focused on Machine Learning & Computer Vision. Use filters to narrow results.</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => setFilter(null)} className={`text-sm px-3 py-1 rounded ${filter===null ? 'bg-accent text-white' : 'bg-gray-100 text-muted'}`}>All</button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setFilter(tag)} className={`text-sm px-3 py-1 rounded ${filter===tag ? 'bg-accent text-white' : 'bg-gray-100 text-muted'}`}>{tag}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p, i) => (
            <ProjectCard key={i} title={p.title} blurb={p.description} tags={p._tags} thumbnail={p.thumbnail || null} onOpen={() => window.alert(`${p.title}\n\n${p.description}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}
