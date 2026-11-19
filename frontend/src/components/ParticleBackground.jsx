import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function ParticleBackground() {
  const vantaRef = useRef(null)
  const location = useLocation()
  
  const isLogin = location.pathname === '/login'

  useEffect(() => {
    let vantaEffect
    
    // Only mount VANTA on non-login pages
    if (!isLogin && window.VANTA && vantaRef.current) {
      vantaEffect = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff0053,
        backgroundColor: 0x291a29,
        points: 10.00,
        maxDistance: 22.00,
        spacing: 15.00
      })
    }
    
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [isLogin])

  if (isLogin) {
    // Show the gentle haze purple/blue moving gradient for Login page
    return (
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#2D1B68]">
        {/* Soft Animated Haze */}
        <div className="absolute inset-0 opacity-80 mix-blend-screen">
          <motion.div
            animate={{
              x: ['-20%', '10%', '-20%'],
              y: ['-10%', '20%', '-10%'],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-[#2563eb]"
          />
          <motion.div
            animate={{
              x: ['20%', '-20%', '20%'],
              y: ['10%', '-10%', '10%'],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[140px] bg-[#c084fc]"
          />
          <motion.div
            animate={{
              x: ['0%', '20%', '0%'],
              y: ['20%', '0%', '20%'],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full blur-[120px] bg-[#d8b4fe]"
          />
        </div>
        {/* White fade overlay to ensure text contrast for glass cards */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
      </div>
    )
  }

  // Application background with Vanta.net
  return (
    <div className="fixed inset-0 z-0 bg-[#291a29]">
      <div ref={vantaRef} className="absolute inset-0" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
    </div>
  )
}
