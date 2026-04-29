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
  // Lendo o novo logo específico
  const logoPath = path.join(process.cwd(), 'public', 'favicon-logo.png')
  const logoData = fs.readFileSync(logoPath)
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#002855', // Fundo Azul Marinho
          borderRadius: '20%',
          padding: '2px', // Padding reduzido para o logo aparecer maior
        }}
      >
        <img
          src={logoBase64}
          width="28"
          height="28"
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
