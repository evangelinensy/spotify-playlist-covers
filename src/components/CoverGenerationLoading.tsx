"use client"

import { motion } from "motion/react"
import WarpDriveShader from "./ui/warp-drive-shader"
import { WaveLoader } from "./ui/wave-loader"

interface CoverGenerationLoadingProps {
  vibe: string;
  onBack: () => void;
  loadingStep?: string;
}

const CoverGenerationLoading: React.FC<CoverGenerationLoadingProps> = ({ vibe, onBack, loadingStep = "Vibe detected. Cover assembling…" }) => {
  console.log('🎬 CoverGenerationLoading: Rendering with vibe:', vibe, 'step:', loadingStep);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <WarpDriveShader />
      
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
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
                message={loadingStep}
                messagePlacement="bottom"
                className="bg-white"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CoverGenerationLoading
