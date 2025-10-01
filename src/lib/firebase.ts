import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  update, 
  remove, 
  onValue,
  serverTimestamp as rtdbServerTimestamp
} from 'firebase/database';

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
export const db = getDatabase(app);

// Types
export interface ClassEntry {
  id?: string;
  date: string;
  name: string;
  keyPoints: string[];
  createdAt?: number;
  updatedAt?: number;
}

// Realtime Database helpers
const classesRef = ref(db, 'classes');

export const subscribeToClasses = (callback: (classes: ClassEntry[]) => void) => {
  return onValue(classesRef, (snapshot) => {
    const classes: ClassEntry[] = [];
    const data = snapshot.val();
    
    if (data) {
      Object.keys(data).forEach((key) => {
        classes.push({
          id: key,
          ...data[key]
        } as ClassEntry);
      });
      
      // Sort by createdAt descending
      classes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    
    callback(classes);
  }, (error) => {
    console.error('Error fetching classes:', error);
  });
};

export const addClass = async (classData: Omit<ClassEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const newClassRef = push(classesRef);
    await set(newClassRef, {
      ...classData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { id: newClassRef.key, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateClass = async (id: string, classData: Partial<ClassEntry>) => {
  try {
    const classRef = ref(db, `classes/${id}`);
    await update(classRef, {
      ...classData,
      updatedAt: Date.now()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteClass = async (id: string) => {
  try {
    const classRef = ref(db, `classes/${id}`);
    await remove(classRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
