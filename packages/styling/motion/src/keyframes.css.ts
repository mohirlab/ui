import { keyframes } from '@vanilla-extract/css';
import { declareLayers } from '@mohirlab/themes';

declareLayers();

// Movement is small on purpose: things settle into place rather than fly in.

export const fadeIn = keyframes({ from: { opacity: 0 } }, 'fade-in');
export const fadeOut = keyframes({ to: { opacity: 0 } }, 'fade-out');

export const riseIn = keyframes({ from: { opacity: 0, transform: 'translateY(6px)' } }, 'rise-in');
export const riseOut = keyframes({ to: { opacity: 0, transform: 'translateY(4px)' } }, 'rise-out');

export const scaleIn = keyframes({ from: { opacity: 0, transform: 'scale(0.97)' } }, 'scale-in');
export const scaleOut = keyframes({ to: { opacity: 0, transform: 'scale(0.98)' } }, 'scale-out');

export const sheetIn = keyframes({ from: { transform: 'translateY(100%)' } }, 'sheet-in');
export const sheetOut = keyframes({ to: { transform: 'translateY(100%)' } }, 'sheet-out');

export const slideInEnd = keyframes({ from: { opacity: 0, transform: 'translateX(16px)' } }, 'slide-in-end');
export const slideOutEnd = keyframes({ to: { opacity: 0, transform: 'translateX(24px)' } }, 'slide-out-end');
