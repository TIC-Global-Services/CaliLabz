'use client'

import { useEffect, useRef } from 'react'

interface SmokeParticle {
  x: number
  y: number
  side: 'left' | 'right'
  size: number
  speedY: number
  speedX: number
  opacity: number
  sizeIncrease: number
  swaySpeed: number
  swayAmount: number
  turbulence: number
  life: number
  maxLife: number
  angle: number
  rotationSpeed: number
}

class Particle implements SmokeParticle {
  x: number
  y: number
  side: 'left' | 'right'
  size: number
  speedY: number
  speedX: number
  opacity: number
  sizeIncrease: number
  swaySpeed: number
  swayAmount: number
  turbulence: number
  life: number
  maxLife: number
  angle: number
  rotationSpeed: number

  constructor(x: number, y: number, side: 'left' | 'right') {
    this.x = x
    this.y = y
    this.side = side
    this.size = Math.random() * 40 + 25
    this.speedY = -Math.random() * 0.3 - 0.1 // Slower upward drift
    this.speedX = side === 'left' ? Math.random() * 0.8 + 0.3 : -Math.random() * 0.8 - 0.3 // Slower horizontal drift
    this.opacity = Math.random() * 0.15 + 0.1 // Lower opacity for smoky effect
    this.sizeIncrease = Math.random() * 0.3 + 0.15
    this.swaySpeed = Math.random() * 0.008 + 0.004 // Much slower sway
    this.swayAmount = Math.random() * 1.5 + 0.5
    this.turbulence = Math.random() * 0.3 + 0.1
    this.life = 0
    this.maxLife = Math.random() * 400 + 300 // Longer life
    this.angle = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.005 // Slower rotation
  }

  update() {
    this.life++
    this.angle += this.rotationSpeed

    // Move toward center slowly
    this.x += this.speedX
    this.y += this.speedY

    // Add gentle swaying motion
    this.x += Math.sin(this.life * this.swaySpeed) * this.swayAmount
    this.y += Math.cos(this.life * this.swaySpeed * 0.5) * this.turbulence

    this.size += this.sizeIncrease
    this.opacity -= 0.0003 // Very slow fade

    // Gradual slowdown
    this.speedX *= 0.995
    this.speedY *= 0.995
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.globalCompositeOperation = 'multiply' // Softer blending for realistic smoke without harsh lines
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)

    // Soft, wispy smoke with gentle gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size)
    gradient.addColorStop(0, `rgba(100, 100, 100, ${this.opacity * 1.2})`)
    gradient.addColorStop(0.3, `rgba(120, 120, 120, ${this.opacity * 0.8})`)
    gradient.addColorStop(0.6, `rgba(140, 140, 140, ${this.opacity * 0.4})`)
    gradient.addColorStop(1, 'rgba(160, 160, 160, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, this.size, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  isDead(): boolean {
    return this.opacity <= 0 || this.life >= this.maxLife
  }
}

export default function WeedSmokeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(30)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const createSmoke = () => {
      // Left side smoke - less frequent, more realistic
      if (Math.random() > 0.6) {
        const leftX = Math.random() * 80 + 20
        const leftY = Math.random() * canvas.height
        particlesRef.current.push(new Particle(leftX, leftY, 'left'))
      }

      // Right side smoke
      if (Math.random() > 0.6) {
        const rightX = canvas.width - Math.random() * 80 - 20
        const rightY = Math.random() * canvas.height
        particlesRef.current.push(new Particle(rightX, rightY, 'right'))
      }
    }

    const animate = () => {
      // Faster trail fade to prevent lingering artifacts that could appear as lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      createSmoke()

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        particlesRef.current[i].update()
        particlesRef.current[i].draw(ctx)

        if (particlesRef.current[i].isDead()) {
          particlesRef.current.splice(i, 1)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    window.addEventListener('resize', resizeCanvas)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#ffffff',
      overflow: 'hidden'
    }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}