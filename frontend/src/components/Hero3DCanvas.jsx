import { useEffect, useRef } from 'react'

export default function Hero3DCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let displayWidth = canvas.parentElement?.clientWidth || 560
    let displayHeight = 490

    const updateCanvasSize = () => {
      if (!canvas.parentElement) return
      displayWidth = canvas.parentElement.clientWidth
      displayHeight = 490
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
      canvas.style.width = displayWidth + 'px'
      canvas.style.height = displayHeight + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Physics & Interaction state
    let targetRotX = 0
    let targetRotY = 0
    let rotX = 0
    let rotY = 0
    let isDragging = false
    let startMouseX = 0
    let startMouseY = 0
    let manualRotY = 0
    let manualRotX = 0

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - displayWidth / 2
      const y = e.clientY - rect.top - displayHeight / 2

      if (isDragging) {
        const dx = e.clientX - startMouseX
        const dy = e.clientY - startMouseY
        manualRotY += dx * 0.007
        manualRotX -= dy * 0.007
        startMouseX = e.clientX
        startMouseY = e.clientY
      } else {
        targetRotY = (x / (displayWidth * 0.5)) * 0.28
        targetRotX = -(y / (displayHeight * 0.5)) * 0.24
      }
    }

    const handleMouseDown = (e) => {
      isDragging = true
      startMouseX = e.clientX
      startMouseY = e.clientY
      canvas.style.cursor = 'grabbing'
    }

    const handleMouseUp = () => {
      isDragging = false
      canvas.style.cursor = 'grab'
    }

    const handleMouseLeave = () => {
      isDragging = false
      targetRotX = 0
      targetRotY = 0
      canvas.style.cursor = 'grab'
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // ─── 3D Diamond / Octahedron Geometry ─────────────────────────────────────
    const outerVertices = [
      [0, -100, 0],   // Top Apex (0)
      [70, 0, 70],    // Mid 1 (1)
      [-70, 0, 70],   // Mid 2 (2)
      [-70, 0, -70],  // Mid 3 (3)
      [70, 0, -70],   // Mid 4 (4)
      [0, 100, 0],    // Bottom Apex (5)
    ]

    const outerFaces = [
      [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
      [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4],
    ]

    // Inner Floating Neural Lattice
    const innerSize = 30
    const innerVertices = [
      [-innerSize, -innerSize, -innerSize],
      [innerSize, -innerSize, -innerSize],
      [innerSize, innerSize, -innerSize],
      [-innerSize, innerSize, -innerSize],
      [-innerSize, -innerSize, innerSize],
      [innerSize, -innerSize, innerSize],
      [innerSize, innerSize, innerSize],
      [-innerSize, innerSize, innerSize],
    ]

    const innerEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ]

    // 5 Orbiting Core Modules
    const orbitalModules = [
      { name: 'Skill Gap Matrix', radiusX: 195, radiusY: 65, tilt: 0.35, speed: 0.005, color: '#3B82F6' },
      { name: 'Dynamic Roadmap', radiusX: 225, radiusY: 75, tilt: -0.4, speed: 0.0042, color: '#10B981' },
      { name: 'SETU AI Mentor', radiusX: 170, radiusY: 55, tilt: 0.82, speed: 0.0068, color: '#8B5CF6' },
      { name: 'Interview Arena', radiusX: 245, radiusY: 80, tilt: -0.18, speed: 0.0035, color: '#F59E0B' },
      { name: 'Resume ATS Optimizer', radiusX: 205, radiusY: 68, tilt: 0.62, speed: 0.0048, color: '#EC4899' },
    ]

    // Stardust Particles
    const particles = Array.from({ length: 36 }, () => ({
      x: (Math.random() - 0.5) * 480,
      y: (Math.random() - 0.5) * 380,
      z: (Math.random() - 0.5) * 300,
      size: Math.random() * 1.5 + 0.6,
      opacity: Math.random() * 0.4 + 0.15,
    }))

    let angle = 0
    const fov = 440

    const project = (x, y, z) => {
      const scale = fov / (fov + z)
      return {
        x: x * scale + displayWidth / 2,
        y: y * scale + displayHeight / 2,
        scale,
        z,
      }
    }

    const rotateX = (x, y, z, theta) => [
      x,
      y * Math.cos(theta) - z * Math.sin(theta),
      y * Math.sin(theta) + z * Math.cos(theta),
    ]

    const rotateY = (x, y, z, theta) => [
      x * Math.cos(theta) + z * Math.sin(theta),
      y,
      -x * Math.sin(theta) + z * Math.cos(theta),
    ]

    const rotateZ = (x, y, z, theta) => [
      x * Math.cos(theta) - y * Math.sin(theta),
      x * Math.sin(theta) + y * Math.cos(theta),
      z,
    ]

    // ─── Main 60 FPS Render Loop ──────────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight)
      const isDark = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light')

      if (!isDragging) {
        angle += 0.0022
      }
      rotX += (targetRotX + manualRotX - rotX) * 0.045
      rotY += (targetRotY + manualRotY - rotY) * 0.045

      const currentRotX = rotX + 0.2
      const currentRotY = rotY + angle

      // 1. Ambient Spotlight Cone
      const rayGradient = ctx.createLinearGradient(
        displayWidth / 2, 0,
        displayWidth / 2, displayHeight * 0.8
      )
      if (isDark) {
        rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
        rayGradient.addColorStop(0.35, 'rgba(59, 130, 246, 0.03)')
        rayGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        rayGradient.addColorStop(0, 'rgba(37, 99, 235, 0.06)')
        rayGradient.addColorStop(0.35, 'rgba(37, 99, 235, 0.02)')
        rayGradient.addColorStop(1, 'rgba(248, 250, 252, 0)')
      }

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(displayWidth / 2 - 140, 0)
      ctx.lineTo(displayWidth / 2 + 140, 0)
      ctx.lineTo(displayWidth / 2 + 260, displayHeight)
      ctx.lineTo(displayWidth / 2 - 260, displayHeight)
      ctx.closePath()
      ctx.fillStyle = rayGradient
      ctx.fill()
      ctx.restore()

      // 2. Center Radial Glow
      const centerGlow = ctx.createRadialGradient(
        displayWidth / 2, displayHeight / 2, 5,
        displayWidth / 2, displayHeight / 2, 230
      )
      if (isDark) {
        centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.07)')
        centerGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.03)')
        centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        centerGlow.addColorStop(0, 'rgba(37, 99, 235, 0.05)')
        centerGlow.addColorStop(0.4, 'rgba(37, 99, 235, 0.01)')
        centerGlow.addColorStop(1, 'rgba(248, 250, 252, 0)')
      }
      ctx.fillStyle = centerGlow
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      // 3. Ambient Stardust Particles
      particles.forEach((p) => {
        let [px, py, pz] = rotateY(p.x, p.y, p.z, currentRotY * 0.15)
        ;[px, py, pz] = rotateX(px, py, pz, currentRotX * 0.15)

        const proj = project(px, py, pz)
        ctx.beginPath()
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${p.opacity * proj.scale})`
          : `rgba(15, 23, 42, ${p.opacity * 0.5 * proj.scale})`
        ctx.fill()
      })

      // 4. Project Outer Diamond Vertices
      const transOuterVerts = outerVertices.map(([vx, vy, vz]) => {
        let [x, y, z] = rotateY(vx, vy, vz, currentRotY)
        ;[x, y, z] = rotateX(x, y, z, currentRotX)
        return { ...project(x, y, z), rawZ: z }
      })

      // 5. Project Inner Core Vertices
      const transInnerVerts = innerVertices.map(([vx, vy, vz]) => {
        let [x, y, z] = rotateY(vx, vy, vz, -currentRotY * 1.4)
        ;[x, y, z] = rotateX(x, y, z, currentRotX * 1.1)
        return { ...project(x, y, z), rawZ: z }
      })

      // Draw Inner Glowing Core Wireframe
      ctx.strokeStyle = isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.35)'
      ctx.lineWidth = 1
      innerEdges.forEach(([i1, i2]) => {
        const v1 = transInnerVerts[i1]
        const v2 = transInnerVerts[i2]
        ctx.beginPath()
        ctx.moveTo(v1.x, v1.y)
        ctx.lineTo(v2.x, v2.y)
        ctx.stroke()
      })

      // Inner Core Glowing Apex Star
      const centerProj = project(0, 0, 0)
      ctx.beginPath()
      ctx.arc(centerProj.x, centerProj.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? '#FFFFFF' : '#2563EB'
      ctx.shadowColor = isDark ? '#60A5FA' : '#3B82F6'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0

      // 6. Render Outer Prism Facets (Z-Sorted Translucent Glass)
      const sortedFaces = outerFaces
        .map((faceIndices) => {
          const v0 = transOuterVerts[faceIndices[0]]
          const v1 = transOuterVerts[faceIndices[1]]
          const v2 = transOuterVerts[faceIndices[2]]
          const avgZ = (v0.rawZ + v1.rawZ + v2.rawZ) / 3
          return { faceIndices, avgZ, v0, v1, v2 }
        })
        .sort((a, b) => a.avgZ - b.avgZ)

      sortedFaces.forEach(({ v0, v1, v2, avgZ }) => {
        const alpha = Math.max(0.02, Math.min(0.1, (avgZ + 100) / 200 * 0.08 + 0.02))
        const strokeAlpha = Math.max(0.18, Math.min(0.85, (avgZ + 100) / 200 * 0.65 + 0.2))

        ctx.beginPath()
        ctx.moveTo(v0.x, v0.y)
        ctx.lineTo(v1.x, v1.y)
        ctx.lineTo(v2.x, v2.y)
        ctx.closePath()

        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(37, 99, 235, ${alpha * 0.6})`
        ctx.fill()

        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${strokeAlpha})`
          : `rgba(15, 23, 42, ${strokeAlpha * 0.8})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // 7. Golden Apex Star Glow
      const apexVertex = transOuterVerts[0]
      if (apexVertex.rawZ > -60) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(apexVertex.x, apexVertex.y, 4 * apexVertex.scale, 0, Math.PI * 2)
        ctx.fillStyle = '#F59E0B'
        ctx.shadowColor = '#FBBF24'
        ctx.shadowBlur = 16
        ctx.fill()
        ctx.restore()
      }

      // 8. Render Orbital Rings & Module Badges
      orbitalModules.forEach((mod, idx) => {
        const modAngle = angle * mod.speed * 80 + (idx * Math.PI * 2) / orbitalModules.length

        // Minimalist Orbit Ellipse
        ctx.save()
        ctx.translate(displayWidth / 2, displayHeight / 2)
        ctx.rotate(mod.tilt + currentRotX * 0.35)

        ctx.beginPath()
        ctx.ellipse(0, 0, mod.radiusX, mod.radiusY, 0, 0, Math.PI * 2)
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)'
        ctx.lineWidth = 1
        ctx.setLineDash([2, 4])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()

        // Orbiting Coordinates
        const nx = Math.cos(modAngle) * mod.radiusX
        const ny = Math.sin(modAngle) * mod.radiusY
        let [ox, oy, oz] = rotateZ(nx, ny, 0, mod.tilt)
        ;[ox, oy, oz] = rotateX(ox, oy, oz, currentRotX)
        ;[ox, oy, oz] = rotateY(ox, oy, oz, currentRotY * 0.25)

        const nodeProj = project(ox, oy, oz)

        // Connector Beam
        ctx.beginPath()
        ctx.moveTo(centerProj.x, centerProj.y)
        ctx.lineTo(nodeProj.x, nodeProj.y)
        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${0.05 * nodeProj.scale})`
          : `rgba(37, 99, 235, ${0.08 * nodeProj.scale})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Floating Module Node & Glass Pill
        ctx.save()

        ctx.beginPath()
        ctx.arc(nodeProj.x, nodeProj.y, 3.5 * nodeProj.scale, 0, Math.PI * 2)
        ctx.fillStyle = mod.color
        ctx.shadowColor = mod.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif"
        const textWidth = ctx.measureText(mod.name).width
        const badgeX = nodeProj.x + 8
        const badgeY = nodeProj.y - 8

        ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.92)' : 'rgba(255, 255, 255, 0.94)'
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.12)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(badgeX - 4, badgeY - 10, textWidth + 8, 16, 4)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = isDark ? '#EDEDED' : '#0F172A'
        ctx.fillText(mod.name, badgeX, badgeY + 2)
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '490px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'visible',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'block',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      />
    </div>
  )
}
