import { db, auth } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updatePassword, updateProfile as updateAuthProfile } from "firebase/auth";
import { uploadToR2 } from "./upload";

const COLLECTION_NAME = "users";

/**
 * Get user profile from Firestore or create default if not exists
 */
export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Create default profile for existing auth user
            const user = auth.currentUser;
            const defaultProfile = {
                name: user.displayName || 'Admin User',
                email: user.email,
                role: 'Administrator',
                location: '',
                avatar: user.photoURL || '',
                createdAt: new Date().toISOString()
            };
            await setDoc(docRef, defaultProfile);
            return defaultProfile;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

/**
 * Update user profile data in Firestore
 */
export const updateUserProfile = async (uid, data) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, uid);
        await updateDoc(docRef, data);

        // Also update Auth profile if name/avatar changed
        if (auth.currentUser) {
            await updateAuthProfile(auth.currentUser, {
                displayName: data.name,
                photoURL: data.avatar
            });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

/**
 * Update user password
 */
export const changeUserPassword = async (newPassword) => {
    try {
        if (auth.currentUser) {
            await updatePassword(auth.currentUser, newPassword);
        } else {
            throw new Error("No user logged in");
        }
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
};

/**
 * Upload avatar and update profile
 */
export const updateUserAvatar = async (uid, file, onProgress) => {
    try {
        const downloadUrl = await uploadToR2(file, onProgress);
        await updateUserProfile(uid, { avatar: downloadUrl });
        return downloadUrl;
    } catch (error) {
        console.error("Error updating avatar:", error);
        throw error;
    }
};
