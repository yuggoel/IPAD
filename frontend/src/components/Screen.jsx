import React, { useState, useEffect } from 'react';
import { useIpod } from '../context/IpodContext';
import Menu from './Menu';
import MusicMenu from './MusicMenu';
import SettingsMenu from './SettingsMenu';
import IpodScreen from './IpodScreen';
import GameScreen from './GameScreen';
import SettingsDetail from './SettingsDetail';
import NowPlaying from './NowPlaying';
import SearchScreen from './SearchScreen';

const Screen = () => {
  const { currentScreen, menuItems, selectedIndex, isPlaying, currentSong, theme, dateTime, navigateTo } = useIpod();
  
  const isDark = theme?.backlight === 'black';

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const showMiniPlayer = currentSong && currentScreen !== 'NOW_PLAYING';

  const handleMiniPlayerClick = () => {
    if (currentSong) {
      navigateTo('NOW_PLAYING', [], 'Now Playing');
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'MAIN':
        return <Menu title="iPod" items={menuItems} selectedIndex={selectedIndex} />;
      case 'MUSIC':
        return <MusicMenu />;
      case 'GAMES_LIST':
        return <IpodScreen />;
      case 'SETTINGS':
        return <SettingsMenu />;
      case 'LIST':
        return <IpodScreen />;
      case 'GAME_PLAY':
        return <GameScreen />;
      case 'SETTINGS_DETAIL':
        return <SettingsDetail />;
      case 'SEARCH':
        return <SearchScreen />;
      case 'NOW_PLAYING':
        return <NowPlaying activeItem={currentSong} isPlaying={isPlaying} />;
      default:
        return <div>Error: Unknown Screen</div>;
    }
  };

  return (
    <div className="screen" data-dark={isDark} style={{
      backgroundColor: isDark ? '#0f0f0f' : '#fff',
      color: isDark ? '#f0f0f0' : '#000'
    }}>
      <div className="status-bar" style={{ 
          borderBottom: isDark ? '1px solid #2a2a2a' : '1px solid #ccc',
          backgroundColor: isDark ? '#1a1a1a' : '#eee',
          color: isDark ? '#b0b0b0' : '#555'
        }}>
        <span className="status-left">{isPlaying ? '▶' : ''}</span>
        <span className="status-time">{formatTime(dateTime)}</span>
        <div className="battery">
          <div className="battery-level" style={{ backgroundColor: isDark ? '#aaa' : '#555' }}></div>
        </div>
      </div>
      
      {showMiniPlayer && (
        <div 
          className="mini-player" 
          onClick={handleMiniPlayerClick}
          style={{
            padding: '8px 10px',
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
            borderBottom: isDark ? '1px solid #2a2a2a' : '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontSize: '11px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#252525' : '#e8e8e8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? '#1a1a1a' : '#f5f5f5'}
        >
          <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#ddd',
            borderRadius: '3px',
            marginRight: '8px',
            backgroundImage: currentSong.cover_image ? `url(${currentSong.cover_image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0
          }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ 
              fontWeight: 'bold', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              color: isDark ? '#f0f0f0' : '#000'
            }}>
              {currentSong.title}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: isDark ? '#999' : '#666',
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {currentSong.artist}
            </div>
          </div>
          <div style={{ 
            fontSize: '14px', 
            marginLeft: '8px',
            color: isDark ? '#f0f0f0' : '#000'
          }}>
            {isPlaying ? '▶' : '⏸'}
          </div>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default Screen;
