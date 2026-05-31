import { API_BASE } from './api';

export const getHotels = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/hotels`);
        if (!response.ok) throw new Error("Failed to fetch hotels");
        return await response.json();
    } catch (error) {
        console.error("Error getting hotels:", error);
        throw error;
    }
}

export const getHotelById = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/api/hotels/${id}`);
        if (!response.ok) throw new Error("Hotel not found");
        return await response.json();
    } catch (error) {
        console.error("Error getting hotel:", error);
        throw error;
    }
}

export const addHotel = async (hotelData) => {
    try {
        const response = await fetch(`${API_BASE}/api/hotels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hotelData)
        });
        if (!response.ok) throw new Error("Failed to add hotel");
        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error("Error adding hotel:", error);
        throw error;
    }
}

export const updateHotel = async (id, hotelData) => {
    try {
        const response = await fetch(`${API_BASE}/api/hotels/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hotelData)
        });
        if (!response.ok) throw new Error("Failed to update hotel");
    } catch (error) {
        console.error("Error updating hotel:", error);
        throw error;
    }
}

export const deleteHotel = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/api/hotels/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete hotel");
    } catch (error) {
        console.error("Error deleting hotel:", error);
        throw error;
    }
}
