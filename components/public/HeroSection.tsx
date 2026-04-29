'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import { useLanguage } from '@/hooks/use-language'

export const HeroSection = () => {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const isSeeking = useRef(false) // Trava para evitar sobrecarga de pedidos

  useEffect(() => {
    setMounted(true)
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        videoRef.current?.pause()
      }).catch(() => {})
    }
  }, [mounted])

  const { scrollYProgress } = useScroll()

  // Mola de alta sensibilidade para suavizar o input do mouse
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 60,
    mass: 0.5
  })

  // Loop de renderização que só atualiza o vídeo se o navegador estiver "livre"
  useEffect(() => {
    if (!mounted || videoDuration === 0) return

    const updateVideo = () => {
      if (videoRef.current && !isSeeking.current) {
        const progress = smoothProgress.get()
        // Mapeamos os primeiros 35% do site para o vídeo (Hero)
        const videoSectionProgress = Math.min(progress / 0.35, 1)
        const targetTime = videoSectionProgress * videoDuration

        if (Math.abs(videoRef.current.currentTime - targetTime) > 0.04) {
          isSeeking.current = true
          videoRef.current.currentTime = targetTime
        }
      }
      requestAnimationFrame(updateVideo)
    }

    const frameId = requestAnimationFrame(updateVideo)
    return () => cancelAnimationFrame(frameId)
  }, [mounted, videoDuration, smoothProgress])

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoDuration(e.currentTarget.duration)
  }

  // Efeitos de Scroll
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25], [0.4, 1, 1])
  const canvasBlur = useTransform(scrollYProgress, [0, 0.1, 0.25], ["blur(10px)", "blur(0px)", "blur(0px)"])
  
  const contentOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [0, 1, 1])
  const contentY = useTransform(scrollYProgress, [0, 0.12], [20, 0])
  const contentScale = useTransform(scrollYProgress, [0, 0.12], [0.98, 1])

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[var(--color-navy)]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-navy)]/95 via-[var(--color-navy)]/30 to-[var(--color-navy)]/95 pointer-events-none" />
        
        {mounted && (
          <motion.div 
            style={{ opacity: canvasOpacity, filter: canvasBlur }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleMetadata}
              onSeeking={() => { isSeeking.current = true }}
              onSeeked={() => { isSeeking.current = false }}
              className="w-full h-full object-cover will-change-[contents]"
            >
              <source src="/videos/hero-scroll.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}

        {mounted && (
          <motion.div 
            className="relative z-50 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center"
            style={{ 
              opacity: contentOpacity, 
              y: contentY,
              scale: contentScale
            }}
          >
            <motion.h1 
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as any }}
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight justify-center tracking-tight"
            >
              {t('O Acordo EU-Mercosul já começou.', 'The EU-Mercosur Agreement has begun.', 'El Acuerdo EU-Mercosur ya ha começado.')}<br/>
              <span className="text-[var(--color-gold-light)]">{t('Sua empresa está pronta?', 'Is your company ready?', '¿Su empresa está lista?')}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as any }}
              className="max-w-3xl mx-auto text-base md:text-lg text-gray-200 mb-8 font-body justify-center leading-relaxed"
            >
              {t(
                'Enquanto o mercado global se reposiciona, os líderes garantem seu espaço. Posicione sua marca na maior vitrine B2B transcontinental e seja encontrado por parceiros estratégicos.',
                'As the global market repositions itself, leaders secure their space. Position your brand in the largest transcontinental B2B showcase and be found by strategic partners.',
                'Mientras el mercado global se reposiciona, los líderes aseguran su espacio. Posicione su marca en el mayor escaparate B2B transcontinental y sea encontrado por socios estratégicos.'
              )}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
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
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest"
            >
              {t('Sujeito à aprovação do comitê de compliance (KYB)', 'Subject to approval by the compliance committee (KYB)', 'Sujeto a la aprobación del comité de cumplimiento (KYB)')}
            </motion.p>
          </motion.div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-30">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
      <div className="h-[200vh]" />
    </div>
  )
}
