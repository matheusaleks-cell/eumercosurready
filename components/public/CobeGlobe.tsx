'use client'

import React, { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

export const CobeGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0
    let currentWidth = 0

    const updateSize = () => {
      if (canvasRef.current) {
        currentWidth = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: currentWidth * 2 || 1000,
      height: currentWidth * 2 || 1000,
      phi: 0.1,
      theta: 0.3,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 12,
      baseColor: [0.04, 0.12, 0.22], // var(--color-navy)
      markerColor: [200 / 255, 148 / 255, 58 / 255], // var(--color-gold)
      glowColor: [0.1, 0.2, 0.4],
      markers: [
        // Mercosul
        { location: [-15.793889, -47.882778], size: 0.1 }, // Brasilia
        { location: [-23.5505, -46.6333], size: 0.1 }, // São Paulo
        { location: [-34.6037, -58.3816], size: 0.08 }, // Buenos Aires
        { location: [-34.9011, -56.1644], size: 0.05 }, // Montevideo
        { location: [-25.2637, -57.5759], size: 0.05 }, // Asuncion
        
        // UE
        { location: [40.4168, -3.7038], size: 0.1 }, // Madrid
        { location: [38.7223, -9.1393], size: 0.08 }, // Lisboa
        { location: [48.8566, 2.3522], size: 0.1 }, // Paris
        { location: [52.5200, 13.4050], size: 0.1 }, // Berlim
        { location: [41.9028, 12.4964], size: 0.08 }, // Roma
        { location: [50.8503, 4.3517], size: 0.05 }, // Bruxelas
      ],
      onRender: (state: any) => {
        state.phi = phi
        phi += 0.005
      }
    } as any)

    // Garante que o canvas apareça suavemente
    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1'
    }, 100)

    return () => {
      globe.destroy()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center overflow-visible">
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          maxWidth: '100%', 
          aspectRatio: '1/1',
          opacity: 0,
          transition: 'opacity 1s ease'
        }}
      />
    </div>
  )
}
