'use client'

import React, { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackIcon?: React.ReactNode
  fallbackSrc?: string
}

export const SafeImage = ({ 
  src, 
  alt, 
  className, 
  fallbackIcon, 
  fallbackSrc = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Imagem+Indispon%C3%ADvel',
  ...props 
}: SafeImageProps) => {
  const [error, setError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
    setError(false)
  }, [src])

  if (error || !src) {
    if (fallbackIcon) {
      return (
        <div className={cn("flex items-center justify-center", className)}>
          {fallbackIcon}
        </div>
      )
    }

    return (
      <img 
        src={fallbackSrc} 
        alt="Fallback" 
        className={cn("object-cover", className)} 
      />
    )
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  )
}
