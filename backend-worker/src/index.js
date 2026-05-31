import { S3Client, PutObjectCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAccessToken } from "./lib/firestore-auth";
import { Router } from 'itty-router';

// Firebase Config
const FIREBASE_PROJECT_ID = "lakdinu-tours";
const FIREBASE_API_KEY = "AIzaSyCtKbvV5LQibVapGd9cSxQbOYFF_IHzXP8";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// CORS Configuration
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
    "Cache-Control": "no-store"
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders
        }
    });
}

// Router initialization
const router = Router();

// Middleware for CORS
router.all('*', (request) => {
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
});

// Helper to convert Firestore format to standard JSON
function parseFirestoreDocument(doc) {
    if (!doc || !doc.fields) {
        const id = doc && doc.name ? doc.name.split('/').pop() : undefined;
        return { id };
    }

    const id = doc.name ? doc.name.split('/').pop() : 'unknown';
    const obj = { id };

    for (const [key, field] of Object.entries(doc.fields)) {
        if (field.stringValue !== undefined) obj[key] = field.stringValue;
        else if (field.integerValue !== undefined) obj[key] = parseInt(field.integerValue);
        else if (field.doubleValue !== undefined) obj[key] = parseFloat(field.doubleValue);
        else if (field.booleanValue !== undefined) obj[key] = field.booleanValue;
        else if (field.arrayValue !== undefined) {
            obj[key] = (field.arrayValue.values || []).map(v => {
                if (v.stringValue !== undefined) return v.stringValue;
                if (v.integerValue !== undefined) return parseInt(v.integerValue);
                if (v.doubleValue !== undefined) return parseFloat(v.doubleValue);
                if (v.booleanValue !== undefined) return v.booleanValue;
                if (v.mapValue) return parseFirestoreDocument({ fields: v.mapValue.fields });
                return v;
            });
        }
        else if (field.mapValue !== undefined) {
            obj[key] = parseFirestoreDocument({ fields: field.mapValue.fields });
        }
    }
    return obj;
}

// Helper to normalize Tour data for Frontend
function normalizeTour(tour) {
    return {
        ...tour,
        title: tour.title || tour.name || 'Untitled Tour',
        image: tour.coverImage || tour.image || '',
        price: tour.price || 'Contact for Price',
        duration: tour.duration || 'Flexible',
        brief: tour.brief || tour.description || '',
        gallery: tour.gallery || tour.images || []
    };
}

// Helper to normalize Destination data
function normalizeDestination(dest) {
    return {
        ...dest,
        id: dest.id,
        name: dest.name || 'Untitled Destination',
        description: dest.description || '',
        image: dest.image || '',
        gallery: dest.gallery || dest.images || [],
        attractions: dest.attractions || []
    };
}

// Helper to normalize Fleet data
function normalizeFleet(vehicle) {
    return {
        ...vehicle,
        id: vehicle.id,
        name: vehicle.name || 'Untitled Vehicle',
        subtitle: vehicle.subtitle || '',
        type: vehicle.type || 'Sedan',
        seats: parseInt(vehicle.seats) || 4,
        luggage: parseInt(vehicle.luggage) || 2,
        fuelType: vehicle.fuelType || 'Auto',
        fuelIcon: vehicle.fuelIcon || 'local_gas_station',
        price: parseFloat(vehicle.price) || 0,
        oldPrice: vehicle.oldPrice ? parseFloat(vehicle.oldPrice) : null,
        image: vehicle.image || '',
        gallery: vehicle.gallery || vehicle.images || []
    };
}

// Helper to normalize Hotel data
function normalizeHotel(hotel) {
    return {
        ...hotel,
        id: hotel.id,
        name: hotel.name || 'Untitled Hotel',
        location: hotel.location || '',
        rating: parseFloat(hotel.rating) || 5.0,
        reviews: parseInt(hotel.reviews) || 0,
        description: hotel.description || '',
        image: hotel.image || '',
        tag: hotel.tag || '',
        website: hotel.website || '',
        amenities: hotel.amenities || []
    };
}

