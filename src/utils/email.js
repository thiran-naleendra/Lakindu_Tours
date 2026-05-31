
export const sendInquiryEmail = async (inquiryData) => {
    try {
        // Flatten the complex object into a key-value pair for the table
        const emailBody = {
            _subject: `New Tailor-Made Inquiry: ${inquiryData.personalInfo.name}`,
            _template: 'table',
            _captcha: 'false',

            // Personal Info
            "Full Name": inquiryData.personalInfo.name,
            "Email": inquiryData.personalInfo.email,
            "Phone": inquiryData.personalInfo.phone,
            "Nationality": inquiryData.personalInfo.nationality,

            // Tour Details
            "Arrival": `${inquiryData.tourDetails.arrivalDate} usually at ${inquiryData.tourDetails.arrivalTime}`,
            "Departure": `${inquiryData.tourDetails.departureDate} usually at ${inquiryData.tourDetails.departureTime}`,
            "Duration": `${inquiryData.tourDetails.duration} Days`,
            "Adults": inquiryData.tourDetails.adults,
            "Children": inquiryData.tourDetails.children,
            "Child Ages": inquiryData.tourDetails.childAges && inquiryData.tourDetails.childAges.length > 0 ? inquiryData.tourDetails.childAges.join(', ') : 'N/A',

            // Accommodation
            "Room Types": Object.entries(inquiryData.accommodation.rooms)
                .filter(([_, qty]) => qty > 0)
                .map(([type, qty]) => `${type}: ${qty}`)
                .join(', ') || 'No preference',
            "Hotel Star Rating": inquiryData.accommodation.starRating.join(', '),
            "Meal Plan": inquiryData.accommodation.mealPlan.join(', '),
            "Vehicle Preference": inquiryData.accommodation.vehicleType.join(', '),

            // Interests (0-100 values)
            "Nature & Wildlife": `${inquiryData.interests.nature}%`,
            "Culture & Heritage": `${inquiryData.interests.culture}%`,
            "Adventure": `${inquiryData.interests.adventure}%`,
            "Beach & Relax": `${inquiryData.interests.beach}%`,
            "Local Life": `${inquiryData.interests.localLife}%`,

            // Message
            "Additional Message": inquiryData.personalInfo.message
        };

        const response = await fetch("https://formsubmit.co/ajax/srilankanleisuretravels@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailBody)
        });

        const result = await response.json();
        return result.success === "true" || response.ok;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false; // Fail silently in UI or handle as needed, but returning false allows UI to show "Saved but email failed" if we want
    }
};
