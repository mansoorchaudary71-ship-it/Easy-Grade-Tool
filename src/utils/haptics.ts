/**
 * Utility for tactile haptic feedback using navigator.vibrate.
 * Provides a crisp, subtle vibration (default 20ms) for keypad interactions.
 */

export const DEFAULT_HAPTIC_DURATION = 20;

/**
 * Triggers a subtle tactile haptic vibration.
 * @param duration Duration in milliseconds (default 20ms) or vibration pattern array.
 * @returns boolean indicating whether vibration was triggered.
 */
export function triggerHapticFeedback(pattern: number | number[] = DEFAULT_HAPTIC_DURATION): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      return navigator.vibrate(pattern);
    }
  } catch {
    // Gracefully handle environments where vibration is restricted or unpermitted
    return false;
  }

  return false;
}

/**
 * Keydown handler helper to trigger haptics when a user enters numeric keypad characters.
 */
export function handleNumericKeyDownHaptic(event: React.KeyboardEvent<HTMLInputElement>): void {
  const numericKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '.', ',', '-', '+', 'Backspace', 'Delete',
    'ArrowUp', 'ArrowDown'
  ];

  if (numericKeys.includes(event.key) || event.code.startsWith('Numpad')) {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
  }
}
