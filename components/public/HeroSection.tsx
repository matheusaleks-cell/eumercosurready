'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react'
import { useLanguage } from '@/hooks/use-language'

export const HeroSection = () => {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const frameCount = 60

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const currentFrame = useTransform(scrollYProgress, [0, 1], [1, frameCount])

  useEffect(() => {
    setMounted(true)
    
    // Preload images
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image()
      const frameNum = i.toString().padStart(3, '0')
      img.src = `/hero-frames/Container_descending_on_trucks_202605061342_${frameNum}.jpg`
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setImages([...loadedImages]) // triggers state update when all are loaded
        }
      }
      loadedImages.push(img)
    }
  }, [])

  const drawFrame = (index: number) => {
    if (images.length > 0 && canvasRef.current) {
      const img = images[index]
      if (img && img.complete) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
           const canvas = canvasRef.current
           // Simula 'object-cover'
           const ratio = Math.max(canvas.width / img.width, canvas.height / img.height)
           const newWidth = img.width * ratio
           const newHeight = img.height * ratio
           const offsetX = (canvas.width - newWidth) / 2
           const offsetY = (canvas.height - newHeight) / 2
           
           ctx.clearRect(0, 0, canvas.width, canvas.height)
           ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight)
        }
      }
    }
  }

  // Desenha o primeiro frame quando as imagens carregam ou a janela redimensiona
  useEffect(() => {
    if (images.length > 0) {
      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth
          canvasRef.current.height = window.innerHeight
          drawFrame(Math.round(currentFrame.get()) - 1)
        }
      }
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [images])

  // Atualiza o frame ao fazer scroll
  useMotionValueEvent(currentFrame, "change", (latest) => {
    drawFrame(Math.round(latest) - 1)
  })

  return (
    <div ref={containerRef} className="relative bg-[var(--color-navy)] w-full" style={{ height: '300vh' }}>
      
      {/* Container Fixo (Sticky) */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        
        {/* Camada Escura de Fundo sobre o Canvas */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-navy)]/95 via-[var(--color-navy)]/30 to-[var(--color-navy)]/95 pointer-events-none" />

        {/* Canvas Background */}
        {mounted && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          />
        )}

        {/* Conteúdo do Hero (Texto e Botões sempre visíveis no centro) */}
        {mounted && (
          <div className="relative z-50 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as any }}
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight justify-center tracking-tight pt-20"
            >
              {t(
                'Fornecedores verificados.', 
                'Verified suppliers.', 
                'Proveedores verificados.'
              )}<br/>
              <span className="text-[var(--color-gold-light)]">
                {t(
                  'Prontos para fazer negócios no eixo UE-Mercosul', 
                  'Ready to do business on the EU-Mercosur axis', 
                  'Listos para hacer negocio en eje EU-Mercosur'
                )}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as any }}
              className="max-w-3xl mx-auto text-base md:text-lg text-gray-200 mb-8 font-body justify-center leading-relaxed"
            >
              {t(
                'Acesse um ecossistema curado de empresas europeias e do Mercosul, validadas e acompanhadas pela equipe da Made In Atlantic. Sem ruído, sem intermediários desnecessários, apenas empresas preparadas, prontas para operar no Corredor UE-Mercosul.',
                'Access a curated ecosystem of European and Mercosur companies, validated and accompanied by the Made In Atlantic team. No noise, no unnecessary intermediaries, only prepared companies, ready to operate in the EU-Mercosur Corridor.',
                'Acceda a un ecosistema curado de empresas europeas y del Mercosur, validadas y acompañadas por el equipo de Made In Atlantic. Sin ruido, sin intermediarios innecesarios, solo empresas preparadas, listas para operar en el Corredor EU-Mercosur.'
              )}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/solicitar-cadastro" className="btn-premium w-full sm:w-auto text-center justify-center">
                <span>{t('Promover Minha Empresa', 'Promote My Company', 'Promover Mi Empresa')}</span>
              </Link>
              <Link href="/#oportunidades" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold text-white text-[13px] tracking-widest uppercase transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center">
                {t('Explorar Mercados', 'Explore Markets', 'Explorar Mercados')}
              </Link>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest"
            >
              {t(
                'Todas as empresas foram validadas pelo nosso comitê de conformidade (KYB)', 
                'All companies have been validated by our compliance committee (KYB)', 
                'Todas las empresas han sido validadas por nuestro comité de cumplimiento (KYB)'
              )}
            </motion.p>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-30 animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </div>
  )
}
