const axios = require('axios');

const API_URL = 'http://localhost:3001';

const listingsMock = [
    { title: "Villa avec vue mer à Essaouira", location: "Essaouira, Maroc", pricePerNight: 850, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"], type: "villa" },
    { title: "Riad traditionnel au cœur de Marrakech", location: "Marrakech, Maroc", pricePerNight: 1200, images: ["https://images.unsplash.com/photo-1553444836-bc6c8d340d56?w=800&q=80"], type: "other" },
    { title: "Appartement moderne à Casablanca", location: "Casablanca, Maroc", pricePerNight: 450, images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"], type: "apartment" }
];

async function seed() {
    try {
        console.log("Seeding data...");
        // 1. Create a user
        const userData = {
            name: "Admin Host",
            email: `admin_${Date.now()}@airbnb.com`,
            password: "password123"
        };
        const userRes = await axios.post(`${API_URL}/users`, userData);
        const hostId = userRes.data._id;
        console.log("Created host:", hostId);

        // 2. Create listings
        for (const item of listingsMock) {
            const locParts = item.location.split(', ');
            const listingData = {
                title: item.title,
                description: item.title + " descriptif",
                type: item.type,
                pricePerNight: item.pricePerNight,
                location: {
                    address: "Centre",
                    city: locParts[0] || "Ville",
                    country: locParts[1] || "Maroc"
                },
                images: item.images,
                maxGuests: 4,
                hostId: hostId
            };
            await axios.post(`${API_URL}/listings`, listingData);
            console.log("Created listing:", item.title);
        }
        console.log("Seeding done! Please check the frontend.");
    } catch (e) {
        console.error("Error seeding. Make sure backend is running AND connected to MongoDB.", e.message);
    }
}

seed();
