// Sound utility for game effects
class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  private constructor() {
    // Initialize sounds
    this.sounds = {
      keyPress: new Audio('/sounds/key-press.mp3'),
      win: new Audio('/sounds/win.mp3'),
      lose: new Audio('/sounds/lose.mp3'),
    };

    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });

    // Load mute preference from localStorage
    if (typeof window !== 'undefined') {
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
    if (this.muted || typeof window === 'undefined') return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // Reset to start
      sound.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }

  public toggleMute() {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordwise_sound_muted', this.muted.toString());
    }
    return this.muted;
  }

  public isMuted() {
    return this.muted;
  }
}

export const soundManager = SoundManager.getInstance();
