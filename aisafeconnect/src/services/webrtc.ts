// WebRTC service — placeholder for future peer-to-peer video integration

export interface RTCConfig {
  iceServers: RTCIceServer[];
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

/**
 * Create a new peer connection
 * TODO: Implement when backend signaling is ready
 */
export const createPeerConnection = (_config?: Partial<RTCConfig>): RTCPeerConnection | null => {
  console.log('[WebRTC] Creating peer connection with ICE servers:', _config?.iceServers || DEFAULT_ICE_SERVERS);
  return null;
};

/**
 * Get user media stream (camera + microphone)
 */
export const getUserMedia = async (): Promise<MediaStream | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return stream;
  } catch (error) {
    console.error('[WebRTC] Failed to get user media:', error);
    return null;
  }
};

/**
 * Stop all tracks of a media stream
 */
export const stopMediaStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => track.stop());
};
