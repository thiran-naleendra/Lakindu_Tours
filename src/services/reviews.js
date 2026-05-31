import { db } from "../firebase/config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, where } from "firebase/firestore";

const COLLECTION_NAME = "reviews";

export const getReviews = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const getReviewsByTourId = async (tourId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("tourId", "==", tourId),
            where("status", "==", "Approved"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching reviews for tour ${tourId}:`, error);
        // Fallback for missing index or other errors
        return [];
    }
};

export const getPendingReviews = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("status", "==", "Pending"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching pending reviews:", error);
        throw error;
    }
}

export const addReview = async (review) => {
    try {
        // review object should contain: tourId, tourName, name, rating, message, bookingReference, images (array)
        await addDoc(collection(db, COLLECTION_NAME), {
            ...review,
            status: 'Pending',
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};

export const updateReviewStatus = async (id, status) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { status });
    } catch (error) {
        console.error("Error updating review status:", error);
        throw error;
    }
};

export const deleteReview = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
};
