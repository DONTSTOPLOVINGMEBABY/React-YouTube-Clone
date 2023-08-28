import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage" ; 
import {getFirestore} from "@firebase/firestore" ; 
import {getAuth} from "@firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app) ; 
const firestore = getFirestore(app) ; 
const auth = getAuth(app) ; 

export {storage, firestore, auth} 