import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBcIIONdvrbwmy_3Kl4un2P1mRacsVM9Aw',
  authDomain: 'freelancers-indrive.firebaseapp.com',
  projectId: 'freelancers-indrive',
  storageBucket: 'freelancers-indrive.firebasestorage.app',
  messagingSenderId: '666415076090',
  appId: '1:666415076090:web:2296ed01afd689ce936f43',
  measurementId: 'G-787P62WDP3',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
