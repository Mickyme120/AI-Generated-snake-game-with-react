/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-digital overflow-hidden relative selection:bg-[#ff00ff] selection:text-white">
      {/* Glitch/Noise Overlays */}
      <div className="bg-noise"></div>
      <div className="scanlines"></div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10 screen-tear">
        <header className="text-center mb-8">
          <h1 
            className="text-6xl md:text-8xl font-digital tracking-widest uppercase glitch text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" 
            data-text="SYSTEM.FAILURE"
          >
            SYSTEM.FAILURE
          </h1>
          <p className="text-[#ff00ff] font-digital text-2xl mt-2 tracking-widest animate-pulse">
            [ GLITCH_ART_PROTOCOL_ACTIVE ]
          </p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Left/Top: Snake Game */}
          <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1">
            <SnakeGame />
          </div>

          {/* Right/Bottom: Music Player */}
          <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
            <MusicPlayer />
          </div>
        </main>
        
        <footer className="mt-8 text-center text-[#ff00ff] font-digital text-xl">
          <p>&copy; {new Date().getFullYear()} // MACHINE_MIND_CORE</p>
        </footer>
      </div>
    </div>
  );
}
