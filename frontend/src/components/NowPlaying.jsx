import React from 'react';
import { useIpod } from '../context/IpodContext';

const NowPlaying = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    duration, 
    data, 
    isShuffle, 
    repeatMode 
  } = useIpod();

  // Find index for "X of Y"
  const currentIndex = data && currentSong 
    ? data.findIndex(item => item && (item._id === currentSong._id || item.title === currentSong.title)) 
    : 0;
  const totalSongs = data ? data.length : 1;

  // Default song if none provided
  const song = currentSong || {
    title: "No Song Selected",
    artist: "Unknown Artist",
    album: "Unknown Album",
    cover_image: null
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateProgress = () => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  };
  
  const remainingTime = duration ? duration - progress : 0;

  return (
    <div className="h-full w-full bg-white flex flex-col items-center p-3 relative overflow-hidden">
      
      {/* Top Bar: Status Icons & Counter */}
      <div className="w-full flex justify-between items-center mb-2 px-1 border-b border-gray-300 pb-1 text-[10px] text-gray-600 font-semibold h-6">
        <div className="flex gap-1">
          {isPlaying ? <span className="animate-pulse">▶</span> : <span>⏸</span>}
          {isShuffle && <span title="Shuffle On">🔀</span>}
          {repeatMode === 'ALL' && <span title="Repeat All">🔁</span>}
          {repeatMode === 'ONE' && <span title="Repeat One">🔂</span>}
        </div>
        <span className="text-xs">Now Playing</span>
        <div>{currentIndex + 1} of {totalSongs}</div>
      </div>

      {/* Album Art Area with Reflection */}
      <div className="flex-1 flex flex-col justify-center items-center w-full mb-1">
         {/* Shadow container for depth - Reduced Size to 100px to fit timeline */}
        <div className="relative shadow-lg album-art-reflection group bg-gray-200" style={{ width: '100px', height: '100px' }}>
          {song.cover_image ? (
            <img 
              src={song.cover_image} 
              alt="Album Art" 
              className="w-full h-full object-cover border border-gray-400"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 border border-gray-400">
               <span className="text-4xl">🎵</span>
            </div>
          )}
        </div>
      </div>

      {/* Song Metadata with Marquee conditionally */}
      <div className="w-full flex flex-col items-center mb-2 px-4 text-center">
        <div className="w-full h-5 mb-0.5 overflow-hidden relative">
            {song.title && song.title.length > 20 ? (
                 <div className="marquee-container">
                    <span className="text-sm font-bold text-black marquee-text">{song.title} &nbsp;&nbsp;&nbsp; {song.title}</span>
                 </div>
            ) : (
                 <span className="text-sm font-bold text-black block truncate">{song.title}</span>
            )}
        </div>
        
        <span className="text-xs text-gray-600 truncate w-full max-w-[180px] block">{song.artist}</span>
        <span className="text-[10px] text-gray-400 truncate w-full max-w-[180px] block">{song.album}</span>
      </div>

      {/* Progress Bar Area */}
      <div className="w-full px-4 mt-auto mb-2 shrink-0">
        {/* Timestamps */}
        <div className="flex justify-between text-[10px] font-bold text-gray-700 mb-1">
          <span>{formatTime(progress)}</span>
          <span>-{formatTime(remainingTime)}</span>
        </div>

        {/* The Timeline Bar */}
        <div className="progress-bar-container" style={{ height: '8px', backgroundColor: '#d1d1d1', position: 'relative', borderRadius: '2px', border: '1px solid #a0a0a0', width: '100%' }}>
            <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${calculateProgress()}%`,
                  height: '100%',
                  background: 'linear-gradient(to bottom, #7abcff 0%, #4096ee 50%, #4096ee 100%)',
                  position: 'relative',
                  borderRadius: '1px'
                }}
            >
                {/* Scrubber Diamond */}
                <div className="scrubber-diamond" style={{
                  position: 'absolute',
                  right: '-5px',
                  top: '-3px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #666',
                  transform: 'rotate(45deg)',
                  boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}></div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default NowPlaying;
