import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Firebase configuration
// NOTE: These should be stored as environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://network-cecda-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Types
export interface ClassEntry {
  id?: string;
  date: string;
  name: string;
  keyPoints: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Authentication helpers
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore helpers
const classesCollection = collection(db, 'classes');

export const subscribeToClasses = (callback: (classes: ClassEntry[]) => void) => {
  const q = query(classesCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const classes: ClassEntry[] = [];
    snapshot.forEach((doc) => {
      classes.push({
        id: doc.id,
        ...doc.data()
      } as ClassEntry);
    });
    callback(classes);
  }, (error) => {
    console.error('Error fetching classes:', error);
  });
};

export const addClass = async (classData: Omit<ClassEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(classesCollection, {
      ...classData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateClass = async (id: string, classData: Partial<ClassEntry>) => {
  try {
    const classRef = doc(db, 'classes', id);
    await updateDoc(classRef, {
      ...classData,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteClass = async (id: string) => {
  try {
    const classRef = doc(db, 'classes', id);
    await deleteDoc(classRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
