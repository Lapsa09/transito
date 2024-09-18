'use client'

import React from 'react'

function Timer({ countdown }: { countdown: number }) {
  return (
    <div className="text-6xl text-center flex w-fit mx-auto bg-green-500 px-5 py-5 rounded-lg">
      <div className="w-24 mx-1 p-2 bg-white text-green-500 rounded-lg">
        <div className="font-mono leading-none" x-text="minutes">
          {Math.floor(countdown / 60)
            .toString()
            .padStart(2, '0')}
        </div>
        <div className="font-mono uppercase text-sm leading-none">Minutos</div>
      </div>
      <div className="w-24 mx-1 p-2 bg-white text-green-500 rounded-lg">
        <div className="font-mono leading-none" x-text="seconds">
          {Math.floor(countdown % 60)
            .toString()
            .padStart(2, '0')}
        </div>
        <div className="font-mono uppercase text-sm leading-none">Segundos</div>
      </div>
    </div>
  )
}

export default Timer
