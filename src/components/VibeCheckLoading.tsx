"use client"

import { motion } from "motion/react"
import AnimatedShaderBackground from "./ui/animated-shader-background"
import { WaveLoader } from "./ui/wave-loader"

interface VibeCheckLoadingProps {
  onBack: () => void;
}

const VibeCheckLoading: React.FC<VibeCheckLoadingProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatedShaderBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={onBack}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            whileHover={{ x: -2 }}
          >
            ← Back
          </motion.button>

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <WaveLoader 
                bars={5}
                message="Reading between the tracks…"
                messagePlacement="bottom"
                className="bg-white"
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-sm"
            >
              Analyzing your musical taste and finding the perfect vibe match...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VibeCheckLoading
