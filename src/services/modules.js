import { db } from "../firebase/config"
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore"

const SETTINGS_COLLECTION = "settings"
const MODULES_DOC_ID = "modules"

// Default modules configuration if nothing exists in DB
const DEFAULT_MODULES = [
    {
        id: 'tours',
        name: 'Tours Module',
        description: 'Manage tour packages, itineraries, and pricing. Disabling this hides all tours from the frontend.',
        icon: 'tour',
        enabled: true,
        status: 'Active'
    },
    {
        id: 'destinations',
        name: 'Destinations',
        description: 'Control available countries and cities. Disabling affects search filters and location pages.',
        icon: 'map',
        enabled: true,
        status: 'Active'
    },
    {
        id: 'hotels',
        name: 'Hotels Manager',
        description: 'Manage partner hotels, accommodations, and amenities.',
        icon: 'hotel',
        enabled: true,
        status: 'Active'
    },
    {
        id: 'tailor-made',
        name: 'Tailor-made',
        description: 'Enable custom trip inquiry forms allowing customers to request personalized itineraries.',
        icon: 'design_services',
        enabled: false,
        status: 'Inactive'
    },
    {
        id: 'messages',
        name: 'Messages',
        description: 'Direct messaging system between agents and clients. Includes email notifications.',
        icon: 'chat',
        enabled: true,
        status: 'Active'
    },
    {
        id: 'reviews',
        name: 'Reviews',
        description: 'Customer testimonials and star ratings for tours. Disabling hides the review section.',
        icon: 'star',
        enabled: true,
        status: 'Active'
    },
    {
        id: 'gallery',
        name: 'Gallery Assets',
        description: 'Centralized photo and video assets manager for the frontend website.',
        icon: 'perm_media',
        enabled: false,
        status: 'Inactive'
    },
    {
        id: 'settings',
        name: 'General Settings',
        description: 'Core site configuration including currency, languages, and SEO metadata.',
        icon: 'settings',
        enabled: true,
        status: 'Active'
    },
    {
        id: 'fleet',
        name: 'Fleet Manager',
        description: 'Manage vehicle fleet and bookings. Disabling hides fleet pages.',
        icon: 'directions_car',
        enabled: true,
        status: 'Active'
    }
]

export const getModules = async () => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, MODULES_DOC_ID)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            // Merge with defaults to ensure new modules appear if code updates
            const storedModules = docSnap.data().list || []
            // Return stored modules but merged with default structure if needed (simple override for now)
            // A better merge strategy might be needed if schema changes, but direct return is fine for now
            // We should ensure we don't lose new modules defined in code but not in DB
            const merged = DEFAULT_MODULES.map(def => {
                const found = storedModules.find(m => m.id === def.id)
                return found ? { ...def, ...found } : def
            })
            return merged
        } else {
            // Initialize if not exists
            try {
                await setDoc(docRef, { list: DEFAULT_MODULES })
            } catch (e) {
                // Ignore permission error (public site cannot write), proceed with defaults
                console.warn("Using default modules (Auto-init blocked by permissions).")
            }
            return DEFAULT_MODULES
        }
    } catch (error) {
        console.error("Error fetching modules", error)
        return DEFAULT_MODULES
    }
}

export const saveModules = async (modulesList) => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, MODULES_DOC_ID)
        await setDoc(docRef, { list: modulesList }, { merge: true })
        return true
    } catch (error) {
        console.error("Error saving modules", error)
        throw error
    }
}
