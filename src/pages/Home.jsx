import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar' // Import Navbar
import { useRef, useState, useEffect } from 'react'
import { FaPython } from 'react-icons/fa'
import { SiReact, SiJavascript, SiTypescript, SiFortran, SiSanity, SiMongodb, SiC, SiAdobephotoshop, SiWondersharefilmora, SiE, SiDocker, SiAdobeaftereffects, SiNextdotjs, SiLatex, SiKubernetes, SiPytorch, SiTensorflow } from 'react-icons/si'

export default function Home() {
  const mainContainerClass = "site-scroll"
  const { t } = useTranslation()
  const publications = t('publications', { returnObjects: true })
  const experience = t('experience', { returnObjects: true })
  const personal_projects = t('personal_projects', { returnObjects: true })
  const projects = t('projects', { returnObjects: true }) || []
  const [artOpen, setArtOpen] = useState(false)

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
              {(mergedEducation || []).map((edu, idx) => {
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
              {Array.isArray(experience) && experience.map((exp, idx) => (
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
            <h2 className="text-3xl font-bold mb-8">{t('nav.publications')}</h2>
            <div className="grid gap-6">
              {Array.isArray(publications) && publications.map((pub, idx) => (
                <div key={idx} className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pub.title}</h3>
                    <p className="text-gray-700 mb-1">{pub.venue}</p>
                    <p className="text-gray-600 mb-1">Authors: {pub.authors}</p>
                    <p className="text-gray-600 mb-1">{pub.description}</p>
                    {pub.doi ? (
                      <p className="text-gray-600 mb-1">
                        DOI: <a href={pub.link || `https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-accent underline">{pub.doi}</a>
                      </p>
                    ) : pub.link ? (
                      <p className="text-gray-600 mb-1">
                        DOI: <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-accent underline">{pub.link}</a>
                      </p>
                    ) : (
                      <div className="flex items-start justify-between mt-2">
                        <div>
                          <span className="text-gray-600">DOI: {t('publications.not_available')}</span>
                          {pub.note && <span className="block text-gray-400 text-sm">{pub.note}</span>}
                        </div>
                        {pub.document && (
                          <a
                            href={pub.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors group"
                            title={t('publications.view_document')}
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
                    )}
                  </div>
                </div>
              ))}
              </div>
          </div>

          {/* Personal Projects Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Personal Projects</h2>
            <div className="grid gap-6">
              {Array.isArray(personal_projects) && personal_projects.map((project, idx) => (
                <div key={idx} className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-dark transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-accent/10 text-accent rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.status && (
                      <p className="text-gray-500 text-sm mt-3 italic">
                        Status: {project.status}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}