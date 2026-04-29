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
  // Lendo o logo
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
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
          background: '#002855', // Fundo Azul Marinho para dar contraste
          borderRadius: '20%', // Bordas arredondadas estilo app
          padding: '4px', // Espaço interno para o logo não bater nas bordas
        }}
      >
        <img
          src={logoBase64}
          width="24" // Reduzido um pouco para caber no padding
          height="24"
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
