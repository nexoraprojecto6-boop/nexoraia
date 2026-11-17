import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowForward } from 'react-icons/io5'
import { useLoader } from '../context/LoaderContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="brand-mark">
      {/* 3 velas japonesas: vermelha, verde, vermelha */}
      <line x1="5" y1="4" x2="5" y2="24" stroke="var(--red-hi)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="2.5" y="8" width="5" height="10" rx="1" fill="var(--red-hi)" />
      <line x1="14" y1="2" x2="14" y2="25" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="11.5" y="5" width="5" height="13" rx="1" fill="var(--green)" />
      <line x1="23" y1="6" x2="23" y2="26" stroke="var(--red-hi)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="20.5" y="10" width="5" height="11" rx="1" fill="var(--red-hi)" />
    </svg>
  )
}

export default function ConnectDerivPage() {
  const navigate = useNavigate()
  const { show } = useLoader()
  const { isLocalAuthenticated, isLocalLoading, isAuthenticated, isLoading: derivLoading } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!isLocalLoading && !isLocalAuthenticated) {
      navigate('/')
      return
    }
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isLocalLoading, isLocalAuthenticated, isAuthenticated])

  // A validar uma sessão Deriv existente: não piscar o ecrã de ligar.
  if (derivLoading) return <div style={pageStyle}><div style={bgStyle} /></div>

  const handleConnect = async () => {
    setIsConnecting(true)
    show('A ligar à Deriv...')
    try {
      const { authUrl } = await api.startLogin()
      window.location.href = authUrl
    } catch (err) {
      console.error('[ConnectDeriv] error:', err)
      setIsConnecting(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={bgStyle} />
      <div style={glowStyle} />

      <div className="fade-in" style={contentStyle}>
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 28 }}>
          <BrandMark size={44} />
        </div>

        <p style={{ color: 'var(--text)', fontSize: 18, fontWeight: 600, lineHeight: 1.45, marginBottom: 24 }}>
          Conecta a tua conta Deriv para começares a negociar
        </p>

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="btn-primary"
          style={{ width: '100%', minHeight: 50, fontSize: 15 }}
        >
          {isConnecting ? 'A ligar...' : (<>Conectar à Deriv <IoArrowForward size={18} /></>)}
        </button>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: 'relative', minHeight: '100dvh',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 'calc(24px + env(safe-area-inset-top, 0px)) 20px calc(24px + env(safe-area-inset-bottom, 0px))',
  overflow: 'hidden',
}

const bgStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
  background: 'linear-gradient(160deg, #05070c 0%, #0a0e17 45%, #05070c 100%)',
}

const glowStyle: React.CSSProperties = {
  position: 'fixed', top: '-18%', left: '50%', transform: 'translateX(-50%)',
  width: 600, height: 600, borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
  background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
}

const contentStyle: React.CSSProperties = {
  position: 'relative', zIndex: 10,
  width: '100%', maxWidth: 380, textAlign: 'center',
}
