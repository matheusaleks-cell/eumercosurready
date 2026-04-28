'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { User } from 'lucide-react'
import BlurText from '../animations/BlurText'
import { useLanguage } from '@/hooks/use-language'
import { CobeGlobe } from './CobeGlobe'

const TOTAL_FRAMES = 100

export const HeroSection = () => {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Efeitos de Scroll
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.5, 1, 1])
  const canvasBlur = useTransform(scrollYProgress, [0, 0.15, 1], ["blur(12px)", "blur(0px)", "blur(0px)"])
  
  // Revelação cinemática: Sincronizada para aparecer no final da sequência de frames, antes de subir
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45, 0.6], [0, 0, 1])
  const contentY = useTransform(scrollYProgress, [0.45, 0.6], [30, 0])
  const contentScale = useTransform(scrollYProgress, [0.45, 0.6], [0.96, 1])

  // Transição do fundo da navegação (invisível até sair)
  // Como o usuário quer que suma com o Hero, o background aparece apenas na transição final de saída
  const navBgOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1])
  const navBorderOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1])

  const getFramePath = (index: number) => {
    return `/hero-new/Container_descend_onto_202604252339_${index.toString().padStart(3, '0')}.png`
  }

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    const preloadImages = () => {
      const timeout = setTimeout(() => setIsLoaded(true), 1000)

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new window.Image()
        img.src = getFramePath(i)
        
        const handleLoad = () => {
          loadedCount++
          if (loadedCount === TOTAL_FRAMES) {
            clearTimeout(timeout)
            setIsLoaded(true)
          }
        }
        img.onload = handleLoad
        img.onerror = handleLoad
        loadedImages.push(img)
      }
      setImages(loadedImages)
    }
    preloadImages()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderFrame = (index: number) => {
      const img = images[index]
      if (!img) return
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height)
      const newWidth = img.width * ratio
      const newHeight = img.height * ratio
      const x = (canvas.width - newWidth) / 2
      const y = (canvas.height - newHeight) / 2
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, x, y, newWidth, newHeight)
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1)
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1)
      renderFrame(Math.min(TOTAL_FRAMES - 1, Math.floor(scrollYProgress.get() * TOTAL_FRAMES)))
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      renderFrame(Math.min(TOTAL_FRAMES - 1, Math.floor(latest * TOTAL_FRAMES)))
    })
    renderFrame(0)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      unsubscribe()
    }
  }, [images, scrollYProgress])

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[var(--color-navy)]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-navy)]/95 via-[var(--color-navy)]/40 to-[var(--color-navy)]/95 pointer-events-none" />
        
        {mounted && (
          <>
            <motion.canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ opacity: canvasOpacity, filter: canvasBlur, display: isLoaded ? 'block' : 'none' }}
            />
            
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-display tracking-widest uppercase animate-pulse">
                {t('Carregando...', 'Loading...', 'Cargando...')}
              </div>
            )}
          </>
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
