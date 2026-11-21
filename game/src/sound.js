// Tiny synthesized sounds: no audio files, no network. A found difference chimes, a wrong
// click buzzes low, finishing a level plays a little fanfare. The context is created on the
// first user gesture, so autoplay rules never block it.

export function createSound() {
  let context = null;

  function ensure() {
    if (context !== null) return context;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    } catch {
      return null;
    }
    return context;
  }

  function tone(frequency, start, duration, type, gain) {
    const ctx = ensure();
    if (ctx === null) return;
    try {
      if (ctx.state === 'suspended') void ctx.resume();
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      envelope.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
      oscillator.connect(envelope);
      envelope.connect(ctx.destination);
      oscillator.start(ctx.currentTime + start);
      oscillator.stop(ctx.currentTime + start + duration + 0.05);
    } catch {
      // Sound is garnish: a failure here must never break the game.
    }
  }

  return {
    unlock() {
      ensure();
    },
    found() {
      tone(660, 0, 0.16, 'sine', 0.18);
      tone(990, 0.09, 0.22, 'sine', 0.18);
    },
    wrong() {
      tone(160, 0, 0.22, 'sawtooth', 0.08);
    },
    hint() {
      tone(520, 0, 0.12, 'triangle', 0.12);
      tone(780, 0.08, 0.14, 'triangle', 0.12);
    },
    level() {
      tone(523, 0, 0.14, 'sine', 0.18);
      tone(659, 0.12, 0.14, 'sine', 0.18);
      tone(784, 0.24, 0.2, 'sine', 0.18);
      tone(1047, 0.36, 0.3, 'sine', 0.18);
    },
    win() {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((frequency, index) => {
        tone(frequency, index * 0.13, 0.22, 'sine', 0.18);
      });
    },
  };
}
