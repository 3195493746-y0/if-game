'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import LandingPage from '@/components/game/LandingPage'
import CreatePage from '@/components/game/CreatePage'
import GamePage from '@/components/game/GamePage'
import ArchivePage from '@/components/game/ArchivePage'
import SettingsPage from '@/components/game/SettingsPage'

// 页面过渡变体
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

const pageTransition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
}

export default function App() {
  const { phase } = useGameStore()

  return (
    <AnimatePresence mode="wait">
      {phase === 'landing' && (
        <motion.div
          key="landing"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={pageTransition}
        >
          <LandingPage />
        </motion.div>
      )}

      {phase === 'create' && (
        <motion.div
          key="create"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={pageTransition}
        >
          <CreatePage />
        </motion.div>
      )}

      {phase === 'playing' && (
        <motion.div
          key="playing"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <GamePage />
        </motion.div>
      )}

      {phase === 'archive' && (
        <motion.div
          key="archive"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={pageTransition}
        >
          <ArchivePage />
        </motion.div>
      )}

      {(phase as string) === 'settings' && (
        <motion.div
          key="settings"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          transition={pageTransition}
        >
          <SettingsPage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
