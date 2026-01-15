/**
 * Root App Entry Point for Expo
 * Expo expects App at root level
 * This simply wraps the actual mobile app from mobile/App.tsx
 * 
 * NOTE: Using .js instead of .tsx to avoid Next.js TypeScript compilation
 */

module.exports = require('./mobile/App.tsx').default;
