"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { ShaderAnimation } from "./ui/shader-animation"
import { HoverButton } from "./ui/hover-button"
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "./ui/responsive-modal"
import { Button } from "./ui/button"

interface GeneratedCoverScreenProps {
  coverImage: string;
  vibe: string;
  playlistAnalysis: any;
  microcopy?: string;
  onDownload: () => void;
  onBack: () => void;
  onGenerateNew: () => void;
}

const GeneratedCoverScreen: React.FC<GeneratedCoverScreenProps> = ({ 
  coverImage, 
  vibe, 
  playlistAnalysis, 
  microcopy,
  onDownload, 
  onBack,
  onGenerateNew
}) => {
  const [showModal, setShowModal] = useState(false);
  
  console.log('🖼️ GeneratedCoverScreen: Displaying cover image:', coverImage);
  console.log('🎵 GeneratedCoverScreen: Vibe:', vibe);
  console.log('📊 GeneratedCoverScreen: Playlist analysis:', playlistAnalysis);

  const handleDownload = () => {
    // Immediately download the image
    onDownload();
    // Show the modal
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ShaderAnimation />
      </div>
      
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <motion.div
          className="w-full max-w-2xl text-center"
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
          <h1 className="text-3xl font-calendas italic text-white mb-2">
            Woah. This cover gets you.
          </h1>
          <p className="text-gray-300">
            {microcopy || "Change your Spotify Playlist Cover."}
          </p>
        </div>

          <motion.div
            className="mb-8 relative z-30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative inline-block">
              <motion.img
                src={coverImage}
                alt={`Generated ${vibe} playlist cover`}
                className="w-64 h-64 rounded-2xl shadow-2xl mx-auto object-cover relative z-30"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <HoverButton
              onClick={onGenerateNew}
              className="text-white border border-white/20 hover:border-white/40"
            >
              Generate a new one
            </HoverButton>
            
            <HoverButton
              onClick={handleDownload}
              className="text-white border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20"
            >
              Download
            </HoverButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Download Promise Modal */}
      <ResponsiveModal open={showModal} onOpenChange={setShowModal}>
        <ResponsiveModalContent className="bg-gray-900 border-gray-700">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle className="text-white text-center">
              Promise you won't send this playlist to your ex?
            </ResponsiveModalTitle>
          </ResponsiveModalHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleModalClose}
              className="bg-white text-black hover:bg-gray-200 px-8 py-2 rounded-lg font-medium"
            >
              Yes
            </Button>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </div>
  )
}

export default GeneratedCoverScreen
