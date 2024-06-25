
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "my-chat-ceb58.firebaseapp.com",
  projectId: "my-chat-ceb58",
  storageBucket: "my-chat-ceb58.appspot.com",
  messagingSenderId: "247168705109",
  appId: "1:247168705109:web:23b8aeefc8f2fc1c756adc"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()