'use client'

import { useState, useEffect } from 'react'
import Dialogue from '@/components/ui/8bit/blocks/dialogue'

// Dialogue messages configuration
const DIALOGUE_MESSAGES = [
  {
    player: true,
    avatarSrc: "/8bit-avatars/willy.png",
    avatarFallback: "W",
    title: "WillyV3",
    description: "My portfolio. Built this stuff when problems needed solving or I wanted to see if something would work."
  },
  {
    player: false,
    avatarSrc: "/8bit-avatars/corn.png",
    avatarFallback: "C",
    title: "Corn",
    description: "Business partner. Also builds shit. Pretty good at it too."
  },
  {
    player: true,
    avatarSrc: "/8bit-avatars/willy.png",
    avatarFallback: "W",
    title: "WillyV3",
    description: "He's not lying. We pair on projects - Go, Python, TypeScript, whatever worked."
  },
  {
    player: false,
    avatarSrc: "/8bit-avatars/corn.png",
    avatarFallback: "C",
    title: "Corn",
    description: "You need a build? humanfrontierlabs.com"
  },
  {
    player: true,
    avatarSrc: "/8bit-avatars/willy.png",
    avatarFallback: "W",
    title: "WillyV3",
    description: "There it is. Check out the projects."
  }
]

const TYPEWRITER_SPEED = 50 // ms per character

export function ProgressiveDialogue() {
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    if (visibleMessages >= DIALOGUE_MESSAGES.length) return

    // Calculate delay based on previous message length
    const previousMessage = DIALOGUE_MESSAGES[visibleMessages - 1]
    const delay = visibleMessages === 0
      ? 0
      : (previousMessage?.description.length || 0) * TYPEWRITER_SPEED + 500 // Add 500ms pause between messages

    const timer = setTimeout(() => {
      setVisibleMessages(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [visibleMessages])

  return (
    <div className="mb-12 min-h-[400px]">
      <div className="space-y-6">
        {DIALOGUE_MESSAGES.slice(0, visibleMessages).map((msg, index) => (
          <Dialogue
            key={index}
            player={msg.player}
            avatarSrc={msg.avatarSrc}
            avatarFallback={msg.avatarFallback}
            title={msg.title}
            description={msg.description}
            typewriterSpeed={TYPEWRITER_SPEED}
          />
        ))}
      </div>
    </div>
  )
}
