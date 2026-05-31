import { db } from "../firebase/config";
import { collection, getDocs, getDoc, updateDoc, deleteDoc, doc, query, orderBy, addDoc } from "firebase/firestore";

const COLLECTION_NAME = "inquiries";

export const getInquiries = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        throw error;
    }
};

export const getInquiryById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching inquiry:", error);
        throw error;
    }
};

export const updateInquiryStatus = async (id, status) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { status });
    } catch (error) {
        console.error("Error updating inquiry status:", error);
        throw error;
    }
};

export const createInquiry = async (data) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), data);
    } catch (error) {
        console.error("Error creating inquiry:", error);
        throw error;
    }
};

export const deleteInquiry = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting inquiry:", error);
        throw error;
    }
};

