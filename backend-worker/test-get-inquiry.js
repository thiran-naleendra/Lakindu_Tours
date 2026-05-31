
async function verifyGetInquiry(id) {
    try {
        const response = await fetch(`http://localhost:8787/api/inquiries/${id}`);
        const data = await response.json();

        console.log("Status:", response.status);
        if (response.ok) {
            console.log("Customer Name:", data.customer?.name);
            console.log("Tour Details:", JSON.stringify(data.tourDetails, null, 2));
            console.log("Interests:", JSON.stringify(data.interests, null, 2));
            console.log("Accomodation:", JSON.stringify(data.accommodation, null, 2));
        } else {
            console.log("Error Body:", data);
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

// ID from the previous successful POST test
verifyGetInquiry("bOXRAeL3IbevV9zxde5r");
