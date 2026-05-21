import { useRef, useState, useEffect } from 'react'

export default function useIntersection(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already visible at mount time — show immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px', ...options }
    )
    observer.observe(el)

    // Fallback: if IntersectionObserver never fires (e.g. hidden iframe,
    // unusual scroll container, reduced-motion, etc.) reveal after 1.2s
    const fallback = setTimeout(() => setIsVisible(true), 1200)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return [ref, isVisible]
}
