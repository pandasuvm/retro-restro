// components/ui/SoundEffects.jsx
import { useEffect } from 'react';
import { useSound } from '../../context/SoundContext';

const SoundEffects = () => {
  const { playSound } = useSound();
  
  useEffect(() => {
    // Function to handle clicks
    const handleClick = (e) => {
      // Check if the clicked element is interactive
      const isInteractive = e.target.tagName === 'BUTTON' || 
                           e.target.tagName === 'A' || 
                           e.target.closest('button') || 
                           e.target.closest('a') ||
                           e.target.getAttribute('role') === 'button';
      
      if (isInteractive) {
        playSound('click');
      }
    };
    
    // Function to handle hover
    const handleMouseEnter = (e) => {
      const isInteractive = e.target.tagName === 'BUTTON' || 
                           e.target.tagName === 'A' || 
                           e.target.closest('button') || 
                           e.target.closest('a') ||
                           e.target.getAttribute('role') === 'button';
      
      if (isInteractive) {
        playSound('hover');
      }
    };
    
    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [playSound]);
  
  return null; // This component doesn't render anything
};

export default SoundEffects;
