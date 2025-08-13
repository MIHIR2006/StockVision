/**
 * Utility functions for managing the StockVision preloader state
 */

const PRELOADER_KEY = 'stockvision-preloader-shown';

/**
 * Check if the preloader has been shown before
 */
export const hasPreloaderBeenShown = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PRELOADER_KEY) === 'true';
};

/**
 * Mark the preloader as shown
 */
export const markPreloaderAsShown = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRELOADER_KEY, 'true');
};

/**
 * Reset the preloader state (for testing purposes)
 */
export const resetPreloaderState = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PRELOADER_KEY);
};

/**
 * Clear all preloader-related data
 */
export const clearPreloaderData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PRELOADER_KEY);
};
