// Tiny client-side auth state. Backend will replace this later.
// Stored in sessionStorage so it clears when the tab closes.

const KEY = 'handi_signed_in';

export const isSignedIn = () => {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(KEY) === '1';
};

export const signIn = () => {
  window.sessionStorage.setItem(KEY, '1');
};

export const signOut = () => {
  window.sessionStorage.removeItem(KEY);
};
