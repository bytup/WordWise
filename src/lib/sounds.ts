// Sound utility for game effects
class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  private constructor() {
    // Only initialize sounds in browser environment
    if (typeof window !== 'undefined') {
      // Initialize sounds
      this.sounds = {
        keyPress: new window.Audio('/sounds/key-press.mp3'),
        win: new window.Audio('/sounds/win.mp3'),
        lose: new window.Audio('/sounds/lose.mp3'),
      };

      // Set volume for all sounds
      Object.values(this.sounds).forEach(sound => {
        sound.volume = 0.5;
      });

      // Load mute preference from localStorage
      this.muted = localStorage.getItem('wordwise_sound_muted') === 'true';
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(soundName: keyof typeof this.sounds) {
    if (!this.sounds[soundName] || this.muted || typeof window === 'undefined') return;

    const sound = this.sounds[soundName];
    sound.currentTime = 0; // Reset to start
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }

  public toggleMute() {
    if (typeof window === 'undefined') return false;
    
    this.muted = !this.muted;
    localStorage.setItem('wordwise_sound_muted', this.muted.toString());
    return this.muted;
  }

  public isMuted() {
    return this.muted;
  }
}

export const soundManager = SoundManager.getInstance();
