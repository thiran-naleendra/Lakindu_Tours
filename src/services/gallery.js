import { db } from "../firebase/config"
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore"

const COLLECTION_NAME = "gallery_assets"

export const getGalleryAssets = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error("Error fetching gallery assets:", error)
        throw error
    }
}

export const addGalleryAsset = async (assetData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...assetData,
            createdAt: serverTimestamp()
        })
        return { id: docRef.id, ...assetData }
    } catch (error) {
        console.error("Error adding gallery asset:", error)
        throw error
    }
}

export const deleteGalleryAsset = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
        return true
    } catch (error) {
        console.error("Error deleting gallery asset:", error)
        throw error
    }
}
