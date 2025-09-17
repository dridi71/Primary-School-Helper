// Re-implemented the audio utility to generate sounds programmatically using the Web Audio API.
// This approach is more robust as it has no external file dependencies, fixing the "Failed to load" error.

let audioContext: AudioContext | null = null;

// Initialize AudioContext on the first user interaction to comply with browser autoplay policies.
const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    try {
      // Standard AudioContext
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
      return null;
    }
  }
  return audioContext;
};

type SoundType = 'select' | 'correct' | 'incorrect' | 'complete' | 'back';

/**
 * Plays a single tone with a given frequency and duration.
 * Includes a fade-out to prevent an audible "click" at the end.
 */
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  const context = getAudioContext();
  if (!context) return;

  // Create an oscillator (for the tone) and a gain node (for volume control)
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  // Configure the tone
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  
  // Set initial volume and apply a fade-out effect for a smoother sound
  gainNode.gain.setValueAtTime(0.15, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration / 1000);

  // Play the sound
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration / 1000);
};

// A map of sound names to their corresponding tone generation logic.
const soundEffects: { [key in SoundType]: () => void } = {
  select: () => playTone(440, 100, 'sine'), // A gentle tone for selection
  correct: () => {
    // A pleasant two-tone sound for a correct answer
    playTone(523.25, 120, 'sine');
    setTimeout(() => playTone(659.25, 150, 'sine'), 120);
  },
  incorrect: () => playTone(220, 200, 'square'), // A lower, distinct tone for an incorrect answer
  complete: () => {
    // An upbeat arpeggio for completing an exercise
    playTone(523.25, 100, 'sine');
    setTimeout(() => playTone(659.25, 100, 'sine'), 100);
    setTimeout(() => playTone(783.99, 200, 'sine'), 200);
  },
  back: () => playTone(330, 100, 'triangle'), // A softer tone for navigating back
};

/**
 * Plays a sound effect by name.
 * @param soundName The name of the sound to play (e.g., 'select', 'correct').
 */
export const playSound = (soundName: SoundType) => {
  const context = getAudioContext();
  // Browsers may suspend the AudioContext until a user interacts with the page.
  if (context && context.state === 'suspended') {
    context.resume();
  }
  
  if (soundEffects[soundName]) {
    soundEffects[soundName]();
  } else {
    console.warn(`Sound effect not found: ${soundName}`);
  }
};
