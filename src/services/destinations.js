import { API_BASE } from './api';

export const getDestinations = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/destinations`);
        if (!response.ok) throw new Error("Failed to fetch destinations");
        return await response.json();
    } catch (error) {
        console.error("Error fetching destinations:", error);
        throw error;
    }
};

export const getDestinationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/api/destinations/${id}`);
        if (!response.ok) throw new Error("Destination not found");
        return await response.json();
    } catch (error) {
        console.error("Error fetching destination:", error);
        throw error;
    }
};

export const getDestinationBySlug = async (slug) => {
    try {
        // Since we don't have a direct slug endpoint in the worker yet, 
        // we can fetch all and filter, or just use ID if possible.
        // For now, let's fetch all (usually destinations are not many).
        const response = await fetch(`${API_BASE}/api/destinations`);
        if (!response.ok) throw new Error("Failed to fetch destinations");
        const destinations = await response.json();
        return destinations.find(d => d.slug === slug) || null;
    } catch (error) {
        console.error("Error fetching destination by slug:", error);
        throw error;
    }
};

export const addDestination = async (destinationData) => {
    try {
        const response = await fetch(`${API_BASE}/api/destinations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(destinationData)
        });
        if (!response.ok) throw new Error("Failed to add destination");
        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error("Error adding destination:", error);
        throw error;
    }
};

export const updateDestination = async (id, destinationData) => {
    try {
        const response = await fetch(`${API_BASE}/api/destinations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(destinationData)
        });
        if (!response.ok) throw new Error("Failed to update destination");
    } catch (error) {
        console.error("Error updating destination:", error);
        throw error;
    }
};

export const deleteDestination = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/api/destinations/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete destination");
    } catch (error) {
        console.error("Error deleting destination:", error);
        throw error;
    }
};
