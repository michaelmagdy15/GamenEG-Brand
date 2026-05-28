// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAUvzDIKoTvtbMEWaP1pDSyNfqpS3_11wI',
  authDomain: 'faa-test-guide-v2.firebaseapp.com',
  projectId: 'faa-test-guide-v2',
  storageBucket: 'faa-test-guide-v2.firebasestorage.app',
  messagingSenderId: '492280162134',
  appId: '1:492280162134:web:13744335fae3c3d52d98f7',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
