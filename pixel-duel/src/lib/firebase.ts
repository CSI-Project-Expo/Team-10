import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";

/**
 * When running on localhost or a LAN IP (dev mode), Firebase auth
 * popup/redirect flows require the domain to be authorized.
 * We set authDomain to the current host so Firebase accepts it,
 * provided you add that host in Firebase Console → Auth → Settings → Authorized domains.
 *
 * For production, the default firebaseapp.com domain is used.
 */
const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    /^192\.168\./.test(window.location.hostname) ||
    /^10\./.test(window.location.hostname));

const firebaseConfig = {
  apiKey: "AIzaSyC2CN_1x_J0TsBvydg6msFA1jGCnpErrJA",
  // Use the Firebase domain in production; use current host in local dev
  authDomain: isLocalDev ? window.location.host : "helpplsswork.firebaseapp.com",
  projectId: "helpplsswork",
  storageBucket: "helpplsswork.appspot.com",
  messagingSenderId: "351755950285",
  appId: "1:351755950285:web:0aeb8276c322f5b886f184",
  measurementId: "G-T4XV6THG3K",
};

const app = initializeApp(firebaseConfig);

// Pre-initialize auth so it picks up our custom authDomain
const auth = getAuth(app);

// getAnalytics requires window; guard for safety in SSR/build tools
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, auth, analytics };
