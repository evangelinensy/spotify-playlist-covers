"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"

import Floating, {
  FloatingElement,
} from "./ui/parallax-floating"

interface ParallaxOnboardingProps {
  onGetStarted: () => void;
}

const exampleImages = [
  {
    url: "/images/landingpageimg1.avif",
    title: "Custom Image 1",
  },
  {
    url: "/images/landingpagedisc-1.png",
    title: "Disc Cover 1",
  },
  {
    url: "/images/landingpagedisc-2.png",
    title: "Disc Cover 2",
  },
  {
    url: "/images/landingpagedisc-3.png",
    title: "Disc Cover 3",
  },
  {
    url: "/images/Forest Dreams-cover.png",
    title: "Forest Dreams Cover",
  },
  {
    url: "/images/landingpagedisc-4.png",
    title: "Disc Cover 4",
  },
  {
    url: "/images/landingpagedisc-5.png",
    title: "Disc Cover 5",
  },
  {
    url: "/images/landingpagedisc-6.png",
    title: "Disc Cover 6",
  },
  {
    url: "/images/landingpagedisc-7.png",
    title: "Disc Cover 7",
  },
]

const ParallaxOnboarding: React.FC<ParallaxOnboardingProps> = ({ onGetStarted }) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [])

  return (
    <div
      className="flex w-full h-full min-h-screen justify-center items-center bg-black overflow-hidden"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
              <p className="text-5xl md:text-7xl z-50 text-white font-calendas italic">
                Spotify Playlist Covers
              </p>
              <p className="text-lg z-50 text-gray-300 mb-8 max-w-2xl">
                Every playlist is a chapter. Yours deserves its cover.
              </p>
              <motion.button
                onClick={onGetStarted}
                className="text-xs z-50 hover:scale-110 transition-transform bg-white text-black rounded-full py-3 px-8 cursor-pointer font-semibold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Make a Cover
              </motion.button>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].url}
            className="w-28 h-28 md:w-40 md:h-40 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].url}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].url}
            className="w-40 h-40 md:w-52 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[60%] left-[25%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        <FloatingElement depth={3} className="top-[85%] left-[75%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[8].url}
            className="w-32 h-32 md:w-40 md:h-40 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

export default ParallaxOnboarding
