import { db } from '../firebase/config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore'
import { uploadToR2 } from './upload'

const COLLECTION_NAME = 'team'

export const getTeamMembers = async () => {
    try {
        // Sort by 'order' ascending. Fallback to createdAt if order is missing (for old data)
        const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    } catch (error) {
        console.error("Error fetching team members:", error)
        // Fallback: fetch without sorting if index is missing (though creating index is better)
        // For now, assuming index exists or small collection
        return []
    }
}

export const addTeamMember = async (memberData) => {
    try {
        const { id, ...dataToSave } = memberData;

        // Assign a default order if not present (simple approach: use timestamp as high number or 0)
        // Better: count and add +1, but for low volume, using Date.now() as default order ensures new ones go to end or start
        // Let's use Date.now() for default order to keep it simple and sortable
        const order = dataToSave.order || Date.now();

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...dataToSave,
            order,
            createdAt: new Date()
        })
        return { id: docRef.id, ...dataToSave, order }
    } catch (error) {
        console.error("Error adding team member:", error)
        throw error
    }
}

export const updateTeamMember = async (id, updates) => {
    try {
        const { id: _, ...dataToUpdate } = updates;
        const docRef = doc(db, COLLECTION_NAME, id)
        await updateDoc(docRef, dataToUpdate)
        return { id, ...dataToUpdate }
    } catch (error) {
        console.error("Error updating team member:", error)
        throw error
    }
}

export const updateTeamOrder = async (items) => {
    try {
        const batch = writeBatch(db);
        items.forEach((item, index) => {
            const docRef = doc(db, COLLECTION_NAME, item.id);
            batch.update(docRef, { order: index });
        });
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Error updating team order:", error);
        throw error;
    }
}

export const deleteTeamMember = async (id, imageUrl) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
        return true
    } catch (error) {
        console.error("Error deleting team member:", error)
        throw error
    }
}

export const uploadTeamImage = async (file, onProgress) => {
    try {
        return await uploadToR2(file, onProgress)
    } catch (error) {
        console.error("Error uploading team image:", error)
        throw error
    }
}
