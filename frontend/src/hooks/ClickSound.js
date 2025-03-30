// hooks/useClickSound.js
import { useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';

export const useClickSound = (elementRef, soundName = 'click') => {
  const { playSound } = useSound();
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!elementRef.current || initialized.current) return;
    
    const element = elementRef.current;
    
    const handleClick = () => {
      playSound(soundName);
    };
    
    element.addEventListener('click', handleClick);
    initialized.current = true;
    
    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [elementRef, playSound, soundName]);
};
