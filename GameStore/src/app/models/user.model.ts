/** Authenticated user with role-based access control. */
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'cliente';
}