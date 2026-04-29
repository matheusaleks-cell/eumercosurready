import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Icon generation
export default function Icon() {
  // Lendo o logo do sistema de arquivos para converter em base64 e garantir que apareça
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  const logoData = fs.readFileSync(logoPath)
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={logoBase64}
          width="32"
          height="32"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
