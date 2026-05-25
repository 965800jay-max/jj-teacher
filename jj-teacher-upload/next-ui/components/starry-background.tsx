'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
  isTwinkling: boolean
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  life: number
  maxLife: number
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const animationRef = useRef<number>(0)
  const lastShootingRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.ceil(window.innerWidth * dpr)
      canvas.height = Math.ceil(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initStars()
    }

    const initStars = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const starCount = Math.floor((w * h) / 3600)
      const stars: Star[] = []

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.15 + 0.2,
          opacity: Math.random() * 0.32 + 0.08,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          isTwinkling: Math.random() < 0.15,
        })
      }

      starsRef.current = stars
    }

    const createShootingStar = (): ShootingStar => {
      const w = window.innerWidth
      const h = window.innerHeight
      const angle = (Math.random() * 30 + 20) * (Math.PI / 180)
      return {
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 8,
        angle,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      }
    }

    let time = 0

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      time++

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      // Draw stars
      for (const star of starsRef.current) {
        let alpha = star.opacity

        if (star.isTwinkling) {
          alpha = star.opacity * (0.3 + 0.7 * Math.abs(Math.sin(time * star.twinkleSpeed + star.twinklePhase)))
        }

        // Draw glow for bigger stars
        if (star.size > 1) {
          const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2.5)
          grd.addColorStop(0, `rgba(200, 210, 255, ${alpha * 0.18})`)
          grd.addColorStop(1, 'rgba(200, 210, 255, 0)')
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw star core
        ctx.fillStyle = `rgba(220, 225, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Spawn shooting stars every 4-8 seconds
      const now = Date.now()
      if (now - lastShootingRef.current > (Math.random() * 4000 + 4000)) {
        shootingStarsRef.current.push(createShootingStar())
        lastShootingRef.current = now
      }

      // Draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(s => {
        s.life++
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed

        const progress = s.life / s.maxLife
        s.opacity = progress < 0.1 
          ? progress / 0.1 
          : progress > 0.6 
            ? 1 - ((progress - 0.6) / 0.4) 
            : 1

        // Tail
        const tailX = s.x - Math.cos(s.angle) * s.length
        const tailY = s.y - Math.sin(s.angle) * s.length

        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        gradient.addColorStop(0, `rgba(200, 210, 255, 0)`)
        gradient.addColorStop(0.6, `rgba(210, 220, 255, ${s.opacity * 0.25})`)
        gradient.addColorStop(1, `rgba(240, 245, 255, ${s.opacity * 0.55})`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        // Head glow
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4)
        headGlow.addColorStop(0, `rgba(240, 245, 255, ${s.opacity * 0.45})`)
        headGlow.addColorStop(1, 'rgba(240, 245, 255, 0)')
        ctx.fillStyle = headGlow
        ctx.beginPath()
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2)
        ctx.fill()

        return s.life < s.maxLife
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    resizeCanvas()
    lastShootingRef.current = Date.now()
    draw()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="starry-canvas fixed inset-0 pointer-events-none z-0 opacity-70"
      style={{ background: '#030308' }}
      aria-hidden="true"
    />
  )
}
