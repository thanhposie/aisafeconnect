// Route path constants for SafeConnect
// Used to keep route strings DRY across the application

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  PROFILE: '/profile',
  REPORT: '/report',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
