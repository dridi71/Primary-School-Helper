// FIX: The original content of this file was incorrect, containing React component code.
// It has been replaced with the proper utility function for playing sounds.
// This function is now correctly exported, resolving import errors across the application.

// A simple in-memory cache for audio objects
const audioCache: { [key: string]: HTMLAudioElement } = {};

// A map of sound names to their file paths.
// Assuming sound files are placed in the public/sounds directory.
const soundMap: { [key: string]: string } = {
    select: '/sounds/select.wav',
    correct: '/sounds/correct.mp3',
    incorrect: '/sounds/incorrect.mp3',
    complete: '/sounds/complete.mp3',
    back: '/sounds/back.wav',
};

/**
 * Plays a sound effect.
 * @param soundName The name of the sound to play (e.g., 'select', 'correct').
 */
export const playSound = (soundName: string) => {
  const soundFile = soundMap[soundName];
  if (!soundFile) {
    console.warn(`Sound not found: ${soundName}`);
    return;
  }
  
  try {
    // Use a cached audio element if available, otherwise create a new one.
    if (!audioCache[soundName]) {
      audioCache[soundName] = new Audio(soundFile);
    }
    const audio = audioCache[soundName];
    // Reset playback position and play the sound.
    audio.currentTime = 0;
    audio.play().catch(e => console.error(`Error playing sound "${soundName}":`, e));
  } catch (e) {
    console.error(`Could not play sound "${soundName}"`, e);
  }
};
