import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar' // Import Navbar
import MapView from '../components/Map'
import { useRef, useState, useEffect } from 'react'
import { FaPython } from 'react-icons/fa'
import { SiReact, SiJavascript, SiTypescript, SiFortran, SiSanity, SiMongodb, SiC, SiAdobephotoshop, SiWondersharefilmora, SiE, SiDocker, SiAdobeaftereffects, SiNextdotjs, SiLatex, SiKubernetes, SiPytorch, SiTensorflow } from 'react-icons/si'

export default function Home() {
  const { t } = useTranslation()
  const projects = t('projects', { returnObjects: true }) || []
  const [filter, setFilter] = useState(null)
  const [selectedLocationId, setSelectedLocationId] = useState(null)
  const listRef = useRef(null)
  const [artOpen, setArtOpen] = useState(false)

  // augment projects with optional location tags (match by keywords from locations in i18n)
  const locations = t('locations', { returnObjects: true }) || []
  const projectsWithTags = projects.map(p => {
    const inferred = locations.filter(loc=> (p.title+ ' ' + p.description).toLowerCase().includes((loc.name||'').toLowerCase())? [loc.id] : []).flat()
    let tags = p.tags || inferred
    const lc = (p.title||'').toLowerCase()
  // explicit mappings
  if (/atrex/i.test(lc)) tags = Array.from(new Set([...(tags||[]), 'ensma']))
  // map common UFU projects; do NOT force 'Coding Elf' to UFU (it's independent)
  if (/epta|saturn v|charmander|mflab/i.test(lc)) tags = Array.from(new Set([...(tags||[]), 'ufu']))
    const isEducation = /droney|charmander|saturn v|site pessoal|atrex|epta|coding elf|mflab/i.test(lc)
    const category = isEducation ? 'education' : 'independent'
    return ({ ...p, tags, isEducation, category })
  })

  // categorized skills for UI (icons shown, names available for search/accessibility)
  const skillCategories = [
    { name: 'Languages & Frameworks', items: [ {icon: FaPython, label: 'Python'}, {icon: SiReact, label: 'React'}, {icon: SiJavascript, label: 'JavaScript'}, {icon: SiTypescript, label: 'TypeScript'} ] },
    { name: 'Data & ML', items: [ {icon: SiPytorch, label: 'PyTorch'}, {icon: SiTensorflow, label: 'TensorFlow'} ] },
    { name: 'Dev & Infra', items: [ {icon: SiDocker, label: 'Docker'}, {icon: SiKubernetes, label: 'Kubernetes'}, {icon: SiNextdotjs, label: 'Next.js'} ] },
    { name: 'Databases & CMS', items: [ {icon: SiMongodb, label: 'MongoDB'}, {icon: SiSanity, label: 'Sanity'} ] },
    { name: 'Design & Media', items: [ {icon: SiAdobephotoshop, label: 'Photoshop'}, {icon: SiAdobeaftereffects, label: 'After Effects'}, {icon: SiWondersharefilmora, label: 'Filmora'} ] },
    { name: 'Other', items: [ {icon: SiFortran, label: 'Fortran'}, {icon: SiC, label: 'C'}, {icon: SiLatex, label: 'LaTeX'} ] }
  ]

  const allSkillNames = skillCategories.flatMap(c => c.items.map(i => i.label))

  const visibleProjects = filter ? projectsWithTags.filter(p => (p.tags||[]).includes(filter)) : projectsWithTags

  useEffect(()=>{
    // scroll to first visible project when filter changes
    if (!listRef.current) return
    const first = listRef.current.querySelector('[id^="project-"]')
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },[filter, selectedLocationId])

  useEffect(()=>{
    function onArtToggle(e){ setArtOpen(Boolean(e?.detail?.open)) }
    window.addEventListener('art:toggle', onArtToggle)
    return ()=> window.removeEventListener('art:toggle', onArtToggle)
  },[])

  // helper: merge ENSMA entries in place to preserve JSON order
  const rawEducation = t('education', { returnObjects: true }) || []
  const mergedEducation = []
  let ensmaMerged = null
  rawEducation.forEach(e => {
    if (/ensma/i.test(e.institution || '')) {
      if (!ensmaMerged) {
        ensmaMerged = { ...e }
      } else {
        // merge years and degree if needed
        if (e.years && ensmaMerged.years && !ensmaMerged.years.includes(e.years)) {
          ensmaMerged.years += `, ${e.years}`
        }
        if (e.degree && ensmaMerged.degree && !ensmaMerged.degree.includes(e.degree)) {
          ensmaMerged.degree += `, ${e.degree}`
        }
      }
    } else {
      mergedEducation.push(e)
    }
  })
  // Replace ENSMA entries in their original position
  if (ensmaMerged) {
    const firstEnsmaIdx = rawEducation.findIndex(e => /ensma/i.test(e.institution || ''))
    mergedEducation.splice(firstEnsmaIdx, 0, ensmaMerged)
  }

  const scrollToProjectByTitle = (title) => {
    const idx = projectsWithTags.findIndex(p => p.title === title)
    if (idx === -1) return
    const el = document.getElementById(`project-${idx}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // try to open modal by triggering click on inner trigger
      const trigger = el.querySelector('[data-open-trigger]')
      if (trigger) trigger.click()
    }
  }

  return (
    <div className="site-scroll">
      <Navbar /> {/* Add Navbar here */}
      <section id="work" className="section">
        <div className="max-w-6xl mx-auto w-full ">
          <h2 className="text-3xl font-bold mb-8">{t('nav.education')}</h2>
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Left: Education & Experiences and Independent Projects */}
            <div className="md:w-1/2 flex-1 min-w-0 order-first space-y-6">
              <div className="card p-6">
                <div className="grid gap-6">
                  {mergedEducation.map((e, idx) => {
                    // Institution tag matching
                    const instName = (e.institution || '').toLowerCase()
                    let tag = null
                    if (instName.includes('ensma')) tag = 'ensma'
                    else if (instName.includes('ufu') || instName.includes('uberl')) tag = 'ufu'

                    // Get projects for this institution by tag, in JSON order
                    let orderedProjects = []
                    if (tag) {
                      const loc = locations.find(l => l.id === tag)
                      if (loc && loc.projects) {
                        orderedProjects = loc.projects
                          .map(ptitle => {
                            // Try to match by both tag and title
                            let found = projectsWithTags.find(p => (Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : []).includes(tag) && p.title === ptitle)
                            // If not found by title, fallback to first project with tag
                            if (!found) found = projectsWithTags.find(p => (Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : []).includes(tag) && (!p.title || p.title.toLowerCase() === ptitle.toLowerCase()))
                            // If still not found, fallback to any project with tag
                            if (!found) found = projectsWithTags.find(p => (Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase()) : []).includes(tag))
                            return found
                          })
                          .filter(Boolean)
                      }
                    }
                    return (
                      <div key={idx} className="border-0 rounded my-4 bg-gray-900">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className='text-xl font-semibold'>{e.institution}</h3>
                            <div className="muted text-sm">{e.location} {e.years ? `· ${e.years}` : ''}</div>
                            {e.degree && <div className="muted text-sm">{e.degree}</div>}
                          </div>
                        </div>
                        {/* horizontal reel for institution, ordered by i18n */}
                        {tag && orderedProjects.length > 0 && (
                          <div className="mt-3 overflow-x-auto py-2">
                            <div className="flex gap-3">
                              {orderedProjects.map((sp, sidx) => (
                                <button key={sidx} onClick={() => scrollToProjectByTitle(sp.title)} className="w-28 h-20 bg-inherit border-0 rounded flex flex-col p-2 items-start justify-start text-left hover:scale-105 transform transition">
                                  <div className="font-semibold text-sm">{sp.title}</div>
                                  <div className="muted text-xs line-clamp-2">{sp.description}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {/* Independent Projects Reel */}
                  <div className="mt-3 overflow-x-auto py-2">
                    <h3 className="text-xl font-semibold">Independent Projects</h3>
                    <div className="flex gap-3">
                      {projectsWithTags.filter(p => !Array.isArray(p.tags) || p.tags.length === 0).map((sp, sidx) => (
                        <button key={sidx} onClick={() => scrollToProjectByTitle(sp.title)} className="w-28 h-20 bg-inherit border-0 rounded-xl  flex flex-col p-2 items-start justify-start text-left hover:scale-105 transform transition">
                          <div className="font-semibold text-sm">{sp.title}</div>
                          <div className="muted text-xs line-clamp-2">{sp.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Map */}
            <div className="md:w-1/2 flex-1 min-w-0 flex items-center justify-center">
              <MapView className="w-full h-72 md:h-auto" onSelectLocation={(id) => { setFilter(id); setSelectedLocationId(id); }} selectedLocationId={selectedLocationId} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}