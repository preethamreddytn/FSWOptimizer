import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '', decimals = 0, duration = 1200 }) {
  const [current, setCurrent] = useState(0)
  const startRef = useRef(null)
  const frameRef = useRef(null)
  const hasAnimated = useRef(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const start = performance.now()
        const animate = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(eased * value)
          if (progress < 1) frameRef.current = requestAnimationFrame(animate)
        }
        frameRef.current = requestAnimationFrame(animate)
      }
    }, { threshold: 0.3 })

    if (containerRef.current) observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  return (
    <span ref={containerRef}>
      {current.toFixed(decimals)}{suffix}
    </span>
  )
}
