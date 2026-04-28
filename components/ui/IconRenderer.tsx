import React from 'react'
import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'

interface IconRendererProps extends LucideProps {
  name: string
}

export const IconRenderer = ({ name, ...props }: IconRendererProps) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name]

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />
  }

  return <IconComponent {...props} />
}
