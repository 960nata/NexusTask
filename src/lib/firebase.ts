import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHXxRNo2PIzLdvNwwh4Z6WDxC8NBh5b2c",
  authDomain: "nexus-803ba.firebaseapp.com",
  projectId: "nexus-803ba",
  storageBucket: "nexus-803ba.firebasestorage.app",
  messagingSenderId: "328152259335",
  appId: "1:328152259335:web:3ae9884b39c6795f8dc3a2",
  measurementId: "G-60RV1Z91FN"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const analytics = typeof window !== "undefined" 
  ? isSupported().then((supported) => supported ? getAnalytics(app) : null) 
  : null;

const auth = typeof window !== "undefined" ? getAuth(app) : null;

export { app, analytics, auth };

