// context/SoundContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import soundService from '../services/SoundService';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [muted, setMuted] = useState(soundService.isMuted());
  
  useEffect(() => {
    // Initialize sound service on first render
    soundService.initialize();
    setMuted(soundService.isMuted());
  }, []);
  
  const playSound = (name) => {
    soundService.play(name);
  };
  
  const toggleMute = () => {
    const newMutedState = soundService.toggleMute();
    setMuted(newMutedState);
    return newMutedState;
  };
  
  const setVolume = (volume) => {
    soundService.setVolume(volume);
  };
  
  return (
    <SoundContext.Provider value={{ playSound, toggleMute, setVolume, muted }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
