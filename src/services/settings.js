
import { db } from '../firebase/config'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

const SETTINGS_COLLECTION = 'settings'
const REGIONS_DOC_ID = 'regions'

export const getRegions = async () => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, REGIONS_DOC_ID)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data().list || []
        } else {
            // Return default regions if nothing saved yet
            return ['']
        }
    } catch (error) {
        console.error("Error getting regions:", error)
        throw error
    }
}

export const addRegion = async (regionName) => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, REGIONS_DOC_ID)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            await setDoc(docRef, { list: [regionName] })
        } else {
            await updateDoc(docRef, {
                list: arrayUnion(regionName)
            })
        }
    } catch (error) {
        console.error("Error adding region:", error)
        throw error
    }
}

export const deleteRegion = async (regionName) => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, REGIONS_DOC_ID)
        await updateDoc(docRef, {
            list: arrayRemove(regionName)
        })
    } catch (error) {
        console.error("Error removing region:", error)
        throw error
    }
}

export const getSiteSettings = async () => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, 'site_config')
        const docSnap = await getDoc(docRef)
        return docSnap.exists() ? docSnap.data() : { whatsappNumber: '' }
    } catch (error) {
        console.error("Error getting site settings:", error)
        throw error
    }
}

export const updateSiteSettings = async (settings) => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, 'site_config')
        await setDoc(docRef, settings, { merge: true })
    } catch (error) {
        console.error("Error updating site settings:", error)
        throw error
    }
}
