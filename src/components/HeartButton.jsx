import { useState, useEffect, useRef } from 'react'

export default function HeartButton(){
  const [broken, setBroken] = useState(false)
  const wasBroken = useRef(false)

  function click(){
    // open art-only view and mark heart as 'broken'
    setBroken(true)
    wasBroken.current = true
    window.dispatchEvent(new CustomEvent('art:toggle', { detail: { open: true } }))
    // scroll to art section if present
    setTimeout(()=>{
      const art = document.getElementById('art')
      if (art) art.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 60)
  }

  // reset the heart when user scrolls away from the art section
  useEffect(()=>{
    function onScroll(){
      try{
        const art = document.getElementById('art')
        if (!art) return
        const rect = art.getBoundingClientRect()
        // if art is mostly out of view, reset and hide art-only mode
        if ((rect.bottom < 60 || rect.top > window.innerHeight - 60) && wasBroken.current) {
          setBroken(false)
          wasBroken.current = false
          window.dispatchEvent(new CustomEvent('art:toggle', { detail: { open: false } }))
        }
      }catch(e){/* ignore dom timing */}
    }
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <button data-open-trigger aria-label="secret-portfolio" onClick={click} className="ml-2">
      <span style={{display:'inline-block', transform: broken ? 'rotate(8deg) translateY(4px)' : 'none', transition:'transform 260ms'}} className="text-2xl">{broken ? '💔' : '❤️'}</span>
    </button>
  )
}
