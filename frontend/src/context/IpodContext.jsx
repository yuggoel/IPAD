import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { musicService } from '../services/musicService';

const IpodContext = createContext();

export const useIpod = () => useContext(IpodContext);

const MAIN_MENU_ITEMS = ['Music', 'Games', 'Settings'];
const MUSIC_MENU_ITEMS = ['Search', 'Trending', 'Playlists', 'Albums', 'Artists'];
const GAMES_MENU_ITEMS = ['Snake', 'Tic Tac Toe', 'Memory Game'];
const SETTINGS_MENU_ITEMS = ['About', 'Backlight', 'Theme Color', 'Volume'];

export const IpodProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('MAIN'); // MAIN, MUSIC, GAMES, SETTINGS, LIST, GAME_PLAY, SETTINGS_DETAIL
  const [history, setHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuItems, setMenuItems] = useState(MAIN_MENU_ITEMS);
  const [activeSection, setActiveSection] = useState('Music'); // For title bar
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Theme State with Persistence
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ipod_theme');
      return saved ? JSON.parse(saved) : { caseColor: '#e0e0e0', backlight: 'white', colorName: 'Silver' };
    } catch (e) {
      return { caseColor: '#e0e0e0', backlight: 'white', colorName: 'Silver' };
    }
  });

  const THEME_COLORS = [
    { name: 'Silver', hex: '#e0e0e0' },
    { name: 'Black', hex: '#2a2a2a' },
    { name: 'Red', hex: '#e74c3c' },
    { name: 'Blue', hex: '#3498db' },
    { name: 'Pink', hex: '#ff69b4' },
    { name: 'Green', hex: '#2ecc71' },
    { name: 'Purple', hex: '#9b59b6' },
    { name: 'Orange', hex: '#e67e22' }
  ];

  // Save theme changes
  useEffect(() => {
    localStorage.setItem('ipod_theme', JSON.stringify(theme));
  }, [theme]);


  // Date & Time State
  const [dateTime, setDateTime] = useState(new Date());
  const [editField, setEditField] = useState(null); // 'HOUR', 'MINUTE', 'DAY', 'MONTH', 'YEAR'

  // Clock Tick
  useEffect(() => {
    if (editField) return; // Pause clock while editing
    const timer = setInterval(() => {
        setDateTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [editField]);
  
  // Playback Modes
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('ALL'); // 'OFF', 'ALL', 'ONE'

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Prefetch Cache
  const prefetchCache = useRef({});

  useEffect(() => {
    // Prefetch all music categories on mount
    const categories = [
      { key: 'Trending', fetch: () => musicService.getTrending(20) },
      { key: 'Playlists', fetch: () => musicService.getPlaylists(20) },
      { key: 'Albums', fetch: () => musicService.getAlbums(20) },
      { key: 'Artists', fetch: () => musicService.getArtists(20) }
    ];

    categories.forEach(({ key, fetch }) => {
      fetch()
        .then(data => {
          prefetchCache.current[key] = data;
        })
        .catch(err => console.error(`Prefetch ${key} failed`, err));
    });
  }, []);
  
  const audioRef = useRef(new Audio());

  // Audio Playback Effect
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Check latest state from ref or functional update if possible, 
      // but useEffect closure captures state at creation unless dep array is correct.
      // We need to access the current repeatMode.
      // Since this effect runs once on mount, we can't easily access updated state without re-binding listeners.
      // Better to defer the logic to a function wrapped in useCallback or use a ref for settings.
      setIsPlaying(false);
      handleAudioEndRef.current(); 
    };

    const handleError = (e) => {
        console.error("Audio Error:", e);
        setError("Playback Error");
        setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Mutable ref to access latest state in the event listener
  const handleAudioEndRef = useRef(() => {});

  useEffect(() => {
    if (currentSong) {
      const trackUrl = currentSong.media_url || currentSong.url;
      if (!trackUrl) {
          console.error("No URL found for song:", currentSong);
          setError("No URL for song"); 
          return;
      }

      const audio = audioRef.current;
      const fullUrl = new URL(trackUrl, window.location.origin).href;
      
      const playAudio = async () => {
          try {
              if (audio.src !== fullUrl) {
                audio.src = trackUrl;
                audio.load();
              }
              // Only reset time if we are sure it's a restart action, 
              // but for now let's just ensure it plays.
              
              await audio.play();
              setIsPlaying(true);
              setError(null);
          } catch (err) {
              console.error("Playback failed:", err);
              setIsPlaying(false);
              setError(`Playback Error: ${err.name}`);
          }
      };

      playAudio();
    }
  }, [currentSong]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Resume failed:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Navigation Helper
  const navigateTo = useCallback((screen, items, sectionTitle) => {
    // Save current data state in history so goBack can restore it
    setHistory((prev) => [...prev, { 
      screen: currentScreen, 
      items: menuItems, 
      selectedIndex, 
      section: activeSection,
      data // Save current data
    }]);
    setCurrentScreen(screen);
    setMenuItems(items); // For non-list screens
    setSelectedIndex(0);
    if (sectionTitle) setActiveSection(sectionTitle);
  }, [currentScreen, menuItems, selectedIndex, activeSection, data]);

  const goBack = useCallback(() => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentScreen(lastState.screen);
    setMenuItems(lastState.items);
    setSelectedIndex(lastState.selectedIndex);
    setActiveSection(lastState.section);
    
    // Restore data if it was saved
    if (lastState.data) {
      setData(lastState.data);
    }
    
    setError(null);
  }, [history]);

  // Data Fetching Stub
  const fetchData = useCallback(async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
        console.log(`[Real] Fetching data for: ${endpoint}`);
        let result = [];

        // Check Cache first
        if (prefetchCache.current[endpoint]) {
            console.log(`Using cached data for ${endpoint}`);
            result = prefetchCache.current[endpoint];
            setData(result);
            navigateTo('LIST', result, endpoint);
            setLoading(false);
            return;
        }

        if (endpoint === 'Search') {
            // Navigate to search screen instead of fetching
            navigateTo('SEARCH', [], 'Search');
            setLoading(false);
            return;
        } else if (endpoint === 'Trending') {
            result = await musicService.getTrending(20);
        } else if (endpoint === 'Playlists') {
            // Fake Playlists using Search
            result = await musicService.searchTracks('Workout', 20);
        } else if (endpoint === 'Albums') {
            // Find Top Albums. Limit 50 is enough to get ~10-15 unique albums
            const songs = await musicService.searchTracks('Greatest Hits', 50);
            // Group by Album
            const albumsMap = new Map();
            songs.forEach(song => {
                if(!albumsMap.has(song.album)) {
                    albumsMap.set(song.album, { ...song, title: song.album, type: 'album' }); // Use album name as title
                }
            });
            result = Array.from(albumsMap.values());
        } else if (endpoint === 'Artists') {
            const songs = await musicService.searchTracks('Top Artists', 50);
            // Group by Artist
            const artistMap = new Map();
            songs.forEach(song => {
                if(!artistMap.has(song.artist)) {
                    artistMap.set(song.artist, { ...song, title: song.artist, type: 'artist' }); // Use artist name as title
                }
            });
            result = Array.from(artistMap.values());
        } else if (endpoint === 'Games') {
             // Hardcode Games List for now until we stub that service
             result = [
                 { _id: '1', title: 'Snake', type: 'game' },
                 { _id: '2', title: 'Tic Tac Toe', type: 'game' },
                 { _id: '3', title: 'Memory Game', type: 'game' }
             ];
             
             // Explicitly set data and navigate here to avoid race conditions
             // DO NOT rely on the shared logic at bottom for games
             navigateTo('GAMES_LIST', result, 'Games'); 
             setData(result);
             setLoading(false);
             return;
        }

        setData(result);
        if (result.length === 0) {
             setError("No results found");
        }
        navigateTo('LIST', result, endpoint);

    } catch (err) {
      console.error(err);
      setError('Failed to load data');
      setData([]);
      // Do not navigate to LIST if error, maybe show error in current screen
      // navigateTo('LIST', [], endpoint);
    } finally {
      // Must ensure loading is false
      setLoading(false);
    }
  }, [navigateTo]);

  // Button Handlers
  // Helper to get random index
  const getRandomIndex = useCallback((length, currentIndex) => {
    if (length <= 1) return 0;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * length);
    } while (newIndex === currentIndex);
    return newIndex;
  }, []);

  const handleNextSong = useCallback(() => {
    if (!data || data.length === 0 || !currentSong) return;
    
    // Find current index
    const currentIndex = data.findIndex(item => item._id === currentSong._id || item.title === currentSong.title);
    if (currentIndex === -1) return; // Should not happen

    let nextIndex;
    if (isShuffle) {
        nextIndex = getRandomIndex(data.length, currentIndex);
    } else {
        nextIndex = (currentIndex + 1) % data.length;
    }

    setCurrentSong(data[nextIndex]);
    setIsPlaying(true);
  }, [data, currentSong, isShuffle, getRandomIndex]);

  const handlePrevSong = useCallback(() => {
    if (!data || data.length === 0 || !currentSong) return;
    
    // If more than 3 sec in, restart song (classic behavior)
    if (audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        return;
    }

    const currentIndex = data.findIndex(item => item._id === currentSong._id || item.title === currentSong.title);
    if (currentIndex === -1) return;

    let prevIndex;
    if (isShuffle) {
         prevIndex = getRandomIndex(data.length, currentIndex);
    } else {
         prevIndex = (currentIndex - 1 + data.length) % data.length;
    }
    
    setCurrentSong(data[prevIndex]);
    setIsPlaying(true);
  }, [data, currentSong, isShuffle, getRandomIndex]);

  useEffect(() => {
    handleAudioEndRef.current = () => {
        if (repeatMode === 'ONE') {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error(e));
            setIsPlaying(true);
        } else if (repeatMode === 'OFF') {
             // Stop if at end of list? or just stop? Classic iPod stops if repeat is off and it's last song.
             // But for now, let's just go next or stop.
             handleNextSong(); // Logic inside checks list
        } else {
             handleNextSong();
        }
    };
  }, [repeatMode, handleNextSong]);

  const toggleShuffle = useCallback(() => setIsShuffle(prev => !prev), []);
  const toggleRepeat = useCallback(() => {
      setRepeatMode(prev => prev === 'OFF' ? 'ALL' : (prev === 'ALL' ? 'ONE' : 'OFF'));
  }, []);

  const handleNext = useCallback(() => {
    if (currentScreen === 'GAME_PLAY') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      return;
    }
    
    // Date Time Edits logic removed

    if (currentScreen === 'NOW_PLAYING') {
      handleNextSong();
      return;
    }
    if (menuItems.length === 0 && data.length === 0) return;
    const length = currentScreen === 'LIST' || currentScreen === 'GAMES_LIST' ? data.length : menuItems.length;
    if (length === 0) return;
    setSelectedIndex((prev) => (prev + 1) % length);
  }, [menuItems, data, currentScreen, handleNextSong]);

  const handlePrev = useCallback(() => {
    if (currentScreen === 'GAME_PLAY') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      return;
    }

    // Date Time Edits logic removed

    if (currentScreen === 'NOW_PLAYING') {
      handlePrevSong();
      return;
    }
    if (menuItems.length === 0 && data.length === 0) return;
    const length = currentScreen === 'LIST' || currentScreen === 'GAMES_LIST' ? data.length : menuItems.length;
    if (length === 0) return;
    setSelectedIndex((prev) => (prev - 1 + length) % length);
  }, [menuItems, data, currentScreen, handlePrevSong]);

  const handleMenu = useCallback(() => {
    if (currentScreen === 'GAME_PLAY') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      return;
    }
    
    // Exit edit mode logic removed here

    goBack();
  }, [goBack, currentScreen]);

  const handlePlayPause = useCallback(() => {
    if (currentScreen === 'GAME_PLAY') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [currentScreen]);

  const handleCenter = useCallback(() => {
    const selectedItem = currentScreen === 'LIST' || currentScreen === 'GAMES_LIST' ? data[selectedIndex] : menuItems[selectedIndex];

    if (currentScreen === 'GAME_PLAY') {
      // Use Center to exit game since Menu is mapped to Up
      goBack();
      return;
    }

    if (currentScreen === 'MAIN') {
      if (selectedItem === 'Music') navigateTo('MUSIC', MUSIC_MENU_ITEMS, 'Music');
      if (selectedItem === 'Games') fetchData('Games');
      if (selectedItem === 'Settings') navigateTo('SETTINGS', SETTINGS_MENU_ITEMS, 'Settings');
    } else if (currentScreen === 'MUSIC') {
      fetchData(selectedItem);
    } else if (currentScreen === 'GAMES_LIST') {
      // In Game List, selectedItem is one of the manual game objects we pushed to data
      const gameTitle = selectedItem.title || selectedItem.name;
      // We must set BOTH activeSection (for title) AND navigate to GAME_PLAY
      navigateTo('GAME_PLAY', [], gameTitle); 
    } else if (currentScreen === 'SETTINGS') {
      navigateTo('SETTINGS_DETAIL', [], selectedItem);
    } else if (currentScreen === 'SETTINGS_DETAIL') {
      if (activeSection === 'Backlight') {
          setTheme(prev => ({
            ...prev,
            backlight: prev.backlight === 'white' ? 'black' : 'white'
          }));
      } else if (activeSection === 'Theme Color') {
          setTheme(prev => {
              const currentIndex = THEME_COLORS.findIndex(c => c.name === prev.colorName);
              const nextIndex = (currentIndex + 1) % THEME_COLORS.length;
              return {
                  ...prev,
                  caseColor: THEME_COLORS[nextIndex].hex,
                  colorName: THEME_COLORS[nextIndex].name
              };
          });
      }
    } else if (currentScreen === 'LIST') {
      
      // Stubbed Drill-down logic
      if (activeSection === 'Albums') {
         const albumName = selectedItem.title || selectedItem.name;
         setLoading(true);
         musicService.searchTracks(albumName).then(songs => {
            navigateTo('LIST', songs, albumName);
            setData(songs);
         }).finally(() => setLoading(false));
         return;
      }
      if (activeSection === 'Artists') {
          const artistName = selectedItem.title || selectedItem.name;
          setLoading(true);
          musicService.searchTracks(artistName).then(songs => {
            navigateTo('LIST', songs, artistName);
            setData(songs);
         }).finally(() => setLoading(false));
         return;
      }

      // Drill-down logic: If item has 'songs' array, navigate to it
      if (selectedItem && selectedItem.songs && Array.isArray(selectedItem.songs)) {
        // Navigate to new list, update title
        navigateTo('LIST', selectedItem.songs, selectedItem.name || selectedItem.title);
        // Important: Update data so IpodScreen renders the new collection
        setData(selectedItem.songs);
        return;
      }

      // Play song logic - Start playback in background without navigation
      if (selectedItem && (selectedItem.media_url || selectedItem.url || selectedItem.audio_url)) {
        setCurrentSong(selectedItem);
        setIsPlaying(true);
        // Don't navigate to NOW_PLAYING - let it play in background with mini player
        // User can click mini player to expand to full Now Playing screen
      } else {
        console.warn("Selected item has no playable URL or sub-songs:", selectedItem);
        // Fallback for debugging: if we have a song selected but no URL found, alert the user
        if(selectedItem && !selectedItem.songs) {
            alert(`Error: Song "${selectedItem.title}" has no URL. Data: ${JSON.stringify(selectedItem)}`);
        }
      }
    } else if (currentScreen === 'NOW_PLAYING') {
       // Center button in Now Playing could toggle play/pause or do nothing
       handlePlayPause();
    }
  }, [currentScreen, menuItems, selectedIndex, navigateTo, data, handlePlayPause]);

  const value = {
    currentScreen,
    menuItems,
    selectedIndex,
    setSelectedIndex,
    activeSection,
    searchQuery,
    setSearchQuery,
    isPlaying,
    currentSong,
    data,
    setData,
    loading,
    setLoading,
    error,
    navigateTo,
    volume,
    setVolume,
    progress,
    duration,
    theme,
    setTheme,
    dateTime,
    editField,
    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
    handleNext,
    handlePrev,
    handleMenu,
    handleCenter,
    handlePlayPause,
    handleNextSong,
    handlePrevSong
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowDown':
          handleNext();
          break;
        case 'ArrowUp':
          handlePrev();
          break;
        case 'Enter':
          handleCenter();
          break;
        case 'Escape':
          handleMenu();
          break;
        case ' ': // Spacebar for play/pause
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          handlePrevSong();
          break;
        case 'ArrowRight':
          handleNextSong();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleCenter, handleMenu, handlePlayPause, handleNextSong, handlePrevSong]);

  // Touch Gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    };

    const handleGesture = () => {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const minSwipeDistance = 50;

      // Horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            // Swipe right - go back
            handleMenu();
          }
        }
      } 
      // Vertical swipe
      else {
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0) {
            // Swipe down - next item
            handleNext();
          } else {
            // Swipe up - previous item
            handlePrev();
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleNext, handlePrev, handleMenu]);

  return (
    <IpodContext.Provider value={value}>
      {children}
    </IpodContext.Provider>
  );
};
