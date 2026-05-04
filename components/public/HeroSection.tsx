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
  }, [])

  useEffect(() => {
    if (mounted && videoRef.current) {
      // Força o play no início para carregar o primeiro frame e ignorar policy de autoplay
      const startVideo = async () => {
        try {
          await videoRef.current?.play()
          videoRef.current?.pause()
        } catch (e) {
          console.warn("Autoplay was prevented:", e)
        }
      }
      startVideo()

      // Pega a duração caso já tenha carregado antes do listener reagir
      if (videoRef.current.readyState >= 1) {
        setVideoDuration(videoRef.current.duration)
      }
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

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.readyState >= 1) {
      setVideoDuration(e.currentTarget.duration)
    }
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
            className="absolute inset-0 w-full h-full z-0"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleMetadata}
              onLoadedData={handleLoadedData}
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
              {t(
                'Todas as empresas foram validadas pelo nosso comitê de conformidade (KYB)', 
                'All companies have been validated by our compliance committee (KYB)', 
                'Todas las empresas han sido validadas por nuestro comité de cumplimiento (KYB)'
              )}
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
