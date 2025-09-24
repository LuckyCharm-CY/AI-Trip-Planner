import React from 'react'
import { Button } from '../button'
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
        <h1
        className='font-extrabold text-[40px] text-center mt-16'>
        <span className='text-[#3e0494]'>Discover Your Next Destination with AI: </span>Personalised Iternaries at Your FingerTip
        </h1>
        <p className='text-xl text-gray-500 text-center'> Your personal trip planner and travel curator</p>

        <Link to={'/create-trip'}>
                <Button> Get started, It's Free</Button>
        </Link>

        <img src='/landing.png' className='-mt-41'></img>
    </div>
  )
}

export default Hero
