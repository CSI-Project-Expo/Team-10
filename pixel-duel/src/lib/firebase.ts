import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC2CN_1x_J0TsBvydg6msFA1jGCnpErrJA",
  authDomain: "helpplsswork.firebaseapp.com",
  projectId: "helpplsswork",
  storageBucket: "helpplsswork.appspot.com",
  messagingSenderId: "351755950285",
  appId: "1:351755950285:web:0aeb8276c322f5b886f184",
  measurementId: "G-T4XV6THG3K"
};

const app = initializeApp(firebaseConfig);
// getAnalytics requires window; guard for safety in SSR/build tools
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, analytics };
