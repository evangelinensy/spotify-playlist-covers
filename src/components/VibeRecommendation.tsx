"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { GlowCard } from "./ui/spotlight-card"
import { ShinyButton } from "./ui/shiny-button"

interface VibeRecommendationProps {
  onVibeSelect: (vibe: string) => void;
  onBack: () => void;
  microcopy?: string;
}

const VibeRecommendation: React.FC<VibeRecommendationProps> = ({ onVibeSelect, onBack, microcopy }) => {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  
      // Always show the same 2 themes
      const vibes = [
        {
          name: "Main Character",
          glowColor: "purple" as const
        },
        {
          name: "Healing Arc", 
          glowColor: "green" as const
        }
      ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-calendas italic text-white mb-4">
            We listened. Your playlist cover is calling. Which one are you picking up?
          </h1>
          {microcopy && (
            <motion.p 
              className="text-gray-300 text-lg italic max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {microcopy}
            </motion.p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 justify-items-center">
          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.name}
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <GlowCard
                glowColor={vibe.glowColor}
                customSize={true}
                className={`w-full h-96 cursor-pointer transition-all duration-300 ${
                  selectedVibe === vibe.name 
                    ? 'ring-4 ring-white/30 scale-105' 
                    : selectedVibe && selectedVibe !== vibe.name 
                    ? 'opacity-50 scale-95' 
                    : ''
                }`}
                onClick={() => setSelectedVibe(vibe.name)}
              >
                <div className="flex flex-col items-center justify-center text-center h-full p-6">
                  <h3 className="text-2xl font-calendas font-bold text-white">
                    {vibe.name}
                  </h3>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Make my cover button - slides in after selection */}
        {selectedVibe && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: 0.2 
            }}
            className="mt-12 flex justify-center"
          >
            <ShinyButton
              onClick={() => {
                console.log('🎬 "Make my cover" button clicked with vibe:', selectedVibe);
                onVibeSelect(selectedVibe);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 text-lg font-semibold"
            >
              Make my cover
            </ShinyButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default VibeRecommendation