// Helper to normalize Inquiry data
function normalizeInquiry(inquiry) {
    const details = inquiry.details || {};
    const rooms = {};
    if (details.rooms && typeof details.rooms === 'object') {
        Object.assign(rooms, details.rooms);
    }
    const interests = {};
    if (details.interests && typeof details.interests === 'object') {
        Object.assign(interests, details.interests);
    }

    const type = inquiry.type || 'General';

    return {
        id: inquiry.id,
        status: inquiry.status || 'New',
        message: inquiry.message || '',
        createdAt: inquiry.createdAt,
        type: type,
        customer: {
            name: inquiry.name || 'Unknown',
            email: inquiry.email || 'No Email',
            phone: inquiry.phone || 'No Phone',
            nationality: details.country || 'N/A'
        },
        tour: type === 'Tailor Made' ? 'Tailor Made Request' : (type === 'Fleet' ? 'Vehicle Booking' : (inquiry.subject || 'General Inquiry')),
        tourDetails: {
            arrivalDate: details.arrival || details.pickupDate ? new Date(details.arrival || details.pickupDate).toLocaleDateString() : 'N/A',
            arrivalTime: details.arrival ? new Date(details.arrival).toLocaleTimeString() : '',
            departureDate: details.departure || details.returnDate ? new Date(details.departure || details.returnDate).toLocaleDateString() : 'N/A',
            departureTime: details.departure ? new Date(details.departure).toLocaleTimeString() : '',
            duration: (details.arrival && details.departure) || (details.pickupDate && details.returnDate)
                ? Math.ceil((new Date(details.departure || details.returnDate) - new Date(details.arrival || details.pickupDate)) / (1000 * 60 * 60 * 24))
                : 0,
            adults: details.adults || details.pax || 0,
            children: details.children || 0,
            childAges: Array.isArray(details.childAges) ? details.childAges : []
        },
        fleetDetails: type === 'Fleet' ? {
            pickupDate: details.pickupDate,
            returnDate: details.returnDate,
            pickupLocation: details.pickupLocation,
            dropLocation: details.dropLocation,
            vehicleId: details.vehicleId,
            luggage: details.luggage,
            kidsSeat: details.kidsSeat,
            pax: details.pax
        } : null,
        accommodation: {
            rooms: rooms,
            starRating: details.hotelStar ? [details.hotelStar] : [],
            mealPlan: details.mealPlan ? [details.mealPlan] : []
        },
        interests: interests
    };
}

// --- Health Check ---
router.get('/api/health', (request, env) => {
    return jsonResponse({
        status: "ok",
        config: {
            hasR2Key: !!env.R2_ACCESS_KEY_ID,
            hasR2Secret: !!env.R2_SECRET_ACCESS_KEY,
            hasFirebaseSecret: !!env.FIREBASE_SERVICE_ACCOUNT_JSON,
            projectId: FIREBASE_PROJECT_ID
        },
        workerTime: new Date().toISOString()
    });
});

// --- API ROUTES ---

