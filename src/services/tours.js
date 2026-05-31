import { db } from "../firebase/config";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";

const COLLECTION_NAME = "tours";

export const getTours = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
    }
};

export const getTourById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Tour not found");
        }
    } catch (error) {
        console.error("Error fetching tour:", error);
        throw error;
    }
};

export const getTourBySlug = async (slug) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } else {
            return null; // Handle not found gracefully
        }
    } catch (error) {
        console.error("Error fetching tour by slug:", error);
        throw error;
    }
};

export const addTour = async (tourData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...tourData,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding tour:", error);
        throw error;
    }
};

export const updateTour = async (id, tourData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, tourData);
    } catch (error) {
        console.error("Error updating tour:", error);
        throw error;
    }
};

export const deleteTour = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting tour:", error);
        throw error;
    }
};
