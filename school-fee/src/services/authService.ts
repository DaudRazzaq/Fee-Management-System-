import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface AuthError {
  code: string;
  message: string;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  schoolId?: string;
  createdAt: any;
  lastLogin: any;
}

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      lastLogin: serverTimestamp()
    }, { merge: true });
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: string = 'admin',
  schoolId?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with displayName
    await updateProfile(userCredential.user, {
      displayName
    });
    
    // Save additional user data to Firestore
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      uid: userCredential.user.uid,
      email,
      displayName,
      role,
      schoolId,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const formatAuthError = (error: any): string => {
  const errorCode = error?.code || '';
  
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error?.message || 'An unknown error occurred.';
  }
};