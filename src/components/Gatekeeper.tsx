'use client'

import { useState, useEffect } from 'react'

interface GatekeeperProps {
  onAuthenticated: () => void
}

export default function Gatekeeper({ onAuthenticated }: GatekeeperProps) {
  const [phase, setPhase] = useState<'typing' | 'options' | 'rejected' | 'accepted'>('typing')
  const [displayedText, setDisplayedText] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  const fullQuestion = 'You are trapped in an unbreakable, infinite time loop, armed only with a shattered glass shard. The only exit requires an infinitely shifting quantum code. What do you do?'

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem('wolver-authenticated')
    if (isAuthenticated === 'true') {
      onAuthenticated()
      return
    }

    let index = 0
    const interval = setInterval(() => {
      if (index < fullQuestion.length) {
        setDisplayedText(fullQuestion.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setPhase('options')
        setTimeout(() => setShowOptions(true), 400)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [onAuthenticated])

  const handleChoice = (choice: 'A' | 'B' | 'C') => {
    if (choice === 'B') {
      setPhase('accepted')
      localStorage.setItem('wolver-authenticated', 'true')
      setTimeout(() => {
        onAuthenticated()
      }, 1500)
    } else {
      setPhase('rejected')
    }
  }

  if (phase === 'rejected') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950 animate-screen-glitch">
        <div className="text-center px-8">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-red-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="font-display text-xl md:text-2xl text-red-400 font-bold tracking-wide">
            You ain&apos;t Mahmoud or a Mahmoud fan. Get the fuck out.
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'accepted') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
        <div className="text-center animate-fade-in">
          <p className="font-display text-3xl md:text-5xl font-bold">
            Welcome, <span className="gold-gradient-text">Wolver</span>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
      <div className="max-w-3xl w-full px-6 md:px-12">
        {/* Terminal header */}
        <div className="border border-border rounded-t-md">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-4 text-xs text-text-tertiary font-mono tracking-wider uppercase">
              wolver://gatekeeper/auth
            </span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="border border-t-0 border-border rounded-b-md bg-surface/50 p-6 md:p-10">
          <div className="mb-2 text-xs text-text-tertiary font-mono uppercase tracking-widest">
            [PROTOCOL INITIATED]
          </div>
          <p className="font-mono text-sm md:text-base text-text-primary leading-relaxed mb-8">
            {displayedText}
            {phase === 'typing' && <span className="terminal-cursor" />}
          </p>

          {showOptions && (
            <div className="space-y-3 animate-slide-up">
              <button
                onClick={() => handleChoice('A')}
                className="w-full text-left px-5 py-4 border border-border rounded-md bg-bg/50 hover:border-border-hover hover:bg-surface transition-all duration-300 group"
              >
                <span className="text-text-tertiary font-mono text-xs mr-3 group-hover:text-gold-start transition-colors">[A]</span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Attempt to reverse-engineer the temporal algorithm using mathematical deduction.
                </span>
              </button>

              <button
                onClick={() => handleChoice('B')}
                className="w-full text-left px-5 py-4 border border-border rounded-md bg-bg/50 hover:border-gold-start/50 hover:bg-surface hover:shadow-[0_0_20px_rgba(191,149,63,0.1)] transition-all duration-300 group"
              >
                <span className="text-text-tertiary font-mono text-xs mr-3 group-hover:text-gold-start transition-colors">[B]</span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Stab the glass shard directly into the chronal mechanism&apos;s core and break the goddamn fabric of the loop itself.
                </span>
              </button>

              <button
                onClick={() => handleChoice('C')}
                className="w-full text-left px-5 py-4 border border-border rounded-md bg-bg/50 hover:border-border-hover hover:bg-surface transition-all duration-300 group"
              >
                <span className="text-text-tertiary font-mono text-xs mr-3 group-hover:text-gold-start transition-colors">[C]</span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  Conserve energy and wait for external timeline intervention.
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}