// Socket.IO service — placeholder for future backend integration

export interface SocketConfig {
  url: string;
  options?: Record<string, unknown>;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

/**
 * Initialize Socket.IO connection
 * TODO: Implement when backend is ready
 */
export const initSocket = (_config?: Partial<SocketConfig>) => {
  console.log(`[Socket] Ready to connect to ${_config?.url || SOCKET_URL}`);
  // Will be implemented with: import { io } from 'socket.io-client'
};

/**
 * Join matchmaking queue
 */
export const joinMatchmaking = () => {
  console.log('[Socket] Joining matchmaking queue...');
};

/**
 * Leave matchmaking queue
 */
export const leaveMatchmaking = () => {
  console.log('[Socket] Leaving matchmaking queue...');
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  console.log('[Socket] Disconnected');
};
