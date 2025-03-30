// components/ui/SoundToggle.jsx
import { useSound } from '../../context/SoundContext';
import './SoundToggle.css';

const SoundToggle = () => {
  const { toggleMute, muted } = useSound();
  
  return (
    <button 
      className="retro-sound-toggle" 
      onClick={toggleMute}
      aria-label={muted ? "Enable sound" : "Disable sound"}
    >
      {muted ? (
        <span className="sound-icon sound-off">🔇</span>
      ) : (
        <span className="sound-icon sound-on">🔊</span>
      )}
    </button>
  );
};

export default SoundToggle;
