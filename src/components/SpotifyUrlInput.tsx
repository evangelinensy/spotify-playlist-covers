"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ShinyButton } from "./ui/shiny-button"
import { BeamsBackground } from "./ui/beams-background"

interface SpotifyUrlInputProps {
  onUrlSubmit: (url: string) => void;
  onBack: () => void;
}

const SpotifyUrlInput: React.FC<SpotifyUrlInputProps> = ({ onUrlSubmit, onBack }) => {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const validateSpotifyUrl = (url: string): boolean => {
    const spotifyPlaylistRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/
    return spotifyPlaylistRegex.test(url.trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError("Please paste your playlist URL first! 🎵")
      return
    }

    if (!validateSpotifyUrl(url)) {
      setError("Hmm… that doesn't look like a Spotify playlist. Try again?")
      return
    }

    setError("")
    onUrlSubmit(url.trim())
  }

  return (
    <BeamsBackground intensity="strong">
      <motion.div
        className="w-full max-w-2xl text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={onBack}
          className="mb-12 text-gray-400 hover:text-white transition-colors flex items-center gap-2 justify-start"
          whileHover={{ x: -2 }}
        >
          ← Back
        </motion.button>

        <div className="mb-12">
          <h1 className="text-5xl font-calendas italic text-white mb-6">
            Paste your playlist URL here.
          </h1>
          <p className="text-gray-400 text-lg opacity-60">
            We only see this playlist, not your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="bg-[#010201] border-none w-[500px] h-[56px] rounded-lg text-white px-[59px] pr-[60px] text-lg focus:outline-none placeholder-gray-400"
              />
              <div className="absolute left-5 top-[15px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="24" fill="none" className="feather feather-search">
                  <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
                  <line stroke="url(#searchl)" y2="16.65" y1="22" x2="16.65" x1="22"></line>
                  <defs>
                    <linearGradient gradientTransform="rotate(50)" id="search">
                      <stop stopColor="#f8e7f8" offset="0%"></stop>
                      <stop stopColor="#b6a9b7" offset="50%"></stop>
                    </linearGradient>
                    <linearGradient id="searchl">
                      <stop stopColor="#b6a9b7" offset="0%"></stop>
                      <stop stopColor="#837484" offset="50%"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute top-2 right-2 flex items-center justify-center z-[2] max-h-10 max-w-[38px] h-full w-full [isolation:isolate] overflow-hidden rounded-lg bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] border border-transparent">
                <svg preserveAspectRatio="none" height="27" width="27" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#d6d6e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-400 text-lg">
                {error}
              </p>
            </motion.div>
          )}

          <div className="flex justify-center">
            <ShinyButton
              type="submit"
              className="bg-white text-black rounded-xl py-4 px-8 font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Vibe check
            </ShinyButton>
          </div>
        </form>
      </motion.div>
    </BeamsBackground>
  )
}

export default SpotifyUrlInput
