import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar' // Import Navbar
import MapView from '../components/Map'
import { useRef, useState, useEffect } from 'react'
import { FaPython } from 'react-icons/fa'
import { SiReact, SiJavascript, SiTypescript, SiFortran, SiSanity, SiMongodb, SiC, SiAdobephotoshop, SiWondersharefilmora, SiE, SiDocker, SiAdobeaftereffects, SiNextdotjs, SiLatex, SiKubernetes, SiPytorch, SiTensorflow } from 'react-icons/si'

export default function Home() {
  const mainContainerClass = "site-scroll"
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
  if (/EPTA (Equipe de Propulsão e Tecnologia Aeroespacial)|saturn v|charmander|mflab/i.test(lc)) tags = Array.from(new Set([...(tags||[]), 'ufu']))
    const isEducation = /droney|charmander|saturn v|site pessoal|atrex|EPTA (Equipe de Propulsão e Tecnologia Aeroespacial)|coding elf|mflab/i.test(lc)
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
  <div className={mainContainerClass}>
      <Navbar /> {/* Add Navbar here */}
      <section id="work" className="section">
        <div className="max-w-4xl mx-auto w-full px-6 lg:px-8 space-y-16">
          {/* Education Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Education</h2>
            <div className="grid gap-8">
              {mergedEducation.map((edu, idx) => {
                const instName = (edu.institution || '').toLowerCase();
                let tag = null;
                if (instName.includes('ensma')) tag = 'ensma';
                else if (instName.includes('ufu')) tag = 'ufu';

                return (
                  <div key={idx} className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{edu.institution}</h3>
                        <p className="text-accent/80 mt-1 font-medium">
                          {edu.location} · {edu.period}
                        </p>
                        {edu.degree && (
                          <p className="text-gray-600 mt-2 leading-relaxed">{edu.degree}</p>
                        )}
                      </div>
                      {edu.certificate && (
                        <a
                          href={edu.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors group"
                          title="View Certificate"
                        >
                          <svg
                            className="w-5 h-5 text-accent group-hover:text-accent-dark transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Experience</h2>
            <div className="grid gap-6">
              {t('experience', { returnObjects: true }).map((exp, idx) => (
                <div key={idx} className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="space-y-1">
                        <p className="text-lg text-gray-600 font-medium">{exp.role} @ <span className="text-gray-900 font-bold">{exp.company}</span></p>
                        <p className="text-accent/80 font-medium">
                          {exp.location} · {exp.period}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                    {exp.certificate && (
                      <a
                        href={exp.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors group"
                        title="View Recommendation Letter"
                      >
                        <svg
                          className="w-5 h-5 text-accent group-hover:text-accent-dark transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publications Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Publications</h2>
            <div className="grid gap-6">
              {/* 1. Neural Network Algorithm for Prediction of Aerodynamic Coefficients of a Reduced-Scale Rocket */}
              <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Neural Network Algorithm for Prediction of Aerodynamic Coefficients of a Reduced-Scale Rocket</h3>
                  <p className="text-gray-700 mb-1">18th Brazilian Congress of Thermal Sciences and Engineering (ENCIT 2020)</p>
                  <p className="text-gray-600 mb-1">Authors: Laura Pereira de Castro, Rodrigo Daher, Alexandre Zuquete Guarato</p>
                  <p className="text-gray-600 mb-1">Developed a Python-based neural network to predict drag and lift coefficients from CFD data of EPTA’s rocket, achieving &lt; 17.7% deviation vs ANSYS CFD and RASAero II.</p>
                  <p className="text-gray-600 mb-1">DOI: <a href="https://doi.org/10.26678/ABCM.ENCIT2020.CIT20-0806" target="_blank" rel="noopener noreferrer" className="text-accent underline">10.26678/ABCM.ENCIT2020.CIT20-0806</a></p>
                </div>
              </div>
              {/* 2. Implementation of a Hybrid Lagrangian Filtered Density Function–Large Eddy Simulation Methodology in a Dynamic Adaptive Mesh Refinement Environment */}
              <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Implementation of a Hybrid Lagrangian Filtered Density Function–Large Eddy Simulation Methodology in a Dynamic Adaptive Mesh Refinement Environment</h3>
                  <p className="text-gray-700 mb-1">Physics of Fluids, April 2021</p>
                  <p className="text-gray-600 mb-1">Authors: Laura Pereira de Castro, Abgail Paula Pinheiro, Vitor Vilela, Gabriel Marcos Magalhães, Ricardo Serfaty, João Marcelo Vedovotto</p>
                  <p className="text-gray-600 mb-1">Contributed to the implementation of a hybrid FDF–LES approach within a dynamic AMR framework for turbulent reactive-flow modeling.</p>
                  <p className="text-gray-600 mb-1">DOI: <a href="https://doi.org/10.1063/5.0045873" target="_blank" rel="noopener noreferrer" className="text-accent underline">10.1063/5.0045873</a></p>
                </div>
              </div>
              {/* 3. Transported PDF Method for Chemical Mixing (H₂/O₂) 🏅 Awarded Paper */}
              <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Transported PDF Method for Chemical Mixing (H₂/O₂)</h3>
                  <p className="text-gray-700 mb-1">XIX Semana da Matemática e IX Semana da Estatística – UFU 2019</p>
                  <p className="text-gray-600 mb-1">Authors: Laura Pereira de Castro, João Marcelo Vedovotto</p>
                  <p className="text-gray-600 mb-1">Simulated micromixing between hydrogen and oxygen using the transported PDF (IEM-LMSE) model in Python with Cantera. Awarded Honorable Mention.</p>
                  <div className="flex items-start justify-between mt-2">
                    <div>
                      <span className="text-gray-600">DOI: not available</span>
                      <span className="block text-gray-400 text-sm">* Presented at a local university seminar. Full text available below.</span>
                    </div>
                    <a
                      href={"/documents/transported_pdf.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors group"
                      title="View Document"
                    >
                      <svg
                        className="w-5 h-5 text-accent group-hover:text-accent-dark transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              {/* 4. Acoustic Levitation Modeling */}
              <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Acoustic Levitation Modeling</h3>
                  <p className="text-gray-700 mb-1">XX Semana da Matemática e X Semana da Estatística – UFU 2020</p>
                  <p className="text-gray-600 mb-1">Authors: Matheus Lopes Silva, Laura Pereira de Castro, Aristeu da Silveira Neto</p>
                  <p className="text-gray-600 mb-1">Built a 1-D fluid-dynamic Runge-Kutta model describing the motion and phase behavior of levitating pistons under acoustic pressure fields.</p>
                  <div className="flex items-start justify-between mt-2">
                    <div>
                      <span className="text-gray-600">DOI: not available</span>
                      <span className="block text-gray-400 text-sm">* Presented at a local university seminar. Full text available below.</span>
                    </div>
                    <a
                      href={"/documents/acoustic_levitation.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors group"
                      title="View Document"
                    >
                      <svg
                        className="w-5 h-5 text-accent group-hover:text-accent-dark transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-16 mb-8">
            <MapView 
              className="w-full h-80 rounded-lg overflow-hidden shadow-lg" 
              onSelectLocation={(id) => { setFilter(id); setSelectedLocationId(id); }} 
              selectedLocationId={selectedLocationId} 
            />
          </div>
        </div>
      </section>
    </div>
  )
}