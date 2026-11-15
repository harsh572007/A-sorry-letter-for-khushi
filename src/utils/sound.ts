class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainAmount = 0.06, delay = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainAmount, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playPop() {
    this.playTone(520, 0.11, 'sine', 0.05);
    this.playTone(720, 0.12, 'triangle', 0.04, 0.04);
  }

  playSparkle() {
    this.playTone(880, 0.16, 'sine', 0.04, 0);
    this.playTone(1174, 0.18, 'sine', 0.035, 0.06);
    this.playTone(1396, 0.22, 'triangle', 0.03, 0.12);
  }

  playBloom() {
    this.playTone(440, 0.18, 'sine', 0.045, 0);
    this.playTone(554, 0.2, 'sine', 0.04, 0.06);
    this.playTone(659, 0.25, 'sine', 0.035, 0.12);
  }

  playSoftClick() {
    this.playTone(390, 0.08, 'sine', 0.04);
  }

  playCelebrate() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.28, 'triangle', 0.05, idx * 0.075);
    });
  }
}

export const soundFX = new SoundEffects();
