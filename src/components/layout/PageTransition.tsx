import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export const containerStagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export const cardEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

interface Props {
  children: ReactNode
  className?: string
  sectionKey: string
}

export function PageTransition({ children, className = '', sectionKey }: Props) {
  return (
    <motion.div
      key={sectionKey}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}
