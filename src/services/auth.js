import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/config";

/**
 * Log in a user with email and password
 */
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Auth Login Error:", error.message);
        throw error;
    }
};

/**
 * Log out the current user
 */
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Auth Logout Error:", error.message);
        throw error;
    }
};

/**
 * Listen for auth state changes
 */
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
