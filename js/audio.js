/**
 * SmartCanteen - Native Web Audio Synth Sounds
 * Uses Web Audio API oscillator nodes. Zero external audio dependencies.
 */

class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Play subtle soft click
    playClick() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {
            // Audio policy fallback
        }
    }

    // Play success chime (order placed / payment confirmed)
    playSuccess() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const noteTime = now + (index * 0.08);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.3);
            });
        } catch (e) {
            // Silent fallback
        }
    }

    // Play kitchen bell when an incoming order arrives
    playKitchenAlert() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now); // A5 bell ding
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {
            // Silent fallback
        }
    }

    // Play ready notification chime ("Food Ready for Pickup!")
    playReadyChime() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const chords = [
                { f: 587.33, t: 0 },    // D5
                { f: 880.00, t: 0.12 }, // A5
                { f: 1174.66, t: 0.24 } // D6
            ];

            chords.forEach(item => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const startTime = now + item.t;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(item.f, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.55);
            });
        } catch (e) {
            // Silent fallback
        }
    }
}

// Global sounds singleton
const sounds = new SoundEffects();
