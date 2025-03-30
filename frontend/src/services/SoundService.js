// services/SoundService.js
class SoundService {
    constructor() {
      this.audioContext = null;
      this.sounds = {};
      this.volume = 0.5;
      this.muted = false;
      this.initialized = false;
    }
  
    initialize() {
      if (this.initialized) return;
      
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      
      // Load sounds
      this.loadSound('click', '/sounds/click.mp3');
      this.loadSound('hover', '/sounds/hover.mp3');
      this.loadSound('success', '/sounds/success.mp3');
      this.loadSound('error', '/sounds/error.mp3');
      
      // Try to get saved preferences
      const savedMuted = localStorage.getItem('soundMuted');
      if (savedMuted !== null) {
        this.muted = savedMuted === 'true';
      }
      
      const savedVolume = localStorage.getItem('soundVolume');
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    }
  
    async loadSound(name, url) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds[name] = audioBuffer;
      } catch (error) {
        console.error(`Error loading sound ${name}:`, error);
      }
    }
  
    play(name) {
      if (!this.initialized) this.initialize();
      if (this.muted || !this.sounds[name] || !this.audioContext) return;
      
      // Create source
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = this.volume;
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Play sound
      source.start(0);
    }
  
    setVolume(volume) {
      this.volume = Math.max(0, Math.min(1, volume));
      localStorage.setItem('soundVolume', this.volume.toString());
    }
  
    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('soundMuted', this.muted.toString());
      return this.muted;
    }
  
    isMuted() {
      return this.muted;
    }
  }
  
  // Create singleton instance
  const soundService = new SoundService();
  export default soundService;
  