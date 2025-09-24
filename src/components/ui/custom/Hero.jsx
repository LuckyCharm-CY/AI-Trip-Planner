import React from 'react'
import { Button } from '../button'
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col items-center text-center gap-9 max-w-4xl mx-auto px-4 mt-16">
      <h1 className="font-extrabold text-[40px] leading-tight">
        <span className="text-[#3e0494]">Discover Your Next Destination with AI:</span> 
        {" "}Personalised Itineraries at Your FingerTip
      </h1>

      <p className="text-xl text-gray-500">
        Your personal trip planner and travel curator
      </p>

      <Link to="/create-trip">
        <Button>Get started, It's Free</Button>
      </Link>

      <img src="/landing.png" alt="Landing preview" className="mt-10 max-w-full" />
    </div>
  )
}

export default Hero
