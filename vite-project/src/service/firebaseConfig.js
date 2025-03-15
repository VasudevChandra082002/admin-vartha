import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR0ga8taGCQS_LNGT1oG7YX93ST--dS7M",
  authDomain: "varthajanapadanewsapp.firebaseapp.com",
  projectId: "varthajanapadanewsapp",
  storageBucket: "varthajanapadanewsapp.firebasestorage.app",
  messagingSenderId: "818823084784",
  appId: "1:818823084784:web:197bf7e0df71e51321a035",
  measurementId: "G-NEPMBFTVK2",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
