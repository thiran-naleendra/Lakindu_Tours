import { db } from "../firebase/config";
import { collection, getDocs, addDoc, query, orderBy, where } from "firebase/firestore";

const COLLECTION_NAME = "messages";

export const getMessages = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};

export const sendMessage = async (messageData) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            ...messageData,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};
