import fs from 'fs';

const data = JSON.parse(fs.readFileSync('e:/Lakdinu Tours/tours_export_2026-01-24.json', 'utf8'));

console.log("# Tour Routes Check\n");

data.forEach(tour => {
    console.log(`### ${tour.name}`);
    if (tour.itinerary && tour.itinerary.length > 0) {
        // Sort by day just in case
        const sortedItinerary = tour.itinerary.sort((a, b) => a.day - b.day);

        // Strategy 1: Just list the titles as the route path
        // Cleaning titles: Remove "Day X" prefixes if present (though not seen in sample), 
        // and maybe just join them with " -> "
        const route = sortedItinerary
            .map(item => item.title.trim())
            .join(' -> ');

        console.log(`**Route:** ${route}\n`);
    } else {
        console.log("**Route:** No itinerary data found.\n");
    }
});
