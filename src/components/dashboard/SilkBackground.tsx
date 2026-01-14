'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_SEED = 'dashboard-linefield'

const CONFIG = {
    lineCount: 36,
    segmentCount: 64,
    gridScale: 3.4,
    warpStrength: 0.28,
    step: 0.012,
    tempo: 0.00045,
    lineWidth: { min: 0.6, max: 1.2 },
    alpha: { min: 0.08, max: 0.22 },
    baseA: '#070504',
    baseB: '#14100c',
    silverA: { r: 179, g: 168, b: 154 },
    silverB: { r: 225, g: 216, b: 203 },
}

type Stroke = {
    startX: number
    startY: number
    width: number
    alpha: number
    phase: number
    offset: number
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const hashSeed = (seed: string) => {
    let h = 2166136261
    for (let i = 0; i < seed.length; i += 1) {
        h ^= seed.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

const mulberry32 = (seed: number) => {
    let t = seed
    return () => {
        t += 0x6d2b79f5
        let r = Math.imul(t ^ (t >>> 15), t | 1)
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
}

const hash2D = (x: number, y: number, seed: number) => {
    let h = seed
    h ^= Math.imul(x, 374761393)
    h ^= Math.imul(y, 668265263)
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return (h >>> 0) / 4294967296
}

const noise2D = (x: number, y: number, seed: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)
    const n00 = hash2D(xi, yi, seed)
    const n10 = hash2D(xi + 1, yi, seed)
    const n01 = hash2D(xi, yi + 1, seed)
    const n11 = hash2D(xi + 1, yi + 1, seed)
    const nx0 = lerp(n00, n10, u)
    const nx1 = lerp(n01, n11, u)
    return lerp(nx0, nx1, v)
}

type SilkBackgroundProps = {
    seed?: string
    opacity?: number
    className?: string
}

export function SilkBackground({ seed = DEFAULT_SEED, opacity = 0.9, className }: SilkBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }

        const seedValue = hashSeed(seed)
        const rng = mulberry32(seedValue)
        const pointer = { x: 0, y: 0 }
        const targetPointer = { x: 0, y: 0 }
        let width = window.innerWidth
        let height = window.innerHeight
        let animationFrame: number | null = null
        let scrollMomentum = 0
        let isVisible = true
        const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let allowMotion = !reduceMotionQuery.matches

        const strokes: Stroke[] = Array.from({ length: CONFIG.lineCount }, () => ({
            startX: rng(),
            startY: rng(),
            width: lerp(CONFIG.lineWidth.min, CONFIG.lineWidth.max, rng()),
            alpha: lerp(CONFIG.alpha.min, CONFIG.alpha.max, rng()),
            phase: rng() * Math.PI * 2,
            offset: rng() * 100,
        }))

        const resizeCanvas = () => {
            width = window.innerWidth
            height = window.innerHeight
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const flowAngle = (x: number, y: number, t: number, offset: number) => {
            const nx = x * CONFIG.gridScale + t * 0.25 + offset * 0.01
            const ny = y * CONFIG.gridScale - t * 0.2 - offset * 0.01
            return noise2D(nx, ny, seedValue) * Math.PI * 2
        }

        const warpedAngle = (x: number, y: number, t: number, offset: number, warpStrength: number) => {
            const warpX = noise2D(x * 2.2 + offset, y * 2.0 - t * 0.7, seedValue) - 0.5
            const warpY = noise2D(x * 2.6 - offset, y * 1.8 + t * 0.5, seedValue + 17) - 0.5
            const wx = x + warpX * warpStrength
            const wy = y + warpY * warpStrength
            return flowAngle(wx, wy, t, offset) + (warpX + warpY) * 0.4
        }

        const drawFrame = (time: number) => {
            const t = time * CONFIG.tempo + scrollMomentum * 0.4
            scrollMomentum *= 0.9

            pointer.x = lerp(pointer.x, targetPointer.x, 0.05)
            pointer.y = lerp(pointer.y, targetPointer.y, 0.05)

            const gradient = ctx.createLinearGradient(0, 0, 0, height)
            gradient.addColorStop(0, CONFIG.baseA)
            gradient.addColorStop(1, CONFIG.baseB)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, height)

            const pointerEnergy = clamp(Math.hypot(pointer.x, pointer.y), 0, 1)
            const warpStrength = CONFIG.warpStrength * (0.8 + pointerEnergy * 0.4)

            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            strokes.forEach((stroke) => {
                let x = stroke.startX
                let y = stroke.startY
                const pulse = 0.7 + 0.3 * Math.sin(t * 2.0 + stroke.phase)
                const alpha = stroke.alpha * pulse

                const tone = noise2D(x * 2 + t * 0.4, y * 2 + t * 0.2, seedValue + 91)
                const r = Math.round(lerp(CONFIG.silverA.r, CONFIG.silverB.r, tone))
                const g = Math.round(lerp(CONFIG.silverA.g, CONFIG.silverB.g, tone))
                const b = Math.round(lerp(CONFIG.silverA.b, CONFIG.silverB.b, tone))

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
                ctx.lineWidth = stroke.width
                ctx.beginPath()

                for (let i = 0; i < CONFIG.segmentCount; i += 1) {
                    const angle = warpedAngle(x, y, t + stroke.phase, stroke.offset, warpStrength)
                    x += Math.cos(angle) * CONFIG.step
                    y += Math.sin(angle) * CONFIG.step

                    const px = x * width
                    const py = y * height
                    if (i === 0) {
                        ctx.moveTo(px, py)
                    } else {
                        ctx.lineTo(px, py)
                    }

                    if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) {
                        break
                    }
                }

                ctx.stroke()
            })

            if (allowMotion && isVisible) {
                animationFrame = requestAnimationFrame(drawFrame)
            } else {
                animationFrame = null
            }
        }

        const handleResize = () => {
            resizeCanvas()
            drawFrame(performance.now())
        }

        const handlePointerMove = (event: PointerEvent) => {
            targetPointer.x = event.clientX / width - 0.5
            targetPointer.y = event.clientY / height - 0.5
        }

        const handleScroll = () => {
            scrollMomentum = Math.min(1, scrollMomentum + 0.12)
        }

        const handleVisibility = () => {
            isVisible = document.visibilityState === 'visible'
            if (isVisible && allowMotion && animationFrame === null) {
                animationFrame = requestAnimationFrame(drawFrame)
            }
        }

        const handleReduceMotion = (event: MediaQueryListEvent) => {
            allowMotion = !event.matches
            if (allowMotion && animationFrame === null) {
                animationFrame = requestAnimationFrame(drawFrame)
            } else if (!allowMotion && animationFrame !== null) {
                cancelAnimationFrame(animationFrame)
                animationFrame = null
                drawFrame(performance.now())
            }
        }

        resizeCanvas()
        window.addEventListener('resize', handleResize)
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('scroll', handleScroll, { passive: true })
        document.addEventListener('visibilitychange', handleVisibility)
        reduceMotionQuery.addEventListener('change', handleReduceMotion)

        if (allowMotion) {
            animationFrame = requestAnimationFrame(drawFrame)
        } else {
            drawFrame(performance.now())
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('visibilitychange', handleVisibility)
            reduceMotionQuery.removeEventListener('change', handleReduceMotion)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={cn('fixed inset-0 z-0 pointer-events-none', className)}
            style={{ pointerEvents: 'none', opacity }}
            aria-hidden="true"
        />
    )
}
