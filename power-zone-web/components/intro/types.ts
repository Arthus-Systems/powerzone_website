/* Shared types for the intro / control-panel UI.
 * These match the spec (.cd-spec) shape exactly: `current` (not `ampere`),
 * plus a `Phase` state-machine type and `Tone` style discriminator. */

export type Readings = {
  power: number;
  voltage: number;
  current: number;
  frequency: number;
  fuel: number;
  load: number;
  coolant: number;
};

export type Tone = 'on' | 'off' | 'warn';

export type Phase = 'idle' | 'arming' | 'online' | 'revealing' | 'hero';

/** Legacy status-line tuple retained for any pre-existing consumers. */
export type StatusLineState = { state: string; color: string };