// GET /api/tours
router.get('/api/tours', async (request, env) => {
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/tours?pageSize=50`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse([]);
            const errorText = await response.text();
            throw new Error(`Firestore failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const tours = (data.documents || []).map(parseFirestoreDocument).map(normalizeTour);
        return jsonResponse(tours);
    } catch (e) {
        console.error("Fetch Tours Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/tours/:id
router.get('/api/tours/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/tours/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse({ error: "Tour not found" }, 404);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const doc = await response.json();
        return jsonResponse(normalizeTour(parseFirestoreDocument(doc)));
    } catch (e) {
        console.error("Fetch Single Tour Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/destinations
router.get('/api/destinations', async (request, env) => {
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/destinations?pageSize=50`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse([]);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const data = await response.json();
        const destinations = (data.documents || []).map(parseFirestoreDocument).map(normalizeDestination);
        return jsonResponse(destinations);
    } catch (e) {
        console.error("Fetch Destinations Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/destinations/:id
router.get('/api/destinations/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/destinations/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse({ error: "Destination not found" }, 404);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const doc = await response.json();
        return jsonResponse(normalizeDestination(parseFirestoreDocument(doc)));
    } catch (e) {
        console.error("Fetch Single Destination Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// POST /api/destinations (Admin)
router.post('/api/destinations', async (request, env) => {
    try {
        const token = await getAccessToken(env);
        const body = await request.json();
        const firestoreDoc = {
            fields: {
                name: { stringValue: body.name || "Untitled" },
                slug: { stringValue: body.slug || "" },
                description: { stringValue: body.description || "" },
                region: { stringValue: body.region || "" },
                country: { stringValue: body.country || "Sri Lanka" },
                status: { stringValue: body.status || "Draft" },
                image: { stringValue: body.image || "" },
                gallery: { arrayValue: { values: (body.gallery || []).map(g => ({ stringValue: g })) } },
                excursions: {
                    arrayValue: {
                        values: (body.excursions || []).map(e => ({
                            mapValue: {
                                fields: {
                                    title: { stringValue: e.title || "" },
                                    description: { stringValue: e.description || "" },
                                    link: { stringValue: e.link || "" },
                                    image: { stringValue: e.image || "" }
                                }
                            }
                        }))
                    }
                },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const response = await fetch(`${FIRESTORE_URL}/destinations`, {
            method: 'POST',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to write to Firestore");
        const result = await response.json();
        return jsonResponse({ message: 'Destination created', id: result.name.split('/').pop() }, 201);
    } catch (e) {
        console.error("Create Destination Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// PUT /api/destinations/:id (Admin)
router.put('/api/destinations/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const body = await request.json();
        const firestoreDoc = { fields: {} };

        if (body.name !== undefined) firestoreDoc.fields.name = { stringValue: body.name };
        if (body.slug !== undefined) firestoreDoc.fields.slug = { stringValue: body.slug };
        if (body.description !== undefined) firestoreDoc.fields.description = { stringValue: body.description };
        if (body.region !== undefined) firestoreDoc.fields.region = { stringValue: body.region };
        if (body.country !== undefined) firestoreDoc.fields.country = { stringValue: body.country };
        if (body.status !== undefined) firestoreDoc.fields.status = { stringValue: body.status };
        if (body.image !== undefined) firestoreDoc.fields.image = { stringValue: body.image };
        if (body.gallery !== undefined) {
            firestoreDoc.fields.gallery = { arrayValue: { values: (body.gallery || []).map(g => ({ stringValue: g })) } };
        }
        if (body.excursions !== undefined) {
            firestoreDoc.fields.excursions = {
                arrayValue: {
                    values: (body.excursions || []).map(e => ({
                        mapValue: {
                            fields: {
                                title: { stringValue: e.title || "" },
                                description: { stringValue: e.description || "" },
                                link: { stringValue: e.link || "" },
                                image: { stringValue: e.image || "" }
                            }
                        }
                    }))
                }
            };
        }

        const updateMask = Object.keys(firestoreDoc.fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
        const response = await fetch(`${FIRESTORE_URL}/destinations/${id}?${updateMask}`, {
            method: 'PATCH',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to update Firestore");
        return jsonResponse({ message: 'Destination updated', id });
    } catch (e) {
        console.error("Update Destination Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// DELETE /api/destinations/:id (Admin)
router.delete('/api/destinations/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/destinations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to delete from Firestore");
        return jsonResponse({ message: 'Destination deleted', id });
    } catch (e) {
        console.error("Delete Destination Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/fleet
router.get('/api/fleet', async (request, env) => {
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/fleet?pageSize=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse([]);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const data = await response.json();
        const vehicles = (data.documents || []).map(parseFirestoreDocument).map(normalizeFleet);
        return jsonResponse(vehicles);
    } catch (e) {
        console.error("Fetch Fleet Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/fleet/:id
router.get('/api/fleet/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/fleet/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse({ error: "Vehicle not found" }, 404);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const doc = await response.json();
        return jsonResponse(normalizeFleet(parseFirestoreDocument(doc)));
    } catch (e) {
        console.error("Fetch Single Vehicle Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// POST /api/fleet (Admin)
router.post('/api/fleet', async (request, env) => {
    try {
        const body = await request.json();
        const firestoreDoc = {
            fields: {
                name: { stringValue: body.name || "Untitled" },
                subtitle: { stringValue: body.subtitle || "" },
                type: { stringValue: body.type || "Sedan" },
                seats: { integerValue: body.seats || 4 },
                luggage: { integerValue: body.luggage || 2 },
                fuelType: { stringValue: body.fuelType || "Auto" },
                fuelIcon: { stringValue: body.fuelIcon || "local_gas_station" },
                price: { doubleValue: parseFloat(body.price) || 0 },
                oldPrice: body.oldPrice ? { doubleValue: parseFloat(body.oldPrice) } : { nullValue: null },
                image: { stringValue: body.image || "" },
                gallery: { arrayValue: { values: (body.gallery || []).map(g => ({ stringValue: g })) } },
                description: { stringValue: body.description || "" },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/fleet`, {
            method: 'POST',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to write to Firestore");
        const result = await response.json();
        return jsonResponse({ message: 'Vehicle created', id: result.name.split('/').pop() }, 201);
    } catch (e) {
        console.error("Create Vehicle Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// PUT /api/fleet/:id (Admin)
router.put('/api/fleet/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const body = await request.json();
        const firestoreDoc = { fields: {} };

        if (body.name !== undefined) firestoreDoc.fields.name = { stringValue: body.name };
        if (body.subtitle !== undefined) firestoreDoc.fields.subtitle = { stringValue: body.subtitle };
        if (body.type !== undefined) firestoreDoc.fields.type = { stringValue: body.type };
        if (body.seats !== undefined) firestoreDoc.fields.seats = { integerValue: body.seats };
        if (body.luggage !== undefined) firestoreDoc.fields.luggage = { integerValue: body.luggage };
        if (body.fuelType !== undefined) firestoreDoc.fields.fuelType = { stringValue: body.fuelType };
        if (body.fuelIcon !== undefined) firestoreDoc.fields.fuelIcon = { stringValue: body.fuelIcon };
        if (body.price !== undefined) firestoreDoc.fields.price = { doubleValue: parseFloat(body.price) };
        if (body.oldPrice !== undefined) firestoreDoc.fields.oldPrice = body.oldPrice ? { doubleValue: parseFloat(body.oldPrice) } : { nullValue: null };
        if (body.image !== undefined) firestoreDoc.fields.image = { stringValue: body.image };
        if (body.gallery !== undefined) {
            firestoreDoc.fields.gallery = { arrayValue: { values: (body.gallery || []).map(g => ({ stringValue: g })) } };
        }

        const updateMask = Object.keys(firestoreDoc.fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/fleet/${id}?${updateMask}`, {
            method: 'PATCH',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to update Firestore");
        return jsonResponse({ message: 'Vehicle updated', id });
    } catch (e) {
        console.error("Update Vehicle Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// DELETE /api/fleet/:id (Admin)
router.delete('/api/fleet/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/fleet/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to delete from Firestore");
        return jsonResponse({ message: 'Vehicle deleted', id });
    } catch (e) {
        console.error("Delete Vehicle Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/hotels
router.get('/api/hotels', async (request, env) => {
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/hotels?pageSize=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse([]);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const data = await response.json();
        const hotels = (data.documents || []).map(parseFirestoreDocument).map(normalizeHotel);
        return jsonResponse(hotels);
    } catch (e) {
        console.error("Fetch Hotels Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/hotels/:id
router.get('/api/hotels/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/hotels/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse({ error: "Hotel not found" }, 404);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const doc = await response.json();
        return jsonResponse(normalizeHotel(parseFirestoreDocument(doc)));
    } catch (e) {
        console.error("Fetch Single Hotel Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// POST /api/hotels (Admin)
router.post('/api/hotels', async (request, env) => {
    try {
        const body = await request.json();
        const firestoreDoc = {
            fields: {
                name: { stringValue: body.name || "Untitled" },
                location: { stringValue: body.location || "" },
                rating: { doubleValue: parseFloat(body.rating) || 5.0 },
                reviews: { integerValue: parseInt(body.reviews) || 0 },
                description: { stringValue: body.description || "" },
                image: { stringValue: body.image || "" },
                tag: { stringValue: body.tag || "" },
                website: { stringValue: body.website || "" },
                amenities: { arrayValue: { values: (body.amenities || []).map(a => ({ stringValue: a })) } },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/hotels`, {
            method: 'POST',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to write to Firestore");
        const result = await response.json();
        return jsonResponse({ message: 'Hotel created', id: result.name.split('/').pop() }, 201);
    } catch (e) {
        console.error("Create Hotel Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// PUT /api/hotels/:id (Admin)
router.put('/api/hotels/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const body = await request.json();
        const firestoreDoc = { fields: {} };

        if (body.name !== undefined) firestoreDoc.fields.name = { stringValue: body.name };
        if (body.location !== undefined) firestoreDoc.fields.location = { stringValue: body.location };
        if (body.rating !== undefined) firestoreDoc.fields.rating = { doubleValue: parseFloat(body.rating) };
        if (body.reviews !== undefined) firestoreDoc.fields.reviews = { integerValue: parseInt(body.reviews) };
        if (body.description !== undefined) firestoreDoc.fields.description = { stringValue: body.description };
        if (body.image !== undefined) firestoreDoc.fields.image = { stringValue: body.image };
        if (body.tag !== undefined) firestoreDoc.fields.tag = { stringValue: body.tag };
        if (body.website !== undefined) firestoreDoc.fields.website = { stringValue: body.website };
        if (body.amenities !== undefined) {
            firestoreDoc.fields.amenities = { arrayValue: { values: (body.amenities || []).map(a => ({ stringValue: a })) } };
        }

        const updateMask = Object.keys(firestoreDoc.fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/hotels/${id}?${updateMask}`, {
            method: 'PATCH',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to update Firestore");
        return jsonResponse({ message: 'Hotel updated', id });
    } catch (e) {
        console.error("Update Hotel Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// DELETE /api/hotels/:id (Admin)
router.delete('/api/hotels/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/hotels/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to delete from Firestore");
        return jsonResponse({ message: 'Hotel deleted', id });
    } catch (e) {
        console.error("Delete Hotel Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/inquiries
router.get('/api/inquiries', async (request, env) => {
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/inquiries?pageSize=50&orderBy=createdAt desc`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse([]);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const data = await response.json();
        const inquiries = (data.documents || []).map(parseFirestoreDocument).map(normalizeInquiry);
        return jsonResponse(inquiries);
    } catch (e) {
        console.error("Fetch Inquiries Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// GET /api/inquiries/:id
router.get('/api/inquiries/:id', async (request, env) => {
    const { id } = request.params;
    try {
        const token = await getAccessToken(env);
        const response = await fetch(`${FIRESTORE_URL}/inquiries/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 404) return jsonResponse({ error: "Inquiry not found" }, 404);
            throw new Error(`Firestore failed: ${response.status}`);
        }

        const doc = await response.json();
        return jsonResponse(normalizeInquiry(parseFirestoreDocument(doc)));
    } catch (e) {
        console.error("Fetch Single Inquiry Error:", e);
        return jsonResponse({ error: e.message }, 500);
    }
});

// POST /api/inquiries
router.post('/api/inquiries', async (request, env) => {
    try {
        const body = await request.json();
        const name = body.name || "Unknown";
        const email = body.email || "";
        const type = body.type || "General";
        const phone = body.phone || "";
        const subject = body.subject || (type === "Tailor Made" ? "Tailor Made Request" : "New Inquiry");

        const details = {};
        const addIf = (key, val) => { if (val !== undefined && val !== null && val !== "") details[key] = { stringValue: String(val) }; };
        const addNum = (key, val) => { if (val !== undefined && val !== null) details[key] = { integerValue: parseInt(val) }; };

        addIf('arrival', body.arrival);
        addIf('departure', body.departure);
        addNum('adults', body.adults);
        addNum('children', body.children);
        addIf('hotelStar', body.hotelStar);
        addIf('mealPlan', body.mealPlan);
        addIf('country', body.country);
        addIf('tourId', body.tourId);
        addIf('vehicleId', body.vehicleId);
        addIf('pickupDate', body.pickupDate);
        addIf('returnDate', body.returnDate);
        addIf('pickupLocation', body.pickupLocation);
        addIf('dropLocation', body.dropLocation);
        addNum('pax', body.pax);
        addNum('luggage', body.luggage);
        if (body.kidsSeat !== undefined) details['kidsSeat'] = { booleanValue: !!body.kidsSeat };

        if (body.childAges && Array.isArray(body.childAges)) {
            details['childAges'] = { arrayValue: { values: body.childAges.map(age => ({ integerValue: age || 0 })) } };
        }
        if (body.rooms) {
            details['rooms'] = {
                mapValue: {
                    fields: Object.fromEntries(Object.entries(body.rooms).map(([k, v]) => [k, { integerValue: v || 0 }]))
                }
            };
        }
        if (body.interests) {
            details['interests'] = {
                mapValue: {
                    fields: Object.fromEntries(Object.entries(body.interests).map(([k, v]) => [k, { integerValue: v || 0 }]))
                }
            };
        }

        let messageContent = body.message || "";
        if (type === "Tailor Made" && body.messageSummary) {
            messageContent = body.messageSummary + "\n\n" + messageContent;
        }

        const firestoreDoc = {
            fields: {
                name: { stringValue: name },
                email: { stringValue: email },
                phone: { stringValue: phone },
                type: { stringValue: type },
                subject: { stringValue: subject },
                message: { stringValue: messageContent },
                status: { stringValue: "new" },
                details: { mapValue: { fields: details } },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const response = await fetch(`${FIRESTORE_URL}/inquiries?key=${FIREBASE_API_KEY}`, {
            method: 'POST',
            body: JSON.stringify(firestoreDoc),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Failed to write to Firestore");

        const result = await response.json();

        // Send Email Notification
        try {
            if (env.RESEND_API_KEY) {
                const mailDetails = Object.entries(details).map(([k, v]) => {
                    let value = "";
                    if (v.stringValue) value = v.stringValue;
                    else if (v.integerValue !== undefined) value = v.integerValue;
                    else if (v.booleanValue !== undefined) value = v.booleanValue ? "Yes" : "No";
                    else if (v.arrayValue) value = (v.arrayValue.values || []).map(i => i.stringValue || i.integerValue).join(', ');
                    else if (v.mapValue) value = "Complex Object";

                    // Humanize keys
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return `<li><strong>${label}:</strong> ${value}</li>`;
                }).join('');

                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333;">New Inquiry: ${subject}</h1>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Type:</strong> ${type}</p>
                        </div>
                        
                        <h3>Details</h3>
                        <ul>${mailDetails}</ul>

                        <h3>Message</h3>
                        <p style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">${messageContent}</p>
                        
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                        <p style="font-size: 12px; color: #888;">Received via Lakdinu Tours Website</p>
                    </div>
                `;

                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${env.RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Lakdinu Tours <onboarding@resend.dev>',
                        to: ['dilshandimuthu@gmail.com'],
                        reply_to: email, // Set reply-to as the customer's email
                        subject: `[Lakdinu Tours] New Inquiry from ${name}`,
                        html: emailHtml
                    })
                });

                if (!emailRes.ok) console.error("Email Failed:", await emailRes.text());
                else console.log("Email sent successfully");
            } else {
                console.warn("RESEND_API_KEY missing - skipping email");
            }
        } catch (mailErr) {
            console.error("Email Error:", mailErr);
        }

        return jsonResponse({ message: 'Inquiry received', id: result.name.split('/').pop() }, 201);
    } catch (e) {
        console.error("Inquiry Error:", e);
        return jsonResponse({ error: e.message }, 400);
    }
});

// GET /generate-upload-url
router.get('/generate-upload-url', async (request, env) => {
    const fileName = request.query.file;
    const fileType = request.query.type;

    if (!fileName) return jsonResponse({ error: "Missing file name" }, 400);

    try {
        if (!env.R2_ACCESS_KEY_ID) return jsonResponse({ message: "R2 Mock (Missing Credentials)" });

        const s3 = new S3Client({
            region: "auto",
            endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: env.R2_ACCESS_KEY_ID,
                secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            },
        });

        const sanitizedFileName = fileName.replace(/\s+/g, "_");
        const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
        const command = new PutObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: uniqueFileName,
            ContentType: fileType || "application/octet-stream",
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
        const publicUrl = `${env.R2_PUBLIC_DOMAIN}/${uniqueFileName}`;

        return jsonResponse({ uploadUrl, publicUrl });
    } catch (e) {
        return jsonResponse({ error: e.message }, 500);
    }
});

// ADMIN: Fix R2 CORS (One-time use)
// router.post('/api/admin/fix-r2-cors', async (request, env) => {
//     try {
//         if (!env.R2_ACCESS_KEY_ID) return jsonResponse({ message: "R2 Credentials Missing" });
//
//         const s3 = new S3Client({
//             region: "auto",
//             endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
//             credentials: {
//                 accessKeyId: env.R2_ACCESS_KEY_ID,
//                 secretAccessKey: env.R2_SECRET_ACCESS_KEY,
//             },
//         });
//
//         const command = new PutBucketCorsCommand({
//             Bucket: env.R2_BUCKET_NAME,
//             CORSConfiguration: {
//                 CORSRules: [
//                     {
//                         AllowedHeaders: ["*"],
//                         AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
//                         AllowedOrigins: ["*"], // Allow all origins (including localhost and pages.dev)
//                         ExposeHeaders: ["ETag"],
//                         MaxAgeSeconds: 3600
//                     }
//                 ]
//             }
//         });
//
//         await s3.send(command);
//         return jsonResponse({ message: "R2 CORS Policy Updated successfully" });
//     } catch (e) {
//         return jsonResponse({ error: e.message }, 500);
//     }
// });

// Health Check at root
router.get('/', (request, env) => {
    return jsonResponse({
        message: "Lakdinu Tours API is running",
        health: "/api/health"
    });
});

// Default 404 handler
router.all('*', () => new Response(JSON.stringify({ error: "Route not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json", ...corsHeaders }
}));

export default {
    async fetch(request, env, ctx) {
        console.log(`[Worker] Incoming request: ${request.method} ${request.url}`);
        console.log(`[Worker] Route: ${new URL(request.url).pathname}`);
        // Handle OPTIONS for Global CORS Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // itty-router handles the request and returns the result
            const response = await router.handle(request, env, ctx);
            console.log(`Router returned: ${response ? 'Response/Data' : 'undefined'}`);

            // If it's already a Response object, ensure CORS headers are attached
            if (response instanceof Response) {
                console.log(`Handling Response object, status: ${response.status}`);
                const newHeaders = new Headers(response.headers);
                // Force CORS headers
                Object.entries(corsHeaders).forEach(([key, value]) => {
                    newHeaders.set(key, value);
                });

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            }

            // If it's not a Response, wrap it as JSON with CORS
            console.log(`Wrapping non-Response as JSON: ${JSON.stringify(response)}`);
            return jsonResponse(response || { error: "No response from handler" });

        } catch (e) {
            console.error("Critical Worker Error:", e);
            // ENSURE CORS headers are sent even on critical failure
            return new Response(JSON.stringify({
                error: "Internal Server Error",
                message: e.message,
                stack: e.stack, // Optional: remove in production if sensitive
                debug: "Check if FIREBASE_SERVICE_ACCOUNT_JSON secret is set"
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                }
            });
        }
    },
};
