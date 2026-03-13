import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Horizon',
    artist: 'AI Generator Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Neon Grid Runner',
    artist: 'AI Generator Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Synthwave Dreams',
    artist: 'AI Generator Gamma',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignore AbortError (caused by rapid play/pause or src change)
          // Ignore NotSupportedError (caused by missing source)
          if (error.name === 'NotAllowedError') {
            // Autoplay was prevented by the browser
            setIsPlaying(false);
          } else if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
            console.error("Audio play error:", error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-[#050505] border-glitch p-6 w-full max-w-md mx-auto relative">
      <div className="absolute top-0 left-0 w-full h-full bg-noise pointer-events-none"></div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="w-24 h-24 bg-[#00ffff] flex items-center justify-center mb-4 border-2 border-[#ff00ff]">
          <div className="w-8 h-8 bg-[#050505] border-2 border-[#ff00ff]"></div>
        </div>
        <h2 
          className="text-[#00ffff] font-digital text-3xl tracking-wider text-center glitch drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
          data-text={currentTrack.title}
        >
          {currentTrack.title}
        </h2>
        <p className="text-[#ff00ff] font-digital text-xl tracking-widest uppercase mt-1">
          {currentTrack.artist}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-8 mt-4 mb-2 relative z-10">
        <button
          onClick={handlePrev}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-none drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
        >
          <SkipBack size={36} />
        </button>
        
        <button
          onClick={handlePlayPause}
          className="text-[#ff00ff] hover:text-[#00ffff] transition-none drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]"
        >
          {isPlaying ? <Pause size={56} /> : <Play size={56} />}
        </button>
        
        <button
          onClick={handleNext}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-none drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
        >
          <SkipForward size={36} />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between border-t-2 border-[#ff00ff] pt-4 relative z-10">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-none"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="w-24 h-2 bg-[#050505] border border-[#00ffff] overflow-hidden">
            <div className={`h-full bg-[#ff00ff] ${isMuted ? 'w-0' : 'w-full'}`}></div>
          </div>
        </div>
        <div className="text-xl text-[#00ffff] font-digital">
          TRACK {currentTrackIndex + 1}/{TRACKS.length}
        </div>
      </div>
    </div>
  );
}
