
async function testTailorMade() {
    const payload = {
        type: "Tailor Made",
        arrival: "2024-12-01T10:00",
        departure: "2024-12-10T18:00",
        adults: 2,
        children: 1,
        childAges: [5],
        rooms: {
            single: 0,
            double: 1,
            twin: 0,
            triple: 0,
            family: 0
        },
        hotelStar: "4 Star",
        mealPlan: "Half Board",
        interests: {
            culture: 80,
            nature: 60,
            beach: 40
        },
        name: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        country: "Testland",
        message: "This is a test message.",
        messageSummary: "Tailor Made Request for Test User."
    };

    try {
        const response = await fetch('http://localhost:8787/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Body:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

testTailorMade();
